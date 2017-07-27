const SERVER_URL = "htt" +
  "p://localhost:7000";

class API {

  constructor() {

  }

  saveStock(symbol) {
     return fetch(SERVER_URL + "/symbol/" + symbol, {method: "POST"})
  }

  removeStock(symbol) {
    return fetch(SERVER_URL + "/symbol/" + symbol, {method: "DELETE"});
  }

  getSymbols() {
    return fetch(SERVER_URL + "/symbol")
      .then(response => response.json())
  }

  searchStocks(query) {
    return fetch(SERVER_URL + "/search?q=" + query)
      .then(response => response.json())
      .then(data => data.ResultSet.Result);
  }

  fetchStocks(symbols) {
    return fetch(URL + "/quotes?q=" + symbols.join(","))
      .then(response => response.json())
      .then(data => data.query.results ? data.query.results.quote : [])
      .then(stocks => Array.isArray(stocks) ? stocks : [stocks])
  }
}

window.Stokr = window.Stokr || {};
window.Stokr.API = API;
