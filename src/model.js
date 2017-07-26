(function () {
  'use strict';
  window.Stokr = window.Stokr || {};

  let state = {
    stocks: [],
    symbols: [],
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
