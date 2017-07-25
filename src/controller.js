(function () {
  'use strict';
  window.Stokr = window.Stokr || {};
  let Model = window.Stokr.Model;
  let View = window.Stokr.View;

  fetchStocks()
   .then(render)
   .catch(console.log);

  function fetchStocks() {
    return fetch("http://localhost:7000/quotes?q=" + Model.getState().stocksNames.join(","))
      .then(response => response.json())
      .then(data => data.query.results.quote)
      .then(stocks => {
        Model.getState().stocks = stocks;
      });
  }

  function toggleFilter() {
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
    let stocks = Model.getState().stocks;
    stocks[currentIndex] = stocks.splice(currentIndex + direction, 1, stocks[currentIndex])[0];
    render();
  }

  function filterStocks(filters) {
    let filteredStocks = Model.getState().stocks.filter(stock => {
      const filter_name = !filters.name || stock.Name.toLowerCase().indexOf(filters.name) !== -1;
      const filter_gain = filters.gain ? filters.gain === 1 && parseFloat(stock.realtime_chg_percent) > 0 || filters.gain === 2 && parseFloat(stock.realtime_chg_percent) < 0 : true;
      const filter_range_from = !filters.range_from || parseFloat(stock.realtime_chg_percent) > Number(filters.range_from);
      const filter_range_to = !filters.range_to || parseFloat(stock.realtime_chg_percent) < Number(filters.range_to);
      return filter_name && filter_gain && filter_range_from && filter_range_to;
    });
    View.renderStock(filteredStocks);
  }

  function isFilterOpen() {
    return Model.getState().filter;
  }

  View.setHandlers({swapStocks, filterStocks, toggleFilter, changeBtnDisplay, isFilterOpen});

  function render() {
    View.setState(Model.getState());
    View.render();
  }

  render();

})();



