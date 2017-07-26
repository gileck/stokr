class StateMgmt {

  constructor(app) {
    this.Model = app.Model;
    this.Ctrl = app.Ctrl;
  }

  saveToLocalStorage() {
    const stocksCopy = this.Model.getState().stocks.slice();
    this.Model.getState().stocks = [];
    localStorage.setItem("state",JSON.stringify(this.Model.getState()));
    this.Model.getState().stocks = stocksCopy;
  }

  setStateFromLocalStorage() {
    const savedState = JSON.parse(localStorage.getItem("state"));
    if (savedState) this.Model.setState(savedState);
  }

}

window.Stokr = window.Stokr || {};
window.Stokr.StateMgmt = StateMgmt;
