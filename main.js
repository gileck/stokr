let state = {
  btnState: "PercentChange"
};

let eventHandler = {
  valueBtn: handleValueBtnClick,
  arrowBtnDown: handleArrowBtnClickDown,
  arrowBtnUp: handleArrowBtnClickUp,
};

function getValue(stock) {
  if (state.btnState === "PercentChange") {
    return stock[state.btnState];
  } else {
    return Math.round(stock[state.btnState]*100)/100 + "B";
  }
}

function handleValueBtnClick() {
  changeBtnState();
  render();
}

function handleArrowBtnClickUp(e) {
  let symbol = e.target.getAttribute("data-id");
  let currentIndex = stocks.map(stock => stock.Symbol).indexOf(symbol);
  if (currentIndex === 0) return;
  swap(currentIndex,currentIndex - 1);
  render();
}

function handleArrowBtnClickDown(e) {
  let symbol = e.target.getAttribute("data-id");
  let currentIndex = stocks.map(stock => stock.Symbol).indexOf(symbol);
  if (currentIndex === stocks.length - 1) return;
  swap(currentIndex,currentIndex + 1);
  render();
}

function swap(index1,index2) {
  stocks[index1] = stocks.splice(index2,1,stocks[index1])[0];
}

function changeBtnState() {
  state.btnState = state.btnState === "LastTradePriceOnly" ? "PercentChange" : "LastTradePriceOnly";
}

function render() {
  document.querySelector("#root").innerHTML = generateHTML();
  document.querySelector("#root ul").addEventListener("click",(e) => {
    let type = e.target.getAttribute("data-type");
    if (!type) return;
    eventHandler[type](e);
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateHTML() {
  return `<ul class="stocks-ul">${ stocks.map(generateListItem).join('') }</ul>`
}

function isDisabled(type,Symbol) {
  let currentIndex = stocks.map(stock => stock.Symbol).indexOf(Symbol);
  if (type === "top") return currentIndex === 0;
  if (type === "down") return currentIndex === stocks.length - 1;
}

function generateListItem(stock) {
  return `<li>  
    <span class="stock-name">${stock.Symbol} (${stock.Name})</span>
    <div class="li-right">
      <span class="value-number">${Math.round(stock.Change*100)/100}</span>
      <button data-type="valueBtn" 
      data-id="${stock.Symbol}" 
      class="value-btn ${stock.Change < 0 ? 'red-btn' : 'green-btn'}">
${getValue(stock)}</button>
      <div class="arrows-wrapper">
        <div 
        class="icon-arrow arrow-up ${isDisabled("top",stock.Symbol) ? 'disable-arrow' : ''}" 
        data-type="arrowBtnUp" 
        data-id="${stock.Symbol}"></div>
        <div 
        data-type="arrowBtnDown" 
        data-id="${stock.Symbol}" 
        class="icon-arrow arrow-down ${isDisabled("down",stock.Symbol) ? 'disable-arrow' : ''}"></div> 
      </div>
    </div>
</li>`
}

render();
