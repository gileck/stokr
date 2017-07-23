(function () {
  'use strict';

  let state = {
    displayMode: 0,
    filter: false
  };

  let displayedFields = [
    {name: "PercentChange", display: value => value},
    {name: "LastTradePriceOnly", display: value => Math.round(value*100)/100 + "B"},
    {name: "Change", display: value => Math.round(value*100)/100}
  ];

  let handlerFunctions = {
    valueBtn: changeBtnDisplay,
    arrowBtn: swapStocks
  };

  function openFilter() {
    state.filter = !state.filter;
    render();
    document.querySelector("#filter").classList.toggle("showFilter");
  }

  function changeBtnDisplay() {
    state.displayMode++;
    if (state.displayMode === displayedFields.length) state.displayMode = 0;
    render();
  }

  function swapStocks(e) {
    const symbol = e.target.closest('li').dataset.id;
    const currentIndex = stocks.findIndex(stock => stock.Symbol === symbol);
    const arrowType = e.target.dataset.arrow;
    stocks[currentIndex] = stocks.splice((arrowType === "up") ? currentIndex - 1 : currentIndex + 1, 1, stocks[currentIndex])[0];
    render();
  }

  function displayValue(stock) {
    const field = displayedFields[state.displayMode];
    return field.display(stock[field.name]);
  }

  function filterHandler() {
    const name = document.querySelector("#filter-name");
    let filteredStocks = stocks.filter(stock => {
      return stock.Name.toLowerCase().indexOf(name.value) !== -1
    });
    renderStock(filteredStocks);
  }

  function clickEventHandler(e) {
    let type = e.target.dataset.type;
    if (!type || e.target.hasAttribute("disabled")) return;
    handlerFunctions[type](e);
  }

  function renderStock(stocks) {
    document.querySelector("#stocks-ul").innerHTML = stocks.map(generateListItem).join('');
  }

  function render() {
    document.querySelector("#root").innerHTML = generateHTML(stocks);
    document.querySelector("#stocks-ul").addEventListener("click",clickEventHandler);
    document.querySelector("#filter-apply").addEventListener("click",filterHandler);
    document.querySelector("#filter-btn").addEventListener("click",openFilter);
  }

  function filterClass() {
    console.log(state.filter);
    if (state.filter == true) {
      return "show-filter"
    } else {
      return ''
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function generateHTML(stocks) {
    console.log(state.filter);
    return `
      <header>
      <h1 class="main-header">STOKR</h1>
      <nav>
        <ul class="nav-ul">
          <li><span class="icon-search menu-icon"></span></li>
          <li><span class="icon-refresh menu-icon"></span></li>
          <li id="filter-btn"><span class="icon-filter menu-icon ${state.filter ? "red-color" : ""}"></span></li>
          <li><span class="icon-settings menu-icon"></span></li>
        </ul>
      </nav>
    </header>
  <div class="filter ${ filterClass() }" data-type="filterBtn" id="filter">
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
      ${ stocks.map(generateListItem).join('') }
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
          ${index === stocks.length - 1 ? "disabled" : ""}></btn> 
        </div>
      </div>
  </li>`
  }

  render();

})();



