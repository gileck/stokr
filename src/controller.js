const URL = "http://localhost:7000";

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};
  let App = window.Stokr;
  let Model = App.Model;
  let View = App.View;
  let Stock = new App.Stock({Model, View});
  let FilterUtils = new App.FilterUtils({Model, View});
  let StateMgmt = new App.StateMgmt({Model, View});

  init();
  render();

  function init() {
    StateMgmt.setStateFromLocalStorage();
    fetchStocks();
    setTimeout(fetchStocks, 60000 * 5);
  }

  function render() {
    View.setState(Model.getState());
    View.render();
  }

  function fetchStocks() {
    return Stock.Fetch().then(render).catch(render);
  }

  function toggleFilter() {
    Model.getState().edit = false;
    Model.getState().filter = !Model.getState().filter;
    render();
    StateMgmt.saveToLocalStorage();
  }

  function changeBtnDisplay(numOfModes) {
    Model.getState().displayMode++;
    if (Model.getState().displayMode === numOfModes) Model.getState().displayMode = 0;
    render();
    StateMgmt.saveToLocalStorage();
  }

  function swapStocks(symbol,direction) {
    Stock.swapStocks(symbol,direction);
    render();
    StateMgmt.saveToLocalStorage();
  }

  function filterStocks(filters) {
    View.renderStock(FilterUtils.filterStocks(filters));
  }

  function isFilterOpen() {
    return Model.getState().filter;
  }

  function searchStock(value) {
    return Stock.Search(value).then(data => View.renderSearchResults(data))
  }

  function navigateHome() {
    window.location.hash = "#"
  }

  function addStock(symbol) {
    Stock.Add(symbol);
    StateMgmt.saveToLocalStorage();
    fetchStocks().then(navigateHome);
  }

  function routeChange() {
    render();
  }

  function toggleEdit() {
    Model.getState().filter = false;
    Model.getState().edit = !Model.getState().edit;
    render();
    StateMgmt.saveToLocalStorage();
  }

  function removeStock(symbol) {
    Stock.Remove(symbol);
    StateMgmt.saveToLocalStorage();
    render();
  }

  View.setHandlers({swapStocks, filterStocks, toggleFilter, changeBtnDisplay, isFilterOpen, fetchStocks, searchStock, addStock, routeChange, toggleEdit, removeStock});


})();






