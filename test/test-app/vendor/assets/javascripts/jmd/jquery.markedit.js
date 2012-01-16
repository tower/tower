// Confirm jQuery/Ui is present.  If not give a friendly message.
//if (!jQuery) { throw "jQuery is required to be loaded before markedit can be used."; }
//if (!jQuery.ui) { throw "jQuery UI is required to be loaded before markedit can be used."; }

(function($) {

    //
    //  Language defaults (en-US)
    //
    var MarkEditLanguageDefaults = function() {

        return {

            'defaultButtons': {
                'bold': {
                    'tip': 'Bold'
                },
                'italic': {
                    'tip': 'Italic'
                },
                'link': {
                    'tip': 'Insert Hyperlink'
                },
                'image': {
                    'tip': 'Insert Image'
                },
                'code': {
                    'tip': 'Code Sample'
                },
                'quote': {
                    'tip': 'Blockquote'
                },
                'numberlist': {
                    'tip': 'Numered List'
                },
                'bulletlist': {
                    'tip': 'Bullet List'
                },
                'line': {
                    'tip': 'Horizontal Line'
                },
                'heading': {
                    'tip': 'Heading'
                },
                'undo': {
                    'tip': 'Undo'
                },
                'redo': {
                    'tip': 'Redo'
                },
                'edit': {
                    'text': 'Compose',
                    'tip': 'View in Edit Mode'
                },
                'preview': {
                    'text': 'Preview',
                    'tip': 'View in Preview Mode'
                }
            },

            'dialog': {
                'insertLink': {
                    'title': 'Insert Link',
                    'helpText': 'Enter the URL to be inserted.',
                    'insertButton': 'Insert',
                    'cancelButton': 'Cancel'
                },
                'insertImage': {
                    'title':'Insert Image',
                    'helpText': 'Enter the URL of the image to be inserted.',
                    'insertButton': 'Insert',
                    'cancelButton': 'Cancel'
                }
            },

            'errors' : {
                'markeditNotTextarea':'MarkEdit tag must be a <textarea>',
                'cannotLocateTextarea':'<textarea> tag could not be located in order to fetch the markeditGetState.'
            }

        };

    };


    // Initialize Language object
    // This object can be loaded externally by another script to provide
    if (typeof(MarkEditLanguage) === 'undefined') {
        MarkEditLanguage = MarkEditLanguageDefaults();
    }
    else {
        MarkEditLanguage = $.extend({}, MarkEditLanguageDefaults(), MarkEditLanguage);
    }

    // Declare history object; Might use it later.
    var MarkEditHistory = null;
    var MarkEditIndex = 0;

   /*
        Button Definition
        {
            'id' : String,              -- Used to identify the button
            'css' : String,             -- CSS class(es) to add to the button
            'tip' : String,             -- Mouse-over tool tip to be shown (html Title)
            'click' : function,         -- Function to be executed on Click event
            'mouseover' : function,     -- Function to be executed on Click event
            'mouseout' : function       -- Function to be executed on Click event
        }
    */


    //
    //  $.markeditToolbar
    //
    $.fn.markeditToolbar = function(config) {
        $(this).each(function() {
            var options = $.extend({}, $.fn.markeditToolbar.defaults, config);
            MarkEditToolbar.createToolbar(this, options);
        });
        return this;
    };


    //
    //  $.markeditToolbar.defaults
    //
    $.fn.markeditToolbar.defaults = {
        'backgroundMode': 'light',
        'layout': 'bold italic | link quote code image | numberlist bulletlist heading line',
        'buttons' : []           // Uses button definition (see above)
    };


    //
    //  $.markeditAddGroup
    //
    $.fn.markeditAddGroup = function(toggleGroup, cssClass) {

        var groups = [];

        $(this).each(function() {
            var css = 'toolbar-group';

            // Add css classes based on config
            if (typeof(cssClass) !== 'undefined'){
                css += ' ' + cssClass;
            }
            if (toggleGroup) {
                css += ' toggle-group';
            }

            // Create markup
            groups[groups.length] = $('<div class="' + css + '"></div>').appendTo(this);
        });

        if (groups.length > 1) {
            return groups;
        }
        else {
            return groups[0];
        }
    };


    //
    //  $.markeditAddButton
    //
    $.fn.markeditAddButton = function(button) {

        var tags = [];

        $(this).each(function() {

            var tag = $('<button type="button">&nbsp;</button>').appendTo(this);

            // Set attributes
            if (typeof(button.text) !== 'undefined') {
                tag.text(button.text);
            } else {
                tag.addClass('icon');
            }

            if (typeof(button.tip) !== 'undefined') {
                tag.attr('title', button.tip);
            }

            tag.addClass('ui-state-default');
            tag.addClass('ui-corner-all');
            tag.addClass(button.id);

            if (typeof(button.toggle) !== 'undefined') {
                if (button.toggle === true) {
                    tag.addClass('toggle');
                }
            }

            if (typeof(button.css) !== 'undefined') {
                tag.addClass(button.css);
            }

            // Bind events for new button
            // Click
            if (tag.hasClass('toggle')) {
                // If toggle, call click only if inactive and update visual
                tag.bind('click', function(){
                   if ($(this).hasClass('ui-state-active') === false) {
                        button.click();

                        // Drop active state from others
                        $(this).parent().children().each(function(){
                            $(this).removeClass('ui-state-active');
                        });
                        // Set active state on current button
                        $(this).addClass('ui-state-active');
                   }
                });
            }
            else {
                tag.bind('click', function(){
                   button.click();
                });
            }

            // Mouse Over
            tag.bind('mouseover', function(){
                tag.addClass("ui-state-hover");
                if (typeof(button.mouseover) !== 'undefined') {
                    button.mouseover();
                }
            });

            // Mouse Out
            tag.bind('mouseout', function(){
                tag.removeClass("ui-state-hover");
                if (typeof(button.mouseout) !== 'undefined') {
                    button.mouseout();
                }
            });

            tags[tags.length] = tag;

        });

        if (tags.length > 1) {
            return tags;
        }
        else {
            return tags[0];
        }

    };


    //
    //  $.markedit  (THE BIG ENCHILLADA)
    //
    $.fn.markedit = function(config) {

        return $(this).each(function() {

            var options = $.extend({}, $.fn.markedit.defaults, config);
            options.toolbar = $.extend({}, $.fn.markeditToolbar.defaults, options.toolbar);

            if (this.tagName !== 'TEXTAREA') { throw MarkEditLanguage.errors.markeditNotTextarea; }

            // If no id, generate a unique one
            if (typeof($(this).attr('id')) === 'undefined') {
                var uniqueId = 'markedit-' + String(++MarkEditIndex);
                $(this).attr('id', uniqueId);
            }

            // Initailize History object if it's enabled
            if ( options.history ) {
                // Initializing the History object will let the rest of MarkEdit know
                if (MarkEditHistory === null) {
                    MarkEditHistory = {};
                }

                // Add an entry for this instance of MarkEdit
                MarkEditHistory[$(this).attr('id')] = { 'undo': [], 'redo': [] };

                // Set current state as first history item
                MarkEdit.appendHistory($(this).markeditGetState(), $(this).attr('id'));

                // Bind events to update history
                var textarea = $(this);
                $(this).keyup(function() {
                    MarkEdit.appendHistory($(textarea).markeditGetState(), $(textarea).attr('id'));
                });
            }

            // Wrap our whole widget in a <div>
            $(this).wrap('<div class="markedit"></div>');
            var parent = $(this).parent();

            // Fire preload event
            options.preload(parent.get(0));

            // Adjust toolbar based on options
            if (options.history && options.addHistoryButtons) {
                options.toolbar.layout += ' | undo redo';
            }
            if (options.preview === 'toolbar') {
                options.toolbar.layout += ' | (edit preview)';
            }

            // Create toolbar
            var toolbar = $(parent).markeditToolbar(options.toolbar, options.foregroundMode);

            // Create preview pane
            if (options.preview !== false) {
                var previewPane = $('<div class="markedit-preview ui-widget-content"></div>');

                // Set initial state for preview if enabled (now that it's created)
                if (options.preview === 'toolbar') {
                    $(parent).append(previewPane);

                    var editButton = $(toolbar).children().find('button.edit');
                    editButton.addClass('ui-state-active');
                    editButton.parent().addClass('preview');

                    // Hide preview initially
                    $(previewPane).addClass('toggle-preview');
                    $(previewPane).attr('style', 'display:none');

                }
                else if (options.preview === 'bottom' || options.preview === 'below') {

                    $(parent).append(previewPane);
                    $(previewPane).addClass('bottom-preview');
                    $(this).markeditBindAutoPreview(previewPane);

                }
                else if (options.preview === 'top' || options.preview === 'above') {

                    $(parent).prepend(previewPane);
                    $(previewPane).addClass('top-preview');
                    $(this).markeditBindAutoPreview(previewPane);

                }
                else if (options.preview !== false) {
                    throw "Preview option '" + options.preview + "' is not recognized.";
                }
            }

            // Fire postload event
            options.postload();
        });
    };


    //
    //  $.markedit.defaults
    //
    $.fn.markedit.defaults = {

        // features
        'preview': 'toolbar',       // Possible values:  toolbar, bottom || below, above || top, false
        'history': true,

        // markup
        'newlineToBr': true,
        'noPWrap': true,

        // functions
        'addHistoryButtons': true,
        'toolbar': $(this).markeditToolbar.defaults,

        // events
        'preload': function(){},
        'postload': function(){}

    };


    //
    //  $.markeditGetState
    //
    $.fn.markeditGetState = function() {

        //  GetState will return the following state object:
        //  state {
        //      'beforeSelect': String,
        //      'select': String,
        //      'afterSelect': String,
        //      'links': [
        //          { Number, String },
        //      ],
        //  }

        // Locate textarea
        var textarea = MarkEdit.getTextArea(this);
        textarea.focus();

        // Get IE selection (of course IE would take 5x the amount of code)
        var r;
        if (document.selection) {
            var range = document.selection.createRange();
            if (range !== null) {

                // Get original text/selected text (as MS ranges) and parse
                var textareaRange = textarea.createTextRange();
                var beforeWithSelRange = textarea.createTextRange();
                r = MarkEdit.getMarkdownLinks(textareaRange.text);

                // Shift to area that's actually selected (using the document selection)
                textareaRange.moveToBookmark(range.getBookmark());
                beforeWithSelRange.setEndPoint('EndToEnd', textareaRange);

                // Infer the pieces based on what IE gives us
                var before = beforeWithSelRange.text;
                before = before.substr(0, before.length - textareaRange.text.length);
                var after = r.remainder.substr(before.length + textareaRange.text.length);

                // Standardize line breaks
                before = before.replace(/\r/g, '');
                select = textareaRange.text.replace(/\r/g, '');
                after = after.replace(/\r/g, '');

                return {
                    'beforeSelect': before,
                    'select': select,
                    'afterSelect': after,
                    'links': r.links
                };
            }
            else {
                textarea.selectionStart = 0;
                textarea.selectionEnd = 0;
            }
        }

        r = MarkEdit.getMarkdownLinks($(textarea).val());
        return {
            'beforeSelect': r.remainder.substr(0, textarea.selectionStart),
            'select': r.remainder.substr(textarea.selectionStart, (textarea.selectionEnd - textarea.selectionStart)),
            'afterSelect': r.remainder.substr(textarea.selectionEnd),
            'links': r.links
        };

    };


    //
    //  $.markeditSetState
    //
    $.fn.markeditSetState = function(state) {

        // Locate textarea
        var textarea = MarkEdit.getTextArea(this);

        MarkEdit.setState(textarea, state);
        MarkEdit.appendHistory(state, $(textarea).attr('id'));

    };


    //
    //  $.markeditUndo
    //
    $.fn.markeditUndo = function() {

        // Locate textarea
        var textarea = MarkEdit.getTextArea(this);
        var id = $(textarea).attr('id');

        if (MarkEditHistory !== null) {
            if (typeof(MarkEditHistory[id]) !== 'undefined') {

                var undo = MarkEditHistory[id].undo;
                var redo = MarkEditHistory[id].redo;
                if (undo.length > 1) {
                    redo.push(undo[undo.length-1]);
                    undo.pop();
                    var state = undo[undo.length-1];
                    MarkEdit.setState(textarea, state);
                }

            }
        }
    };


    //
    //  $.markeditRedo
    //
    $.fn.markeditRedo = function() {

        // Locate textarea
        var textarea = MarkEdit.getTextArea(this);
        var id = $(textarea).attr('id');

        if (MarkEditHistory !== null) {
            if (typeof(MarkEditHistory[id]) !== 'undefined') {

                var undo = MarkEditHistory[id].undo;
                var redo = MarkEditHistory[id].redo;
                if (redo.length > 0) {
                    undo.push(redo[redo.length-1]);
                    redo.pop();
                    MarkEdit.setState(textarea, undo[undo.length-1]);
                }

            }
        }
    };


    //
    //  $.markeditSetBold
    //
    $.fn.markeditSetBold = function(){
        var state = $(this).markeditGetState();

        state = MarkEdit.stateTrim(state);
        state.select = '**' + state.select + '**';

        $(this).markeditSetState(state);
        return this;
    };


    //
    //  $.markeditSetItalic
    //
    $.fn.markeditSetItalic = function(){
        var state = $(this).markeditGetState();

        state = MarkEdit.stateTrim(state);
        state.select = '_' + state.select + '_';

        $(this).markeditSetState(state);
        return this;
    };


    //
    //  $.markeditSetLinkOrImage
    //
    $.fn.markeditSetLinkOrImage = function(image, url, text, overwriteSelection) {

        var state = $(this).markeditGetState();

        // Prep arguments
        if (typeof(image) === 'undefined') { image = false; }

        // Make sure selection is clean and get selected Url
        // This also adds state.selectedUrl and state.selectedUrlIndex to the state
        state = MarkEdit.cleanSelection(state, MarkEdit.RegexLinkStart, MarkEdit.RegexLinkEnd);

        // Get the selected URL
        var afterMatch = MarkEdit.RegexLinkEnd.exec(state.afterSelect);
        var urlIndex = -1;
        var selUrl = '';
        if (afterMatch) {
            urlIndex = Number(afterMatch[2]) - 1;
            selUrl = state.links[urlIndex];
        }

        // If no URL open up the dialog and initialize callback
        if (typeof(url) === 'undefined') {

            var defaultValue = 'http://';
            var config = null;

            if (image) { config = MarkEditLanguage.dialog.insertImage; }
            else { config = MarkEditLanguage.dialog.insertLink; }
            if (selUrl.length > 0) { defaultValue = selUrl; }

            var parent_tag = this;
            MarkEdit.basicPrompt(config, defaultValue, function(promptValue) {  // Ok Click:
                // IE will loose the selection state unless we re-apply it
                $(parent_tag).markeditSetState(state);
                $(parent_tag).markeditSetLinkOrImage(image, promptValue, text, overwriteSelection);
            }, function(){  // Cancel Click:
                // IE will loose the selection state unless we re-apply it
                $(parent_tag).markeditSetState(state);
            });

        }
        else {

            // Set link text/image alt text if a selection is not already present
            if (text) {
                if (state.select.length === 0 || overwriteSelection) {
                    state.select = text;
                }
            }

            // If we already have a link/image and we're inserting another one
            // just change the URL instead of doubling up the markdown syntax
            if (urlIndex !== -1) {
                state.links[urlIndex] = url;
            }
            else {
                // Otherwise, insert a new link/image
                state.links[state.links.length] = url;

                if (image) {
                    state.select = '![' + state.select;
                }
                else {
                    state.select = '[' + state.select;
                }

                state.select += '][' + state.links.length + ']';
            }

            $(this).markeditSetState(state);

        }

        return this;
    };


    //
    //  $.markeditSetCode
    //
    $.fn.markeditSetCode = function(){
        var state = $(this).markeditGetState();

        // Clean the inline-code selection (if present)
        state = MarkEdit.cleanSelection(state, /`(.*)?$/, /^(.*)?`/);

        // Determine if we have an existing code
        var inline = (state.beforeSelect.search(/`$/) > -1);
        var indentBeforeSelect = (state.beforeSelect.search(/ {4}$/) > -1);
        var indentInSelect = (state.select.search(/^ {4}/) > -1);
        var selectLines = [];

        if (inline) {
            state.beforeSelect = state.beforeSelect.substr(0, state.beforeSelect.length -1);
            state.afterSelect = state.afterSelect.substr(1);
        }
        else if (indentBeforeSelect || indentInSelect) {
            selectLines = state.select.split('\n');
            state.select = '';

            // Remove indented code
            for (var i = 0; i < selectLines.length; i++ ) {

                // Determine if the 4-space indent is selected or not
                if (indentBeforeSelect && i === 0) {
                    state.beforeSelect = state.beforeSelect.substr(0, state.beforeSelect.length - 4);
                    state.select += selectLines[i];
                }
                else {
                    state.select += selectLines[i].substr(4);
                }

                // Add line returns since we trimmed them
                if (i !== (selectLines.length - 1)) {
                    state.select += '\n';
                }
            }
        }
        else {
            // No existing code markdown is present
            // Determine if we're at the beginning of a line or if we're inline
            if (state.beforeSelect.search(/\n$/) > -1) {
                // Add indented code
                selectLines = state.select.split('\n');
                state.select = '';

                for (var j = 0; j < selectLines.length; j++ ) {
                    state.select += '    ' + selectLines[j];
                    if (j !== (selectLines.length - 1)) {
                        state.select += '\n';
                    }
                }
            }
            else {
                // Set inline code
                state.select = '`' + state.select + '`';
            }
        }

        $(this).markeditSetState(state);
        return this;
    };


    //
    //  $.markeditSetQuote
    //
    $.fn.markeditSetQuote = function() {
        var state = $(this).markeditGetState();

        // Check if we have an existing list
        var altSelects = [];
        altSelects[0] = MarkEdit.RegexNumberPrefix;
        altSelects[1] = MarkEdit.RegexBulletPrefix;

        state = MarkEdit.setPrefix(state, MarkEdit.RegexQuotePrefix, altSelects, function(){
            return '> ';
        });

        $(this).markeditSetState(state);
    };


    //
    //  $.markeditSetList
    //
    $.fn.markeditSetList = function(type) {
        var state = $(this).markeditGetState();

        // Check if we have an existing list
        var altSelects = [];
        var pattern;
        if (type === 'number') {
            pattern = MarkEdit.RegexNumberPrefix;
            altSelects[0] = MarkEdit.RegexBulletPrefix;
        } else if (type === 'bullet') {
            pattern = MarkEdit.RegexBulletPrefix;
            altSelects[0] = MarkEdit.RegexNumberPrefix;
        }
        altSelects[1] = MarkEdit.RegexQuotePrefix;

        state = MarkEdit.setPrefix(state, pattern, altSelects, function(){
            if (type === 'number') {
                var listNum = MarkEdit.getNextListNumber(state);
                return ' ' + (++listNum) + '. ';
            } else if (type === 'bullet') {
                return ' - ';
            }
            return '';
        });

        $(this).markeditSetState(state);
        return this;
    };


    //
    //  $.markeditInsertLine
    //
    $.fn.markeditInsertLine = function(type) {
        var state = $(this).markeditGetState();
        state = MarkEdit.stateTrim(state);

        state.beforeSelect = state.beforeSelect.rtrim() + '\n\n----------';
        state.select = '';
        state.afterSelect = '\n\n' + state.afterSelect.ltrim();

        $(this).markeditSetState(state);
        return this;
    };


    //
    //  $.markeditSetHeading
    //
    $.fn.markeditSetHeading = function(type) {
        var state = $(this).markeditGetState();
        state = MarkEdit.stateTrim(state);

        if (state.select.length === 0) {
            return this;
        }

        var headingMatch = (/(.*)\n(-+|=+)/).exec(state.select + state.afterSelect);
        if (headingMatch) {

            var heading = String(headingMatch[1]);
            var line = String(headingMatch[2]);

            // Remove existing code from state
            state.select = '';
            if ((/^(-|=)/).exec(state.afterSelect) > -1) {
                state.afterSelect = state.afterSelect.rtrim();
                state.afterSelect = state.afterSelect.substr(line.length + 1);
            }

            // Determine which char
            switch (line.substr(0,1)) {
                case '-':
                    line = line.replace(/-/g, '=');
                    state.select = heading;
                    state.afterSelect = '\n' + line + state.afterSelect;
                    break;

                case '=':
                    state.select = heading;
                    break;
            }

        }
        else {

            // No heading, add one
            state.beforeSelect = state.beforeSelect.rtrim() + '\n\n';

            state.select = state.select.trim();
            var headingLength = state.select.length;
            var underline = '';
            state.select += '\n';

            for (var i = 0; i < headingLength; i++ ) {
                underline += '-';
            }

            state.afterSelect = underline + '\n\n' + state.afterSelect.ltrim();

        }

        $(this).markeditSetState(state);
        return this;
    };


    //
    //  $.markeditGetHtml
    //
    $.fn.markeditGetHtml = function() {

        // Load Showdown if it's not loaded
        if (typeof(MarkEditShowDown) === 'undefined') {
            if (typeof(Attacklab) === 'undefined') {
                throw 'Showdown.js (Attacklab.showdown) must be loaded before MarkEdit.';
            }
            MarkEditShowDown = new Attacklab.showdown.converter();
        }

        // Render the preview
        var textarea = MarkEdit.getTextArea(this);
        var text = $(textarea).val();
        if (typeof(text) !== 'undefined') {
            var html =  MarkEditShowDown.makeHtml($(this).val());
            html = html.replace(/\r/g, '');

            // Convert newlines to <br/> inside a <p>
            var lineBreakInP = /(<p>(?:[\S\s](?!<\/p>))*)\n([\S\s]*?<\/p>)/g;
            var lineBreaksRemaining = lineBreakInP.exec(html);

            while (lineBreaksRemaining !== null) {
                html = html.replace(lineBreakInP, '$1<br />$2');
                lineBreaksRemaining = lineBreakInP.exec(html);
            }

            return html;
        }
        else {
            return '';
        }

    };


    //
    //  $.markeditTogglePreview
    //
    $.fn.markeditTogglePreview = function() {

        var textarea = MarkEdit.getTextArea(this);
        var toolbar = $(textarea).parent().children().filter('.markedit-toolbar').eq(0);
        var previewPane = $(textarea).parent().children().filter('div.markedit-preview').eq(0);

        if ($(textarea).attr('rel') === 'hidden') {
            $(textarea).attr('rel', 'visible');
            $(textarea).show();
            $(previewPane).hide();
            $(toolbar).markeditEnableToolbar();
        }
        else {
            $(textarea).attr('rel', 'hidden');
            $(textarea).hide();
            $(previewPane).show();
            toolbar.markeditDisableToolbar('.preview button');

            $(previewPane).html($(textarea).markeditGetHtml());
        }
        return this;

    };


    //
    //  $.markeditDisableToolbar
    //
    $.fn.markeditDisableToolbar = function(exclude){

        var buttons = $(this).children().find('button');

        if (typeof(exclude) !== 'undefined') {
            buttons = $(buttons).not(exclude);
        }

        $(buttons).each(function(){
            $(this).addClass('ui-state-disabled');
            $(this).attr('disabled', 'disabled');
        });

    };


    //
    //  $.markeditEnableToolbar
    //
    $.fn.markeditEnableToolbar = function(exclude){

        var buttons = $(this).children().find('button');

        if (typeof(exclude) !== 'undefined') {
            buttons = $(buttons).not(exclude);
        }

        $(buttons).each(function(){
            $(this).removeClass('ui-state-disabled');
            $(this).attr('disabled', '');
        });

    };


    //
    //  $.markeditBindAutoPreview
    //
    $.fn.markeditBindAutoPreview = function(element){

        // Convert out of jQuery & find Textarea
        if (element.get) { element = element.get(0); }
        var textarea = MarkEdit.getTextArea(this);

        // Enable events for auto-preview
        $(textarea).keyup(function(){
            $(element).html($(this).markeditGetHtml());
        });
        $(textarea).bind('updated', function() {
            $(element).html($(this).markeditGetHtml());
        });

        // Load initial value
        $(element).html($(this).markeditGetHtml());
    };



    // -----------------------------------------------------------------------
    //  MarkEdit Namespace
    // -----------------------------------------------------------------------
    var MarkEdit = function() {

        return {

            //
            //  Checks if the existing element is a <textarea>.  If not
            //  searches children for the textarea tag.
            //
            getTextArea: function(element) {
                if (element.tagName === 'TEXTAREA') {
                    return element;
                }
                else if (element.get(0).tagName === 'TEXTAREA') {
                    return element.get(0);
                }
                else {
                    var textarea = $(element).children().filter('textarea').eq(0);
                    if (textarea === null) {
                        throw MarkEditLanguage.cannotLocateTextarea;
                    }
                    return textarea.get(0);
                }
            },


            //
            //  Updates the state of the given MarkEdit
            //
            setState: function(textarea, state) {

                // Trim state
                state.afterSelect = state.afterSelect.rtrim();

                // Update textarea
                var text = state.beforeSelect + state.select + state.afterSelect + '\n\n';
                text += MarkEdit.makeLinkList(state.links);
                $(textarea).val(text);

                var selStart = state.beforeSelect.length;
                var selEnd = selStart + state.select.length;

                // Make active
                $(textarea).focus();

                if (textarea.setSelectionRange) {

                    // Set selection for non-IE browsers
                    textarea.setSelectionRange(selStart, selEnd);

                }
                else {

                    // Set selection for IE
                    var range = textarea.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selEnd);
                    range.moveStart('character', selStart);
                    range.select();

                }

                // Fire custom event
                $(textarea).trigger('updated');
            },


            //
            //  Appends the state to the current history
            //
            appendHistory: function(state, id) {
                if (MarkEditHistory !== null) {
                    if (typeof(MarkEditHistory[id]) !== 'undefined') {
                        MarkEditHistory[id].undo.push(state);
                        // History length: 50
                        if (MarkEditHistory[id].undo.length > 50) {
                            MarkEditHistory[id].undo.pop();
                        }
                    }
                }
            },


            //
            //  Trims the state.select, but moves the white space
            //  to the beforeSelect/afterSelect
            //
            stateTrim: function(state, newlineOnly) {

                var leadPattern;
                var tailPattern;

                if (newlineOnly) {
                    leadPattern = /^(?:\r?\n)+/;
                    tailPattern = /(?:\r?\n)+$/;
                }
                else {
                    leadPattern = /^\s+/;
                    tailPattern = /\s+$/;
                }

                var lead = leadPattern.exec(state.select);
                var tail = tailPattern.exec(state.select);

                if (lead) {
                    state.beforeSelect += lead;
                    state.select = state.select.substr(lead.length);
                }

                if (tail) {
                    state.afterSelect = tail + state.afterSelect;
                    state.select = state.select.substr(0, state.select.length - tail.length);
                }

                return state;
            },


            //
            //  Given an array, converts it into a Markdown link list
            //
            makeLinkList: function(links) {
                var linkList = '';

                $.each(links, function(i, val){
                    var link = '  [%id%]: %url%\n';
                    link = link.replace('%id%', i+1);
                    link = link.replace('%url%', val);
                    linkList += link;
                });

                return linkList;
            },


            //
            //  Given a body of Markdown, extract the links as an Array out from it
            //
            getMarkdownLinks: function(text) {
                var def_pattern = / {2}\[\d+\]: .*/;
                var link_lead_pattern = / {2}\[\d+\]: /;

                var remainder = text;
                var links = [];

                var result = def_pattern.exec(text);
                while (result) {
                    var lead = link_lead_pattern.exec(result);
                    var link = result.toString().replace(lead.toString(), '').trim();
                    links[links.length] = link;
                    remainder = remainder.replace(result, '');
                    result = def_pattern.exec(remainder);
                }

                return {
                    'remainder': remainder.rtrim(),
                    'links': links
                };
            },


            //
            //  Show a basic dialog prompt and return a value
            //
            basicPrompt: function(config, defaultValue, okCallback, cancelCallback) {
                // The callback function signature should look like this:
                // function(promptValue);

                var diag = $('<div></div>');

                if (typeof(config.helpText) !== 'undefined') {
                    diag.append('<p>' + config.helpText + '</p>');
                }

                var diagInput = $('<input type="text"></input>');

                if (typeof(defaultValue) !== 'undefined') {
                    diagInput.attr('value', defaultValue);
                }

                diag.append(diagInput);

                $(diag).dialog({
                    bgiframe: true,
                    modal: true,
                    autoOpen: true,
                    width: 600,
                    dialogClass: 'markedit-dialog',
                    title: config.title,
                    resizable: false,
                    buttons: {
                        'Insert': function() {
                            $(this).dialog('close');
                            okCallback(diagInput.val());
                        },
                        'Cancel': function() {
                            $(this).dialog('close');
                            cancelCallback();
                        }
                    },
                    open: function() {
                        // Auto-select all text in input box
                        var input = diagInput.get(0);
                        var start = 0;
                        var end = $(input).val().length;

                        if (input.setSelectionRange) {
                            input.setSelectionRange(start, end);
                        }
                        else {
                            var range = input.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', end);
                            range.moveStart('character', start);
                            range.select();
                        }
                    }
                });

                // Replace the button text with the proper translation
                // becuase jQuery can't apparently
                var buttons = $(diag).parent().children().filter('.ui-dialog-buttonpane').children();
                $(buttons).each(function(){
                    var buttonText = $(this).text();

                    if (buttonText === 'Insert') {
                        $(this).text(config.insertButton);
                    }
                    else if (buttonText === 'Cancel') {
                        $(this).text(config.cancelButton);
                    }
                });

            },

            //
            //  Given a regex for the start and end, fix the user's selection if
            //  they're selecting part of a region (link, code, etc.) but really
            //  should be electing the whole thing.
            //
            cleanSelection: function(state, patternStart, patternEnd) {

                // Clean selection lead
                var beforeMatch = patternStart.exec(state.beforeSelect);
                if (beforeMatch !== null) {
                    if (typeof(beforeMatch[1]) !== 'undefined') {
                        var selectionHead = String(beforeMatch[1]);

                        // Trim selection head from the end of beforeSelect
                        state.beforeSelect = state.beforeSelect.substr(0, state.beforeSelect.length - selectionHead.length);

                        // ...then add it to the real selection
                        state.select = selectionHead + state.select;
                    }
                }

                // Clean selection tail
                var afterMatch = patternEnd.exec(state.afterSelect);
                if (afterMatch !== null) {
                    if (typeof(afterMatch[1]) !== 'undefined') {
                        var selectionTail = String(afterMatch[1]);

                        // Trim the selection tail from the beginning of afterSelect
                        state.afterSelect = state.afterSelect.substr(selectionTail.length);

                        // ...then add it to the end of the real selection
                        state.select += selectionTail;
                    }
                }

                return state;
            },


            //
            //  Returns the proper prefix based on the type and current state
            //  Either a - (bullet) or the next number in a numbered sequence
            //
            getNextListNumber: function(state) {
                // Find if there is a line above it in the selection
                var match = (/ (\d{1,3}). (?:.*)?\n(?:.*)?$/).exec(state.select);
                if (match) {
                    return Number(match[1]);
                }
                else {
                    // See if there is a line above the select
                    match = (/ (\d{1,3}). (?:.*)?\n(?:.*)?$/).exec(state.beforeSelect);
                    if (match) {
                        return Number(match[1]);
                    }
                }
                // Otherwise there must not be a numberic list already
                return 0;
            },


            //
            //  Given a state will toggle the defined prefix
            //
            setPrefix: function(state, selectPattern, altSelectPatterns, getPrefixCallback) {

                state = MarkEdit.stateTrim(state, true);

                // Standardize selection to include prefix
                var bsMatch = selectPattern.exec(state.beforeSelect);

                // Check alt patterns as well
                if (bsMatch === null) {
                    $.each(altSelectPatterns, function(i, pattern){
                        var match = pattern.exec(state.beforeSelect);
                        if (match) {
                            bsMatch = match;
                        }
                    });
                }

                if (bsMatch !== null) {
                    state.beforeSelect = state.beforeSelect.substr(0, state.beforeSelect.length - bsMatch[1].length);
                    state.select = bsMatch[1] + state.select;
                }

                // Standardize line breaks on state
                state.beforeSelect = state.beforeSelect.rightNewlineTrim();

                // Check if we have an actual selection or not
                var lastPrefix = '';
                if (state.select.length > 0) {

                    // Enumerate lines and check what we've got
                    var list = state.select.split('\n');
                    state.select = '';

                    for (var i = 0; i < list.length; i++) {

                        // Find current type (toggle off if found)
                        var text = '';
                        var typeMatch = selectPattern.exec(list[i]);

                        if (typeMatch !== null) {
                            state.select += typeMatch[2].trim() + '\n';
                        }
                        else {
                            var prefix = getPrefixCallback(state);

                            // Find alternate type (switch prefix if found)
                            var altPatternFound = false;
                            for (var j = 0; j < altSelectPatterns.length; j++) {

                                var altTypeMatch = altSelectPatterns[j].exec(list[i]);

                                if (altTypeMatch !== null) {
                                    // Grab list item text
                                    if (typeof(altTypeMatch[2]) !== 'undefined' ) {
                                        text = altTypeMatch[2].trim();
                                    }

                                    // Adjust state accordingly
                                    state.select += prefix + text + '\n';
                                    lastPrefix = prefix;
                                    altPatternFound = true;
                                    break;
                                }

                            }

                            // Current/Alt type not found, add new entry
                            if (!altPatternFound) {
                                text = list[i].trim();
                                if (text.length > 0) {
                                    state.select += prefix + list[i].trim() + '\n';
                                }
                            }
                        }
                    }

                    // Fixup the new lines in before select
                    state.select = state.select.rightNewlineTrim();
                    if (state.select === lastPrefix) {
                        state.beforeSelect += '\n\n' + state.select;
                        state.select = '';
                    }
                    else {
                        state.beforeSelect += '\n\n';
                    }

                }
                else {
                    // Nothing was selected, so insert empty line
                    state.beforeSelect += '\n\n' + getPrefixCallback(state);
                }

                state.afterSelect = state.afterSelect.leftNewlineTrim();
                state.afterSelect = '\n\n' + state.afterSelect;

                return state;
            },


            //
            //  Given a string, shows a message box containing the value represented in hex.
            //  Useful for debugging when whitespace is invovled.
            //
            hexDebug: function(value, name) {
                if (typeof(value) === 'string') {
                    var hex = '';
                    for (var i = 0; i < value.length; i++) {
                        hex += value.charCodeAt(i).toString(16) + ' ';
                    }
                    if (hex.length > 0) {
                        if (name) {
                            alert(name + ':\n' + hex);
                        }
                        else {
                            alert(hex);
                        }
                    }
                    else {
                        alert('Empty value.');
                    }
                }
                else
                {
                    alert(value);
                }
            },


            //
            //  Popup state in a readable way
            //
            alertState: function(state) {
                alert(
                    'beforeSelect:\n[' + state.beforeSelect + ']\n\nselect:\n[' + state.select + ']\n\nafaterSelect:\n[' + state.afterSelect + ']'
                );
            },


            //
            //  Regex Patterns for prefixes
            //
            RegexNumberPrefix: /( \d{1,3}. )(.*)?$/,
            RegexBulletPrefix: /( - )(.*)?$/,
            RegexQuotePrefix: /(> )(.*)?$/,
            RegexCodePrefix: /( {4})(.*)?$/,
            RegexLinkStart: /(?:!)?\[([^\]]+)?$/,
            RegexLinkEnd: /^([^\]]+)?\]\[(\d+)?\]/
        };

    }();


    // -----------------------------------------------------------------------
    //  MarkEditToolbar Namespace
    // -----------------------------------------------------------------------
    var MarkEditToolbar = function() {

        return {

            //
            //  Creates all of the toolbar markup and binds events
            //
            createToolbar: function(textarea_tag, options) {

                // Prep toolbar wrapper
                var toolbar = $('<div class="markedit-toolbar ui-widget-header"></div>').prependTo(textarea_tag);
                if (options.backgroundMode === 'dark') {
                    toolbar.addClass('dark-bg');
                }
                else {
                    toolbar.addClass('light-bg');
                }

                // Sort configured buttons into groups
                var groups = options.layout.split('|');
                if (groups.length === 0) {
                    groups[0] = options.layout;
                }

                // Enumerate groups
                for ( var g = 0; g < groups.length; g++ ) {

                    groups[g] = groups[g].trim();

                    var toggleGroup = false;
                    var match = (/^\((.*)\)$/).exec(groups[g]);
                    if (match) {
                        toggleGroup = true;
                        groups[g] = String(match[1]);
                    }

                    var group = toolbar.markeditAddGroup(toggleGroup);

                    // Turn buttons in this group into an Array
                    var button_list = groups[g].split(' ');
                    if (button_list.length === 0) {
                        button_list[0] = groups[g];
                    }

                    // Add buttons for each in group
                    for ( var b = 0; b < button_list.length; b++ ) {
                        var button = MarkEditToolbar.getButtonDefinition(button_list[b], textarea_tag, options);
                        if (toggleGroup) {
                            button.toggle = true;
                        }

                        if (button !== null) {
                            group.markeditAddButton(button);
                        }
                        else {
                            throw "Definition for button '"+ button_list[b] +"' was not found.  If this is a custom button, use the custom_buttons setting to configure it.";
                        }
                    }

                }

            },

            //
            //  Get the definition of built-in or custom buttons
            //
            getButtonDefinition: function(button_id, textarea_tag, options) {

                switch(button_id) {

                    case 'bold':
                        return {
                            'id': 'bold',
                            'tip': MarkEditLanguage.defaultButtons.bold.tip,
                            'click': function() { $(textarea_tag).markeditSetBold(); }
                        };

                    case 'italic':
                        return {
                            'id':' italic',
                            'tip': MarkEditLanguage.defaultButtons.italic.tip,
                            'click': function() { $(textarea_tag).markeditSetItalic(); }
                        };

                    case 'link':
                        return {
                            'id':'link',
                            'tip': MarkEditLanguage.defaultButtons.link.tip,
                            'click': function() { $(textarea_tag).markeditSetLinkOrImage(false); }
                        };

                    case 'image':
                        return {
                            'id':'image',
                            'tip': MarkEditLanguage.defaultButtons.image.tip,
                            'click': function() { $(textarea_tag).markeditSetLinkOrImage(true); }
                        };

                    case 'code':
                        return {
                            'id':'code',
                            'tip': MarkEditLanguage.defaultButtons.code.tip,
                            'click': function() { $(textarea_tag).markeditSetCode(); }
                        };

                    case 'quote':
                        return {
                            'id':'quote',
                            'tip': MarkEditLanguage.defaultButtons.quote.tip,
                            'click': function() { $(textarea_tag).markeditSetQuote(); }
                        };

                    case 'numberlist':
                        return {
                            'id': 'numberlist',
                            'tip': MarkEditLanguage.defaultButtons.numberlist.tip,
                            'click': function() { $(textarea_tag).markeditSetList('number'); }
                        };

                    case 'bulletlist':
                        return {
                            'id': 'bulletlist',
                            'tip': MarkEditLanguage.defaultButtons.bulletlist.tip,
                            'click': function() { $(textarea_tag).markeditSetList('bullet'); }
                        };

                    case 'line':
                        return {
                            'id': 'line',
                            'tip': MarkEditLanguage.defaultButtons.line.tip,
                            'click': function() { $(textarea_tag).markeditInsertLine(); }
                        };

                    case 'heading':
                        return {
                            'id': 'heading',
                            'tip': MarkEditLanguage.defaultButtons.heading.tip,
                            'click': function() { $(textarea_tag).markeditSetHeading(); }
                        };

                    case 'undo':
                        return {
                            'id': 'undo',
                            'tip': MarkEditLanguage.defaultButtons.undo.tip,
                            'click': function() { $(textarea_tag).markeditUndo(); }
                        };

                    case 'redo':
                        return {
                            'id': 'redo',
                            'tip': MarkEditLanguage.defaultButtons.redo.tip,
                            'click': function() { $(textarea_tag).markeditRedo(); }
                        };

                    case 'edit':
                        return {
                            'id': 'edit',
                            'text': MarkEditLanguage.defaultButtons.edit.text,
                            'tip': MarkEditLanguage.defaultButtons.edit.tip,
                            'click': function() { $(textarea_tag).markeditTogglePreview(); }
                        };

                    case 'preview':
                        return {
                            'id': 'preview',
                            'text': MarkEditLanguage.defaultButtons.preview.text,
                            'tip': MarkEditLanguage.defaultButtons.preview.tip,
                            'click': function() { $(textarea_tag).markeditTogglePreview(); }
                        };

                    default:
                        return MarkEditToolbar.getCustomButtonDef(button_id, options);
                }

            },

            //
            //  Get the definition of a custom button
            //
            getCustomButtonDef: function(id, options) {

                var custom = options.buttons;
                for ( var i = 0; i < custom.length; i++ ) {
                    var button = custom[i];
                    if (typeof(button.id) !== 'undefined') {
                        if (id === button.id) {
                            return button;
                        }
                    }
                }

                return null;
            }

        };

    }();


})(jQuery);


// A few extra helper methods

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,'');
};

String.prototype.ltrim = function() {
    return this.replace(/^\s+/g,'');
};

String.prototype.rtrim = function() {
    return this.replace(/\s+$/g,'');
};

String.prototype.leftNewlineTrim = function() {
    return this.replace(/^(\r|\n)+/g, '');
}

String.prototype.rightNewlineTrim = function() {
    return this.replace(/(\r|\n)+$/g, '');
}