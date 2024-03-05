sap.ui.define([
  "sap/ui/model/json/JSONModel",
],

  function (JSONModel) {
    "use strict";

    return {
      initModel() {
        const oModel = new JSONModel();
        oModel.loadData("../localData/products.json");

        this.oModel = oModel;
      },

      getModel() {
        return this.oModel;
      },

      removeProducts(aProductsId) {
        const aProductsList = this.oModel.getProperty("/products");

        const aUpdatedProducts = aProductsList.filter(({id}) => !aProductsId.includes(id));

        this.oModel.setProperty("/products", aUpdatedProducts);
      },
    };
  }
);