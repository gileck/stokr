(function () {
  'use strict';

  let state = {
    displayMode: 0
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

  function changeBtnDisplay() {
    state.displayMode++;
    if (state.displayMode === displayedFields.length) state.displayMode = 0;
    render();
  }

  function swapStocks(e) {
    const symbol = e.target.getAttribute("data-id");
    const currentIndex = stocks.findIndex(stock => stock.Symbol === symbol);
    const arrowType = e.target.getAttribute("data-arrow-type");
    stocks[currentIndex] = stocks.splice((arrowType === "up") ? currentIndex - 1 : currentIndex + 1, 1, stocks[currentIndex])[0];
    render();
  }

  function displayValue(stock) {
    const field = displayedFields[state.displayMode];
    return field.display(stock[field.name]);
  }

  function clickEventHandler(e) {
    let type = e.target.getAttribute("data-type");
    if (!type || e.target.hasAttribute("disabled")) return;
    handlerFunctions[type](e);
  }

  function render() {
    document.querySelector("#root").innerHTML = generateHTML();
    document.querySelector("#stocks-ul").addEventListener("click",clickEventHandler)
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
          <li><span class="icon-filter menu-icon"></span></li>
          <li><span class="icon-settings menu-icon"></span></li>
        </ul>
      </nav>
    </header>
  
  <ul id="stocks-ul" class="stocks-ul">
      ${ stocks.map(generateListItem).join('') }
    </ul>
  `
  }


  function generateListItem(stock, index) {
    return `<li>  
      <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
      <div class="li-right">
        <span class="value-number">${Math.round(stock.Change*100)/100}</span>
        <button data-type="valueBtn" 
                data-id="${stock.Symbol}" 
                class="value-btn ${stock.Change < 0 ? 'red-btn' : 'green-btn'}"> ${displayValue(stock)}
        </button>
        <div class="arrows-wrapper">
          <btn 
          class="icon-arrow arrow-up" 
          data-type="arrowBtn"
          data-arrow-type="up"
          data-id="${stock.Symbol}"
          ${index === 0 ? "disabled" : ""}></btn> 
          <btn 
          data-type="arrowBtn"
          data-arrow-type="down"
          data-id="${stock.Symbol}" 
          class="icon-arrow arrow-down"
          ${index === stocks.length - 1 ? "disabled" : ""}></btn> 
        </div>
      </div>
  </li>`
  }

  render();

})();



