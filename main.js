let state = {
  btnState: "PercentChange"
};

let eventHandler = {
  valuebtn: handleValueBtnClick
};

function getValue(stock) {
  return stock[state.btnState];
};

function handleValueBtnClick() {
  changeBtnState();
  render();
}

function changeBtnState() {
  state.btnState = state.btnState === "Change" ? "PercentChange" : "Change";
}

function render() {
  document.querySelector("#root").innerHTML = generateHTML();
  document.querySelector("ul").addEventListener("click",(e) => {
    eventHandler[e.target.getAttribute("data-type")](e);
  });
}

//////////////////////

function generateHTML() {
  return `<ul>
      ${ stocks.map(generateListItem).join('') }
  </ul>`
}

function generateListItem(stock) {
  return `<li>  
    <span>${stock.Symbol} (${stock.Name})</span>
    <span>${stock.LastTradePriceOnly}</span>
    <button data-type="valuebtn" data-id="${stock.Symbol}">${getValue(stock)}</button>
</li>`
}

render();
