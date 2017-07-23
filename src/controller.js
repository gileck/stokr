(function () {
  'use strict';
  window.Stokr = window.Stokr || {};
  let Model = window.Stokr.Model;
  let View = window.Stokr.View;


  let handlerFunctions = {
    valueBtn: changeBtnDisplay,
    arrowBtn: swapStocks
  };

  function openFilter() {
    Model.toggleFilter();
    render();
  }

  function changeBtnDisplay() {
    Model.toggleDisplayMode();
    render();
  }

  function swapStocks(e) {
    const symbol = e.target.closest('li').dataset.id;
    const currentIndex = Model.getStocks().findIndex(stock => stock.Symbol === symbol);
    const arrowType = e.target.dataset.arrow;
    const indexToRepace = (arrowType === "up") ? currentIndex - 1 : currentIndex + 1;
    Model.state.stocks[currentIndex] = Model.state.stocks.splice(indexToRepace, 1, Model.state.stocks[currentIndex])[0];
    render();
  }

  function filterHandler() {
    const value = document.querySelector("#filter-name").value;
    let filteredStocks = Model.getStocks().filter(stock => {
      return stock.Name.toLowerCase().indexOf(value) !== -1
    });
    View.renderStock(filteredStocks);
  }

  function clickEventHandler(e) {
    let type = e.target.dataset.type;
    if (!type || e.target.hasAttribute("disabled")) return;
    handlerFunctions[type](e);
  }

  View.setHandlers({clickEventHandler, filterHandler, openFilter});

  function render() {
    View.setState({state: Model.state});
    View.render();
  }

  render();

})();



