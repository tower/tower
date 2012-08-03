Tower.SupportI18n.load module.exports =
  date:
    formats:
      standard: "%Y-%m-%d"
      # Use the strftime parameters for formats.
      # When no format has been given", it uses default.
      # You can provide other formats here if you like!
      default: "%Y-%m-%d"
      short: "%b %d"
      long: "%B %d, %Y"

    dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
    abbrDayNames: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
    # Don't forget the nil at the beginning; there's no such thing as a 0th month
    monthNames: [null, "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]
    abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
    # Used in dateSelect and datetimeSelect.
    order: ["år", "måned", "dag"]

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
      twoWordsConnector: " og "
      lastWordConnector: ", og "
