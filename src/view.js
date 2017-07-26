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
    "submitFilters": function (e) {
      e.preventDefault();
      const elements = e.target.elements;
      const filters = {};
      filters.name = elements.name.value;
      filters.gain = Number(elements.gain.value);
      filters.range_from = elements.range_from.value;
      filters.range_to = elements.range_to.value;
      for (const item in filters) if (!filters[item]) delete filters[item];
      ctrl.filterStocks(filters);
    },
    "filter-btn": function (e) {
      ctrl.toggleFilter();
    },
    "edit-btn": function (e) {
      ctrl.toggleEdit();
    },
    "refresh": function () {
      ctrl.fetchStocks();
    },
    "search": function () {
      ctrl.openSearch();
    },
    "add-stock": function (e) {
      const symbol = e.target.closest('li').dataset.id;
      ctrl.addStock(symbol);
    },
    "remove": function (e) {
      const symbol = e.target.closest('li').dataset.id;
      ctrl.removeStock(symbol);
    }
  };

  function displayValue(stock) {
    const field = displayedFields[state.displayMode];
    return field.display(stock[field.name]);
  }

  function getFilterClass() {
    if (state.filter) return "show-filter";
    return '';
  }

  function clickEventHandler(e) {
    let type = getType(e.target);
    if (!type || e.target.hasAttribute("disabled")) return;
    handlerFunctions[type](e);
  }

  function getType(element) {
    if (!element) return null;
    if (!element.dataset || !element.dataset.type) return getType(element.parentNode);
    return element.dataset.type;
  }

  function search(e) {
    if (e.keyCode !== 13) return;
    const value = e.target.value;
    console.log(value);
    ctrl.searchStock(value);
  }

  function hashchangeHandler() {
    ctrl.routeChange(location.hash);
  }

  function render() {

    if (location.hash === "#search") {
      document.querySelector("#root").innerHTML = generateSearch();
      document.querySelector("#search-input").addEventListener("keypress",search);
    } else {
      document.querySelector("#root").innerHTML = generateHTML();
      document.querySelector("#filter-form").addEventListener("submit",handlerFunctions.submitFilters);
    }

    document.querySelector("#root").addEventListener("click",clickEventHandler);
    window.addEventListener('hashchange', hashchangeHandler);
  }

  function isItemOpen(item) {
    if (state[item]) return "color-red"
  }

  function showEditButton() {
    if (state.edit) return "show-edit"
    return ''
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function generateSearch() {
    return `
      <div>
        <div class="search-input-wrapper">
            <input class="search-input" id="search-input"><a href="#" class="cancel-btn">Cancel</a>
        </div>
        <div id="search-results">
          <div class="search-default-wrapper">
            <div class="icon-search-place-holder search-icon"></div>
            <div id="search-text-pleace" class="search-text">Search</div>
          </div>
        </div>
      </div>
    `
  }

  function generateSearchItem(stock) {
    return `
       <li data-id="${stock.symbol}" class="search-li">
           <span class="search-stock-name">${stock.name}</span>
           <span class="search-stock-exch">${stock.exchDisp}</span>
           <button class="plus-btn" data-type="add-stock">+</button>
      </li>
    `;
  }

  function renderSearchResults(results) {

    if (results.length > 0) {
      document.querySelector("#search-results").innerHTML ='<ul  class="search-results-ul">' +  results.map(generateSearchItem).join('')  + "</ul>";
    } else {
      document.querySelector("#search-text-pleace").innerHTML = "Not Found"
    }

  }

  function generateHTML() {
    return `
      <header>
      <h1 class="main-header">STOKR</h1>
      <nav id="#menu">
        <ul class="nav-ul">
          <li><a href="#search" class="icon-search menu-icon"></a></li>
          <li><span data-type="refresh" class="icon-refresh menu-icon" ></span></li>
          <li><span data-type="filter-btn" class="icon-filter menu-icon ${isItemOpen('filter')}"></span></li>
          <li><span data-type="edit-btn" class="icon-settings menu-icon ${isItemOpen('edit')}"></span></li>
        </ul>
      </nav>
    </header>

  <form id="filter-form" class="filter ${ getFilterClass() }">
  <div class="filter-body">
      
       <div class="filter-left">
         <div class="input-label">
            <label for="name">By Name</label>
            <input name="name" id="filter-name">
         </div>       
         <div class="input-label">
             <label for="gain">By Gain</label>
             <select name="gain" id="filter-gain">
                <option value=0>All</option>  
                <option value=1>Gaining</option>  
                <option value=2>Losing</option>  
            </select>
         </div>      
       </div>
        <div class="filter-right">
           <div class="input-label">
              <label for="range-from">By Range: From</label>
              <input name="range_from" id="filter-range-from">
           </div>       
           <div class="input-label">
              <label for="range-to">By Range: To</label>
               <input name="range_to" id="filter-range-to">
           </div>  
       </div>
     </div>
    <button type="submit" class="apply-button">APPLY</button>
   </form>
   
  <ul id="stocks-ul" class="stocks-ul">
      ${ state.stocks.map(generateListItem).join('') }
    </ul>
  `
  }

  function generateListItem(stock, index) {
    return `<li data-id="${stock.Symbol}">
      <button class="edit-btn ${showEditButton()}" data-type="remove"><span class=""></span></button>
      <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
      <div class="li-right">
        <span class="value-number">${Math.round(stock.LastTradePriceOnly*100)/100}</span>
        <button data-type="valueBtn"
                class="value-btn ${stock.Change < 0 ? 'red-btn' : 'green-btn'}"> ${displayValue(stock)}
        </button>
        <div class="arrows-wrapper ${ state.filter ? 'hideArrows' : '' }">
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
    renderStock,
    renderSearchResults
  }
  })();



