const URL = "http://localhost:7000";

(function () {
  'use strict';
  window.Stokr = window.Stokr || {};
  let Model = window.Stokr.Model;
  let View = window.Stokr.View;


  fetchStocks();

  function fetchStocks() {
    return fetch(URL + "/quotes?q=" + Model.getState().stocksNames.join(","))
      .then(response => response.json())
      .then(data => data.query.results.quote)
      .then(stocks => {
        if (!Array.isArray(stocks)) stocks = [stocks];
        Model.getState().stocks = stocks;
        render();
      });
  }

  function toggleFilter() {
    Model.getState().edit = false;
    Model.getState().filter = !Model.getState().filter;
    render();
  }

  function changeBtnDisplay(numOfModes) {
    Model.getState().displayMode++;
    if (Model.getState().displayMode === numOfModes) Model.getState().displayMode = 0;
    render();
  }

  function swapStocks(symbol,direction) {
    const currentIndex = Model.getState().stocks.findIndex(stock => stock.Symbol === symbol);
    swap(Model.getState().stocks,currentIndex,currentIndex + direction);
    swap(Model.getState().stocksNames,currentIndex,currentIndex + direction);
    render();
  }

  function swap(array,index1,index2) {
    array[index1] = array.splice(index2, 1, array[index1])[0];
  }

  function filterStocks(filters) {
    let filteredStocks = Model.getState().stocks.filter(stock => {
      return filterByName(stock,filters.name) && filterByGain(stock,filters.gain)
        && filterByRangeFrom(stock,filters.range_from) && filterByRangeTo(stock,filters.range_to);
    });
    View.renderStock(filteredStocks);
  }

  function filterByRangeTo(stock,rangeTo) {
    return !rangeTo || parseFloat(stock.realtime_chg_percent) < Number(rangeTo);
  }

  function filterByRangeFrom(stock,rangeFrom) {
    return !rangeFrom || parseFloat(stock.realtime_chg_percent) > Number(rangeFrom);
  }

  function filterByGain(stock,gain) {
    return gain ? gain === 1 && parseFloat(stock.realtime_chg_percent) > 0
      || gain === 2 && parseFloat(stock.realtime_chg_percent) < 0 : true;
  }

  function filterByName(stock,name) {
    return !name || stock.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
  }

  function isFilterOpen() {
    return Model.getState().filter;
  }

  function openSearch() {
    Model.getState().search = true;
    render();
  }

  function searchStock(value) {
    return fetch(URL + "/search?q=" + value)
      .then(response => response.json())
      .then(data => data.ResultSet.Result)
      .then(data => View.renderSearchResults(data))
  }

  function addStock(symbol) {
    Model.getState().stocksNames.push(symbol);
    fetchStocks().then(() => {
      window.location.hash = "#"
    });
  }

  function cancelSearch() {
    Model.getState().search = false;
    render();
  }

  function routeChange() {
    render();
  }

  function toggleEdit() {
    Model.getState().filter = false;
    Model.getState().edit = !Model.getState().edit;
    render();
  }

  function removeStock(symbol) {
    const index = Model.getState().stocks.findIndex(stock => stock.Symbol === symbol);
    Model.getState().stocks.splice(index,1);
    Model.getState().stocksNames.splice(index,1);
    render();
  }

  View.setHandlers({swapStocks, filterStocks, toggleFilter, changeBtnDisplay, isFilterOpen, fetchStocks, openSearch, searchStock, addStock, cancelSearch, routeChange, toggleEdit, removeStock});

  function render() {
    View.setState(Model.getState());
    View.render();
  }

  render();

})();



