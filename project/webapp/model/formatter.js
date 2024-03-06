sap.ui.define([], () => {
  "use strict";

  return {
    initResourceBundle(oResourceBundle) {
      this.oResourceBundle = oResourceBundle;
    },

    formatConfirmMessageText(aProductsNames) {
      if(!aProductsNames || !aProductsNames.length) {
        return "";
      }

      return this.oResourceBundle.getText(aProductsNames.length > 1 ? "ConfirmDeleteProductsText" : "ConfirmDeleteProductText", [
        aProductsNames.length > 1 ? aProductsNames.length : aProductsNames[0]
      ]);
    }
  };
});
