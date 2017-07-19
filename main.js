let state = {
  btnState: 0
};

let displayedFields = [
  {name: "PercentChange", display: value => value},
  {name: "LastTradePriceOnly", display: value => Math.round(value*100)/100 + "B"},
  {name: "Change", display: value => Math.round(value*100)/100}
];

let handlerFunctions = {
  valueBtn: handleValueBtnClick,
  arrowBtn: handleArrowBtnClick
};

function getValue(stock) {
  const field = displayedFields[state.btnState];
  return field.display(stock[field.name]);
}

function handleValueBtnClick() {
  changeBtnState();
  render();
}

function handleArrowBtnClick(e) {
  const symbol = e.target.getAttribute("data-id");
  const currentIndex = stocks.map(stock => stock.Symbol).indexOf(symbol);
  const arrowType = e.target.getAttribute("data-arrow-type");
  if (arrowType === "up" && currentIndex === 0 || arrowType === "down" && currentIndex === stocks.length - 1) return;
  swap(currentIndex, (arrowType === "up") ? currentIndex - 1 : currentIndex + 1);
  render();
}

function swap(index1,index2) {
  stocks[index1] = stocks.splice(index2,1,stocks[index1])[0];
}

function changeBtnState() {
  state.btnState++;
  if (state.btnState === displayedFields.length) state.btnState = 0;
}

function isDisabled(type,Symbol) {
  let currentIndex = stocks.map(stock => stock.Symbol).indexOf(Symbol);
  if (type === "top") return currentIndex === 0;
  if (type === "down") return currentIndex === stocks.length - 1;
}

function clickEventHandler(e) {
  let type = e.target.getAttribute("data-type");
  if (!type) return;
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
  </ul>`
}


function generateListItem(stock) {
  return `<li>  
    <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
    <div class="li-right">
      <span class="value-number">${Math.round(stock.Change*100)/100}</span>
      <button data-type="valueBtn" 
              data-id="${stock.Symbol}" 
              class="value-btn ${stock.Change < 0 ? 'red-btn' : 'green-btn'}">
        ${getValue(stock)}
      </button>
      <div class="arrows-wrapper">
        <div 
        class="icon-arrow arrow-up ${isDisabled("top",stock.Symbol) ? 'disable-arrow' : ''}" 
        data-type="arrowBtn"
        data-arrow-type="up"
        data-id="${stock.Symbol}"></div>
        <div 
        data-type="arrowBtn"
        data-arrow-type="down"
        data-id="${stock.Symbol}" 
        class="icon-arrow arrow-down ${isDisabled("down",stock.Symbol) ? 'disable-arrow' : ''}"></div> 
      </div>
    </div>
</li>`
}



render();
