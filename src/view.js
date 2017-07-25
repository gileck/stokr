(function () {
 'use strict';
  window.Stokr = window.Stokr || {};
  let state;
  let ctrl;

  let displayedFields = [
    {name: "realtime_chg_percent", display: value => Math.round(value*100)/100 + "%"},
    {name: "MarketCapitalization", display: value => Math.round(parseFloat(value) * 10)/10 + "B"},
    {name: "realtime_change", display: value => Math.round(value*100)/100}
  ];

  function setHandlers(_ctrl) {
    ctrl = _ctrl;
  }

  function setState(_state) {
    state = _state;
  }

  let handlerFunctions = {
    "valueBtn": function (e) {
      ctrl.changeBtnDisplay(displayedFields.length);
    },
    "arrowBtn": function (e) {
      ctrl.swapStocks(e.target.closest('li').dataset.id,(e.target.dataset.arrow === "down") ? 1 : - 1);
    },
    "applyFilter": function (e) {
      const filters = {};
      filters.name = document.querySelector("#filter-name").value;
      filters.gain = Number(document.querySelector("#filter-gain").value);
      filters.range_from = document.querySelector("#filter-range-from").value;
      filters.range_to = document.querySelector("#filter-range-to").value;
      for (const item in filters) if (!filters[item]) delete filters[item];
      ctrl.filterStocks(filters);
    },
    "toggleFilter": function (e) {
      ctrl.toggleFilter();
    }
  };

  function clickEventHandler(e) {
    let type = e.target.dataset.type;
    if (!type || e.target.hasAttribute("disabled")) return;
    handlerFunctions[type](e);
  }

  function render() {
    document.querySelector("#root").innerHTML = generateHTML(state);
    document.querySelector("#stocks-ul").addEventListener("click",clickEventHandler);
    document.querySelector("#filter-apply").addEventListener("click",handlerFunctions.applyFilter);
    document.querySelector("#filter-btn").addEventListener("click",handlerFunctions.toggleFilter);
  }

  function displayValue(stock) {
    const field = displayedFields[state.displayMode];
    return field.display(stock[field.name]);
  }

  function getFilterClass() {
    if (state.filter) return "show-filter";
    return '';
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
  <div class="filter-body">
      
       <div class="filter-left">
         <div class="input-label">
            <label for="name">By Name</label>
            <input id="filter-name">
         </div>       
         <div class="input-label">
             <label for="gain">By Gain</label>
             <select id="filter-gain">
                <option value=0>All</option>  
                <option value=1>Gaining</option>  
                <option value=2>Losing</option>  
            </select>
         </div>      
       </div>
        
        <div class="filter-right">
           <div class="input-label">
              <label for="range-from">By Range: From</label>
              <input id="filter-range-from">
           </div>       
           <div class="input-label">
              <label for="range-to">By Range: To</label>
               <input id="filter-range-to">
           </div>  
       </div>
     </div>
            <button id="filter-apply" class="apply-button">APPLY</button>
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
        <span class="value-number">${Math.round(stock.LastTradePriceOnly*100)/100}</span>
        <button data-type="valueBtn"
                class="value-btn ${stock.Change < 0 ? 'red-btn' : 'green-btn'}"> ${displayValue(stock)}
        </button>
        <div class="arrows-wrapper ${ ctrl.isFilterOpen() ? 'hideArrows' : '' }">
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

