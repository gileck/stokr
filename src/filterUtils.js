class FilterUtils {

  constructor(app) {
    this.Model = app.Model;
    this.Ctrl = app.Ctrl;
  }

  filterStocks(filters) {
    return this.Model.getState().stocks.filter(stock => {
      return this.filterByName(stock,filters.name) && this.filterByGain(stock,filters.gain)
        && this.filterByRangeFrom(stock,filters.range_from) && this.filterByRangeTo(stock,filters.range_to);
    });
  }

  filterByRangeTo(stock,rangeTo) {
    return !rangeTo || parseFloat(stock.realtime_chg_percent) < Number(rangeTo);
  }

  filterByRangeFrom(stock,rangeFrom) {
    return !rangeFrom || parseFloat(stock.realtime_chg_percent) > Number(rangeFrom);
  }

  filterByGain(stock,gain) {
    return gain ? gain === 1 && parseFloat(stock.realtime_chg_percent) > 0
      || gain === 2 && parseFloat(stock.realtime_chg_percent) < 0 : true;
  }

  filterByName(stock,name) {
    return !name || stock.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
  }
}

window.Stokr = window.Stokr || {};
window.Stokr.FilterUtils = FilterUtils;
