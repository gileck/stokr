const URL = "http://localhost:7000";

class Stocks {

  constructor(app) {
    this.Model = app.Model;
    this.utils = app.filterUtils;
  }

  remove(symbol) {
    const index = this.Model.getState().stocks.findIndex(stock => stock.Symbol === symbol);
    this.Model.getState().stocks.splice(index,1);
    this.Model.getState().symbols.splice(index,1);
    return Promise.resolve(symbol);
  }

  add(symbol) {
    this.Model.getState().symbols.push(symbol);
    return Promise.resolve(symbol);
  }

  swapStocks(symbol, direction) {
    const currentIndex = this.Model.getState().stocks.findIndex(stock => stock.Symbol === symbol);
    this._swap(this.Model.getState().stocks,currentIndex,currentIndex + direction);
    this._swap(this.Model.getState().symbols,currentIndex,currentIndex + direction);
  }

  filterStocks(filters) {
    return this.Model.getState().stocks.filter(stock => {
      return this.utils.filterByName(stock,filters.name) && this.utils.filterByGain(stock,filters.gain)
        && this.utils.filterByRangeFrom(stock,filters.range_from) && this.utils.filterByRangeTo(stock,filters.range_to);
    });
  }

  _swap(array,index1,index2) {
    array[index1] = array.splice(index2, 1, array[index1])[0];
  }
}

window.Stokr = window.Stokr || {};
window.Stokr.Stocks = Stocks;
