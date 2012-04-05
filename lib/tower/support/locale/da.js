Tower.Support.I18n.load(module.exports = {
  date: {
    formats: {
      standard: "%Y-%m-%d",
      short: "%b %d",
      long: "%B %d, %Y"
    },
    dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
    abbrDayNames: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
    monthNames: [null, "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
    abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    order: ["år", "måned", "dag"]
  },
  time: {
    formats: {
      "default": "%a, %d %b %Y %H:%M:%S %z",
      short: "%d %b %H:%M",
      long: "%B %d, %Y %H:%M"
    },
    am: "am",
    pm: "pm"
  },
  support: {
    array: {
      wordsConnector: ", ",
      twoWordsConnector: " og ",
      lastWordConnector: ", og "
    }
  }
});
