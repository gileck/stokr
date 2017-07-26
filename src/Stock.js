class Stock {

  constructor(app) {
    this.Model = app.Model;
    this.Ctrl = app.Ctrl;
  }

  Remove(symbol) {
    const index = this.Model.getState().stocks.findIndex(stock => stock.Symbol === symbol);
    this.Model.getState().stocks.splice(index,1);
    this.Model.getState().stocksNames.splice(index,1);
  }

  Add(symbol) {
    this.Model.getState().stocksNames.push(symbol);
  }

  Search(seachQuery) {
    return fetch(URL + "/search?q=" + seachQuery)
      .then(response => response.json())
      .then(data => data.ResultSet.Result)
      .then(results => results.filter(stock => this.Model.getState().stocksNames.indexOf(stock.symbol) === -1))
  }

  Fetch() {
    return fetch(URL + "/quotes?q=" + this.Model.getState().stocksNames.join(","))
    .then(response => response.json())
    .then(data => data.query.results.quote)
    .then(stocks => {
      if (!Array.isArray(stocks)) stocks = [stocks];
      this.Model.getState().stocks = stocks;
    });
  }

  SwapStocks(symbol,direction) {
    const currentIndex = this.Model.getState().stocks.findIndex(stock => stock.Symbol === symbol);
    this.swap(Model.getState().stocks,currentIndex,currentIndex + direction);
    this.swap(Model.getState().stocksNames,currentIndex,currentIndex + direction);
  }

  swap(array,index1,index2) {
    array[index1] = array.splice(index2, 1, array[index1])[0];
  }


}

window.Stokr = window.Stokr || {};
window.Stokr.Stock = Stock;
