// moment.js
// version : 1.5.1
// author : Tim Wood
// license : MIT
// momentjs.com

(function (Date, undefined) {

    var moment,
        round = Math.round,
        languages = {},
        hasModule = (typeof module !== 'undefined'),
        paramsToParse = 'months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem'.split('|'),
        i,
        jsonRegex = /^\/?Date\((\-?\d+)/i,
        charactersToReplace = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|zz?|ZZ?|LT|LL?L?L?)/g,
        nonuppercaseLetters = /[^A-Z]/g,
        timezoneRegex = /\([A-Za-z ]+\)|:[0-9]{2} [A-Z]{3} /g,
        tokenCharacters = /(\\)?(MM?M?M?|dd?d?d|DD?D?D?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|ZZ?|T)/g,
        inputCharacters = /(\\)?([0-9]+|([a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+|([\+\-]\d\d:?\d\d))/gi,
        isoRegex = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',
        isoTimes = [
            ['HH:mm:ss', /T\d\d:\d\d:\d\d/],
            ['HH:mm', /T\d\d:\d\d/],
            ['HH', /T\d\d/]
        ],
        timezoneParseRegex = /([\+\-]|\d\d)/gi,
        VERSION = "1.5.1",
        shortcuts = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|');

    // Moment prototype object
    function Moment(date, isUTC) {
        this._d = date;
        this._isUTC = !!isUTC;
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    // helper function for _.addTime and _.subtractTime
    function dateAddRemove(date, _input, adding, val) {
        var isString = (typeof _input === 'string'),
            input = isString ? {} : _input,
            ms, d, M, currentDate;
        if (isString && val) {
            input[_input] = +val;
        }
        ms = (input.ms || input.milliseconds || 0) +
            (input.s || input.seconds || 0) * 1e3 + // 1000
            (input.m || input.minutes || 0) * 6e4 + // 1000 * 60
            (input.h || input.hours || 0) * 36e5; // 1000 * 60 * 60
        d = (input.d || input.days || 0) +
            (input.w || input.weeks || 0) * 7;
        M = (input.M || input.months || 0) +
            (input.y || input.years || 0) * 12;
        if (ms) {
            date.setTime(+date + ms * adding);
        }
        if (d) {
            date.setDate(date.getDate() + d * adding);
        }
        if (M) {
            currentDate = date.getDate();
            date.setDate(1);
            date.setMonth(date.getMonth() + M * adding);
            date.setDate(Math.min(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), currentDate));
        }
        return date;
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(input) {
        return new Date(input[0], input[1] || 0, input[2] || 1, input[3] || 0, input[4] || 0, input[5] || 0, input[6] || 0);
    }

    // format date using native date object
    function formatMoment(m, inputString) {
        var currentMonth = m.month(),
            currentDate = m.date(),
            currentYear = m.year(),
            currentDay = m.day(),
            currentHours = m.hours(),
            currentMinutes = m.minutes(),
            currentSeconds = m.seconds(),
            currentZone = -m.zone(),
            ordinal = moment.ordinal,
            meridiem = moment.meridiem;
        // check if the character is a format
        // return formatted string or non string.
        //
        // uses switch/case instead of an object of named functions (like http://phpjs.org/functions/date:380)
        // for minification and performance
        // see http://jsperf.com/object-of-functions-vs-switch for performance comparison
        function replaceFunction(input) {
            // create a couple variables to be used later inside one of the cases.
            var a, b;
            switch (input) {
                // MONTH
            case 'M' :
                return currentMonth + 1;
            case 'Mo' :
                return (currentMonth + 1) + ordinal(currentMonth + 1);
            case 'MM' :
                return leftZeroFill(currentMonth + 1, 2);
            case 'MMM' :
                return moment.monthsShort[currentMonth];
            case 'MMMM' :
                return moment.months[currentMonth];
            // DAY OF MONTH
            case 'D' :
                return currentDate;
            case 'Do' :
                return currentDate + ordinal(currentDate);
            case 'DD' :
                return leftZeroFill(currentDate, 2);
            // DAY OF YEAR
            case 'DDD' :
                a = new Date(currentYear, currentMonth, currentDate);
                b = new Date(currentYear, 0, 1);
                return ~~ (((a - b) / 864e5) + 1.5);
            case 'DDDo' :
                a = replaceFunction('DDD');
                return a + ordinal(a);
            case 'DDDD' :
                return leftZeroFill(replaceFunction('DDD'), 3);
            // WEEKDAY
            case 'd' :
                return currentDay;
            case 'do' :
                return currentDay + ordinal(currentDay);
            case 'ddd' :
                return moment.weekdaysShort[currentDay];
            case 'dddd' :
                return moment.weekdays[currentDay];
            // WEEK OF YEAR
            case 'w' :
                a = new Date(currentYear, currentMonth, currentDate - currentDay + 5);
                b = new Date(a.getFullYear(), 0, 4);
                return ~~ ((a - b) / 864e5 / 7 + 1.5);
            case 'wo' :
                a = replaceFunction('w');
                return a + ordinal(a);
            case 'ww' :
                return leftZeroFill(replaceFunction('w'), 2);
            // YEAR
            case 'YY' :
                return leftZeroFill(currentYear % 100, 2);
            case 'YYYY' :
                return currentYear;
            // AM / PM
            case 'a' :
                return currentHours > 11 ? meridiem.pm : meridiem.am;
            case 'A' :
                return currentHours > 11 ? meridiem.PM : meridiem.AM;
            // 24 HOUR
            case 'H' :
                return currentHours;
            case 'HH' :
                return leftZeroFill(currentHours, 2);
            // 12 HOUR
            case 'h' :
                return currentHours % 12 || 12;
            case 'hh' :
                return leftZeroFill(currentHours % 12 || 12, 2);
            // MINUTE
            case 'm' :
                return currentMinutes;
            case 'mm' :
                return leftZeroFill(currentMinutes, 2);
            // SECOND
            case 's' :
                return currentSeconds;
            case 'ss' :
                return leftZeroFill(currentSeconds, 2);
            // TIMEZONE
            case 'zz' :
                // depreciating 'zz' fall through to 'z'
            case 'z' :
                return (m._d.toString().match(timezoneRegex) || [''])[0].replace(nonuppercaseLetters, '');
            case 'Z' :
                return (currentZone < 0 ? '-' : '+') + leftZeroFill(~~(Math.abs(currentZone) / 60), 2) + ':' + leftZeroFill(~~(Math.abs(currentZone) % 60), 2);
            case 'ZZ' :
                return (currentZone < 0 ? '-' : '+') + leftZeroFill(~~(10 * Math.abs(currentZone) / 6), 4);
            // LONG DATES
            case 'L' :
            case 'LL' :
            case 'LLL' :
            case 'LLLL' :
            case 'LT' :
                return formatMoment(m, moment.longDateFormat[input]);
            // DEFAULT
            default :
                return input.replace(/(^\[)|(\\)|\]$/g, "");
            }
        }
        return inputString.replace(charactersToReplace, replaceFunction);
    }

    // date from string and format string
    function makeDateFromStringAndFormat(string, format) {
        var inArray = [0, 0, 1, 0, 0, 0, 0],
            timezoneHours = 0,
            timezoneMinutes = 0,
            isUsingUTC = false,
            inputParts = string.match(inputCharacters),
            formatParts = format.match(tokenCharacters),
            len = Math.min(inputParts.length, formatParts.length),
            i,
            isPm;

        // function to convert string input to date
        function addTime(format, input) {
            var a;
            switch (format) {
            // MONTH
            case 'M' :
                // fall through to MM
            case 'MM' :
                inArray[1] = ~~input - 1;
                break;
            case 'MMM' :
                // fall through to MMMM
            case 'MMMM' :
                for (a = 0; a < 12; a++) {
                    if (moment.monthsParse[a].test(input)) {
                        inArray[1] = a;
                        break;
                    }
                }
                break;
            // DAY OF MONTH
            case 'D' :
                // fall through to DDDD
            case 'DD' :
                // fall through to DDDD
            case 'DDD' :
                // fall through to DDDD
            case 'DDDD' :
                inArray[2] = ~~input;
                break;
            // YEAR
            case 'YY' :
                input = ~~input;
                inArray[0] = input + (input > 70 ? 1900 : 2000);
                break;
            case 'YYYY' :
                inArray[0] = ~~Math.abs(input);
                break;
            // AM / PM
            case 'a' :
                // fall through to A
            case 'A' :
                isPm = (input.toLowerCase() === 'pm');
                break;
            // 24 HOUR
            case 'H' :
                // fall through to hh
            case 'HH' :
                // fall through to hh
            case 'h' :
                // fall through to hh
            case 'hh' :
                inArray[3] = ~~input;
                break;
            // MINUTE
            case 'm' :
                // fall through to mm
            case 'mm' :
                inArray[4] = ~~input;
                break;
            // SECOND
            case 's' :
                // fall through to ss
            case 'ss' :
                inArray[5] = ~~input;
                break;
            // TIMEZONE
            case 'Z' :
                // fall through to ZZ
            case 'ZZ' :
                isUsingUTC = true;
                a = (input || '').match(timezoneParseRegex);
                if (a && a[1]) {
                    timezoneHours = ~~a[1];
                }
                if (a && a[2]) {
                    timezoneMinutes = ~~a[2];
                }
                // reverse offsets
                if (a && a[0] === '+') {
                    timezoneHours = -timezoneHours;
                    timezoneMinutes = -timezoneMinutes;
                }
                break;
            }
        }
        for (i = 0; i < len; i++) {
            addTime(formatParts[i], inputParts[i]);
        }
        // handle am pm
        if (isPm && inArray[3] < 12) {
            inArray[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (isPm === false && inArray[3] === 12) {
            inArray[3] = 0;
        }
        // handle timezone
        inArray[3] += timezoneHours;
        inArray[4] += timezoneMinutes;
        // return
        return isUsingUTC ? new Date(Date.UTC.apply({}, inArray)) : dateFromArray(inArray);
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(string, formats) {
        var output,
            inputParts = string.match(inputCharacters),
            scores = [],
            scoreToBeat = 99,
            i,
            curDate,
            curScore;
        for (i = 0; i < formats.length; i++) {
            curDate = makeDateFromStringAndFormat(string, formats[i]);
            curScore = compareArrays(inputParts, formatMoment(new Moment(curDate), formats[i]).match(inputCharacters));
            if (curScore < scoreToBeat) {
                scoreToBeat = curScore;
                output = curDate;
            }
        }
        return output;
    }

    // date from iso format
    function makeDateFromString(string) {
        var format = 'YYYY-MM-DDT',
            i;
        if (isoRegex.exec(string)) {
            for (i = 0; i < 3; i++) {
                if (isoTimes[i][1].exec(string)) {
                    format += isoTimes[i][0];
                    break;
                }
            }
            return makeDateFromStringAndFormat(string, format + 'Z');
        }
        return new Date(string);
    }

    // helper function for _date.from() and _date.fromNow()
    function substituteTimeAgo(string, number, withoutSuffix) {
        var rt = moment.relativeTime[string];
        return (typeof rt === 'function') ?
            rt(number || 1, !!withoutSuffix, string) :
            rt.replace(/%d/i, number || 1);
    }

    function relativeTime(milliseconds, withoutSuffix) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        return substituteTimeAgo.apply({}, args);
    }

    moment = function (input, format) {
        if (input === null || input === '') {
            return null;
        }
        var date,
            matched;
        // parse Moment object
        if (input && input._d instanceof Date) {
            date = new Date(+input._d);
        // parse string and format
        } else if (format) {
            if (isArray(format)) {
                date = makeDateFromStringAndArray(input, format);
            } else {
                date = makeDateFromStringAndFormat(input, format);
            }
        // evaluate it as a JSON-encoded date
        } else {
            matched = jsonRegex.exec(input);
            date = input === undefined ? new Date() :
                matched ? new Date(+matched[1]) :
                input instanceof Date ? input :
                isArray(input) ? dateFromArray(input) :
                typeof input === 'string' ? makeDateFromString(input) :
                new Date(input);
        }
        return new Moment(date);
    };

    // creating with utc
    moment.utc = function (input, format) {
        if (isArray(input)) {
            return new Moment(new Date(Date.UTC.apply({}, input)), true);
        }
        return (format && input) ? moment(input + ' 0', format + ' Z').utc() : moment(input).utc();
    };

    // humanizeDuration
    moment.humanizeDuration = function (num, type, withSuffix) {
        var difference = +num,
            rel = moment.relativeTime,
            output;
        switch (type) {
        case "seconds" :
            difference *= 1000; // 1000
            break;
        case "minutes" :
            difference *= 60000; // 60 * 1000
            break;
        case "hours" :
            difference *= 3600000; // 60 * 60 * 1000
            break;
        case "days" :
            difference *= 86400000; // 24 * 60 * 60 * 1000
            break;
        case "weeks" :
            difference *= 604800000; // 7 * 24 * 60 * 60 * 1000
            break;
        case "months" :
            difference *= 2592000000; // 30 * 24 * 60 * 60 * 1000
            break;
        case "years" :
            difference *= 31536000000; // 365 * 24 * 60 * 60 * 1000
            break;
        default :
            withSuffix = !!type;
            break;
        }
        output = relativeTime(difference, !withSuffix);
        return withSuffix ? (difference <= 0 ? rel.past : rel.future).replace(/%s/i, output) : output;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // language switching and caching
    moment.lang = function (key, values) {
        var i,
            param,
            req,
            parse = [];
        if (values) {
            for (i = 0; i < 12; i++) {
                parse[i] = new RegExp('^' + values.months[i] + '|^' + values.monthsShort[i].replace('.', ''), 'i');
            }
            values.monthsParse = values.monthsParse || parse;
            languages[key] = values;
        }
        if (languages[key]) {
            for (i = 0; i < paramsToParse.length; i++) {
                param = paramsToParse[i];
                moment[param] = languages[key][param] || moment[param];
            }
        } else {
            if (hasModule) {
                req = require('./lang/' + key);
                moment.lang(key, req);
            }
        }
    };

    // set default language
    moment.lang('en', {
        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        meridiem : {
            AM : 'AM',
            am : 'am',
            PM : 'PM',
            pm : 'pm'
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        ordinal : function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        }
    });

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // shortcut for prototype
    moment.fn = Moment.prototype = {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d;
        },

        'native' : function () {
            return this._d;
        },

        toString : function () {
            return this._d.toString();
        },

        toDate : function () {
            return this._d;
        },

        utc : function () {
            this._isUTC = true;
            return this;
        },

        local : function () {
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            return formatMoment(this, inputString ? inputString : moment.defaultFormat);
        },

        add : function (input, val) {
            this._d = dateAddRemove(this._d, input, 1, val);
            return this;
        },

        subtract : function (input, val) {
            this._d = dateAddRemove(this._d, input, -1, val);
            return this;
        },

        diff : function (input, val, asFloat) {
            var inputMoment = moment(input),
                zoneDiff = (this.zone() - inputMoment.zone()) * 6e4,
                diff = this._d - inputMoment._d - zoneDiff,
                year = this.year() - inputMoment.year(),
                month = this.month() - inputMoment.month(),
                date = this.date() - inputMoment.date(),
                output;
            if (val === 'months') {
                output = year * 12 + month + date / 30;
            } else if (val === 'years') {
                output = year + month / 12;
            } else {
                output = val === 'seconds' ? diff / 1e3 : // 1000
                    val === 'minutes' ? diff / 6e4 : // 1000 * 60
                    val === 'hours' ? diff / 36e5 : // 1000 * 60 * 60
                    val === 'days' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                    val === 'weeks' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                    diff;
            }
            return asFloat ? output : round(output);
        },

        from : function (time, withoutSuffix) {
            return moment.humanizeDuration(this.diff(time), !withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().sod(), 'days', true),
                calendar = moment.calendar,
                allElse = calendar.sameElse,
                format = diff < -6 ? allElse :
                diff < -1 ? calendar.lastWeek :
                diff < 0 ? calendar.lastDay :
                diff < 1 ? calendar.sameDay :
                diff < 2 ? calendar.nextDay :
                diff < 7 ? calendar.nextWeek : allElse;
            return this.format(typeof format === 'function' ? format.apply(this) : format);
        },

        isLeapYear : function () {
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        isDST : function () {
            return (this.zone() < moment([this.year()]).zone() || 
                this.zone() < moment([this.year(), 5]).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return input == null ? day :
                this.add({ d : input - day });
        },

        sod: function () {
            return this.clone()
                .hours(0)
                .minutes(0)
                .seconds(0)
                .milliseconds(0);
        },

        eod: function () {
            // end of day = start of day plus 1 day, minus 1 millisecond
            return this.sod().add({
                d : 1,
                ms : -1
            });
        },

        zone : function () {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },

        daysInMonth : function () {
            return this.clone().month(this.month() + 1).date(0).date();
        }
    };

    // helper for adding shortcuts
    function makeShortcut(name, key) {
        moment.fn[name] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < shortcuts.length; i ++) {
        makeShortcut(shortcuts[i].toLowerCase(), shortcuts[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeShortcut('year', 'FullYear');

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    }
    if (typeof window !== 'undefined') {
        window.moment = moment;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("moment", [], function () {
            return moment;
        });
    }
})(Date);
