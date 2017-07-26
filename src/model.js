(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  let state = {
    stocks: [],
    stocksNames: localStorage.getItem("stocks") || [],
    displayMode: 0,
    filter: false,
    edit: false
  };

  window.Stokr.Model = {
    getState() {
      return state;
    },
    setState(newState) {
      state = newState;
    }
  }

})();

/*
 symbol: "WIX",
 Name: "Wix.com Ltd. - Ordinary Shares",
 Symbol: "WIX",
 Open: "73.400002",
 DaysHigh: "75.949997",
 DaysLow: "73.099998",
 MarketCapitalization: "3.439B",
 YearHigh: "86.150000",
 YearLow: "31.280000",
 Volume: "796874",
 AverageDailyVolume: "-",
 PERatio: null,
 LastTradePriceOnly: "75.650002",
 Change: "2.550003",
 realtime_price: "75.650002",
 realtime_change: "2.550003",
 realtime_chg_percent: "3.488376",
 eps_curr_year: "-1.110000",
 realtime_ts: "7 24 2017 20:00:00 GMT",
 ts: "7 24 2017 20:00:00 GMT"
 */
