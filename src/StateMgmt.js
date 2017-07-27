class StateMgmt {

  constructor(app) {
    this.Model = app.Model;
    this.Ctrl = app.Ctrl;
  }

  saveToLocalStorage() {
    const stateToSave = {
      displayMode: this.Model.getState().displayMode,
      filter: this.Model.getState().filter,
      edit: this.Model.getState().edit
    };
    localStorage.setItem("state",JSON.stringify(stateToSave));
  }

  setStateFromLocalStorage() {
    const savedState = JSON.parse(localStorage.getItem("state"));
    if (savedState) this.Model.setState(savedState);
  }

}

window.Stokr = window.Stokr || {};
window.Stokr.StateMgmt = StateMgmt;
