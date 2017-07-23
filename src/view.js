(function () {
 'use strict';
  window.Stokr = window.Stokr || {};
  let Ctrl = window.Stokr.Ctrl;
  let state;
  let handlers;


  function setHandlers(_handlers) {
    handlers = _handlers;
  }

  function setState(props) {
    state = props.state;
  }

  let displayedFields = [
    {name: "PercentChange", display: value => value},
    {name: "LastTradePriceOnly", display: value => Math.round(value*100)/100 + "B"},
    {name: "Change", display: value => Math.round(value*100)/100}
  ];

  function render() {
    document.querySelector("#root").innerHTML = generateHTML(state);
    document.querySelector("#stocks-ul").addEventListener("click",handlers.clickEventHandler);
    document.querySelector("#filter-apply").addEventListener("click",handlers.filterHandler);
    document.querySelector("#filter-btn").addEventListener("click",handlers.openFilter);
  }

  function displayValue(stock) {
    const field = displayedFields[state.displayMode];
    return field.display(stock[field.name]);
  }

  function getFilterClass() {
    if (state.filter) return "show-filter";

  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function generateHTML() {
    return `
      <header>
      <h1 class="main-header">STOKR</h1>
      <nav>
        <ul class="nav-ul">
          <li><span class="icon-search menu-icon"></span></li>
          <li><span class="icon-refresh menu-icon"></span></li>
          <li id="filter-btn"><span class="icon-filter menu-icon"></span></li>
          <li><span class="icon-settings menu-icon"></span></li>
        </ul>
      </nav>
    </header>
  <div class="filter ${ getFilterClass() }" data-type="filterBtn" id="filter">
       <label for="name">By Name</label>
       <input id="filter-name">
       <label for="gain">By Gain</label>
       <input id="filter-gain">
       <label for="range-from">By Range: From</label>
       <input id="filter-range-from">
       <label for="range-to">By Range: To</label>
       <input id="filter-range-to">
       <button id="filter-apply">APPLY</button>
  </div>
  <ul id="stocks-ul" class="stocks-ul">
      ${ state.stocks.map(generateListItem).join('') }
    </ul>
  `
  }

  function generateListItem(stock, index) {
    return `<li data-id="${stock.Symbol}">
      <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
      <div class="li-right">
        <span class="value-number">${Math.round(stock.Change*100)/100}</span>
        <button data-type="valueBtn"
                class="value-btn ${stock.Change < 0 ? 'red-btn' : 'green-btn'}"> ${displayValue(stock)}
        </button>
        <div class="arrows-wrapper">
          <btn class="icon-arrow arrow-up"
          data-type="arrowBtn" data-arrow="up"
          ${index === 0 ? "disabled" : ""}></btn>
          <btn data-type="arrowBtn" data-arrow="down"
          class="icon-arrow arrow-down"
          ${index === state.stocks.length - 1 ? "disabled" : ""}></btn>
        </div>
      </div>
  </li>`
  }

  function renderStock(stocks) {
    document.querySelector("#stocks-ul").innerHTML = stocks.map(generateListItem).join('');
  }


  window.Stokr.View = {
    render,
    setState,
    setHandlers,
    renderStock
  }
  })();

