Tower.SupportI18n.load module.exports =
  date:
    formats:
      # Use the strftime parameters for formats.
      # When no format has been given", it uses default.
      # You can provide other formats here if you like!
      default: "%Y-%m-%d"
      short: "%b %d"
      long: "%B %d, %Y"

    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    # Don't forget the nil at the beginning; there's no such thing as a 0th month
    monthNames: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    # Used in dateSelect and datetimeSelect.
    order: ["year", "month", "day"]

  time:
    formats:
      default: "%a, %d %b %Y %H:%M:%S %z"
      short: "%d %b %H:%M"
      long: "%B %d, %Y %H:%M"
    am: "am"
    pm: "pm"

# Used in array.toSentence.
  support:
    array:
      wordsConnector: ", "
      twoWordsConnector: " and "
      lastWordConnector: ", and "
