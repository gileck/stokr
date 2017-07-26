class Router {

  constructor(app) {
    this.Model = app.Model;
    this.Ctrl = app.Ctrl;
  }

  Home() {
    window.location.hash = "#"
  }

  Search() {
    window.location.hash = "#search"
  }

}

window.Stokr = window.Stokr || {};
window.Stokr.Router = Router;
