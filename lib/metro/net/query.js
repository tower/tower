
  Metro.Net.Query = {
    perPage: 20,
    sortDirection: "ASC",
    sortKey: "sort",
    limitKey: "limit",
    pageKey: "page",
    separator: "_",
    operators: {
      gte: ":value..t",
      gt: ":value...t",
      lte: "t..:value",
      lte: "t...:value",
      rangeInclusive: ":i..:f",
      rangeExclusive: ":i...:f",
      "in": [",", "+OR+"],
      nin: "-",
      all: "[:value]",
      nil: "[-]",
      notNil: "[+]",
      asc: ["+", ""],
      desc: "-",
      geo: ":lat,:lng,:radius"
    }
  };

  module.exports = Metro.Net.Query;
