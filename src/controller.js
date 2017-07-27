(function () {
  'use strict';
  window.Stokr = window.Stokr || {};
  const App = window.Stokr;
  const Model = App.Model;
  const View = App.View;
  const stocks = new App.Stocks(App);
  const stateMgmt = new App.StateMgmt(App);
  const router = new App.Router(App);
  const API = new App.API(App);

  init();

  function init() {
    stateMgmt.setStateFromLocalStorage();
    API.getSymbols()
      .then(symbols => Model.getState().symbols = symbols)
      .then(fetchStocks);
    setTimeout(fetchStocks, 60000 * 5);
  }

  function render() {
    View.setState(Model.getState());
    View.render();
    stateMgmt.saveToLocalStorage();
  }

  function fetchStocks() {
    return API.fetchStocks(Model.getState().symbols)
      .then(stocks => Model.getState().stocks = stocks)
      .then(render)
      .catch(render);
  }

  View.setHandlers({

    addStock(symbol) {
      stocks.add(symbol)
        .then(API.saveStock)
        .then(fetchStocks)
        .then(router.Home)
    },

    removeStock(symbol) {
      stocks.remove(symbol)
        .then(API.removeStock)
        .then(render)
    },

    swapStocks(symbol,direction) {
      stocks.swapStocks(symbol,direction);
      render();
    },

    changeBtnDisplay(numOfModes) {
      Model.getState().displayMode++;
      if (Model.getState().displayMode === numOfModes) Model.getState().displayMode = 0;
      render();
    },

    filterStocks(filters) {
      View.renderStock(stocks.filterStocks(filters));
    },

    searchStock(value) {
      API.searchStocks(value)
        .then(results => results.filter(stock => Model.getState().symbols.indexOf(stock.symbol) === -1))
        .then(data => View.renderSearchResults(data))
    },

    routeChange() {
      Model.getState().edit = false;
      Model.getState().filter = false;
      render();
    },

    toggleFilter() {
      Model.getState().edit = false;
      Model.getState().filter = !Model.getState().filter;
      render();
    },

    toggleEdit() {
      Model.getState().filter = false;
      Model.getState().edit = !Model.getState().edit;
      render();
    },

    refresh: fetchStocks
  });

})();






