
(function () {
  'use strict';
  window.Stokr = window.Stokr || {};
  let App = window.Stokr;
  let Model = App.Model;
  let View = App.View;
  let Stock = new App.Stock(App);
  let FilterUtils = new App.FilterUtils(App);
  let StateMgmt = new App.StateMgmt(App);
  let Router = new App.Router(App);

  init();

  function init() {
    StateMgmt.setStateFromLocalStorage();
    fetchStocks();
    setTimeout(fetchStocks, 60000 * 5);
  }

  function render() {
    View.setState(Model.getState());
    View.render();
    StateMgmt.saveToLocalStorage();
  }

  function fetchStocks() {
    return Stock.Fetch().then(render).catch(render);
  }

  View.setHandlers({

    addStock(symbol) {
      Stock.Add(symbol);
      fetchStocks().then(Router.Home);
    },

    removeStock(symbol) {
      Stock.Remove(symbol);
      render();
    },

    swapStocks(symbol,direction) {
      Stock.SwapStocks(symbol,direction);
      render();
    },

    toggleFilter() {
      Model.getState().edit = false;
      Model.getState().filter = !Model.getState().filter;
      render();
    },

    changeBtnDisplay(numOfModes) {
      Model.getState().displayMode++;
      if (Model.getState().displayMode === numOfModes) Model.getState().displayMode = 0;
      render();
    },

    filterStocks(filters) {
      View.renderStock(FilterUtils.filterStocks(filters));
    },

    searchStock(value) {
      return Stock.Search(value).then(data => View.renderSearchResults(data))
    },

    routeChange() {
      render();
    },

    toggleEdit() {
      Model.getState().filter = false;
      Model.getState().edit = !Model.getState().edit;
      render();
    },

    fetchStocks: fetchStocks
  });

})();






