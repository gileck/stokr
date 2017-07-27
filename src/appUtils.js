class appUtils {

  static debounce(func, wait) {
    let timeout;
    return function() {
      let context = this, args = arguments;
      let later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
}

window.Stokr = window.Stokr || {};
window.Stokr.appUtils = appUtils;
