class FilterUtils {

  static filterByRangeTo(stock,rangeTo) {
    return !rangeTo || parseFloat(stock.realtime_chg_percent) < Number(rangeTo);
  }

  static filterByRangeFrom(stock,rangeFrom) {
    return !rangeFrom || parseFloat(stock.realtime_chg_percent) > Number(rangeFrom);
  }

  static filterByGain(stock,gain) {
    return gain ? gain === 1 && parseFloat(stock.realtime_chg_percent) > 0
      || gain === 2 && parseFloat(stock.realtime_chg_percent) < 0 : true;
  }

  static filterByName(stock,name) {
    return !name || stock.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
  }
}

window.Stokr = window.Stokr || {};
window.Stokr.filterUtils = FilterUtils;

