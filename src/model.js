(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  let displayedFields = [
    {name: "PercentChange", display: value => value},
    {name: "LastTradePriceOnly", display: value => Math.round(value*100)/100 + "B"},
    {name: "Change", display: value => Math.round(value*100)/100}
  ];


  let state = {
    stocks: [
      {
        "Symbol": "WIX",
        "Name": "Wix.com Ltd.",
        "Change": "0.750000",
        "PercentChange": "+1.51%",
        "LastTradePriceOnly": "76.099998"
      },
      {
        "Symbol": "MSFT",
        "Name": "Microsoft Corporation",
        "PercentChange": "-2.09%",
        "Change": "-0.850006",
        "LastTradePriceOnly": "69.620003"
      },
      {
        "Symbol": "YHOO",
        "Name": "Yahoo! Inc.",
        "Change": "0.279999",
        "PercentChange": "+1.11%",
        "LastTradePriceOnly": "50.599998"
      }
    ],
    displayMode: 0,
    filter: false
  };


  window.Stokr.Model = {
    state: state,
    getStocks() {
      return state.stocks;
    },
    getDispleyMode() {
      return state.displayMode;
    },
    isFilterOpen() {
      return filter;
    },
    toggleDisplayMode() {
      state.displayMode++;
      if (state.displayMode === displayedFields.length) state.displayMode = 0;
    },
    toggleFilter() {
      state.filter = !state.filter;
    }
  }

})();

