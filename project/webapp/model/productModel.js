sap.ui.define([
  "sap/ui/model/json/JSONModel",
],

  function (JSONModel) {
    "use strict";

    return {
      initModel() {
        const oModel = new JSONModel();
        oModel.loadData('../localData/products.json');

        this.oModel = oModel;
      },

      getModel() {
        return this.oModel;
      },

      removeProductsFromModel(aSelectedProducts) {
        const aUpdatedProducts = this._getNewData(aSelectedProducts);

        this._changeModel(aUpdatedProducts);
      },

      _getNewData(aSelectedProducts) {
        let aProductsList = this.oModel.getProperty("/products");

        aSelectedProducts.map((item) => {
          const sProductId = item.getBindingContext("appModel").getProperty("id");
          
          aProductsList = aProductsList.filter(({id}) => id !== sProductId);
        })

        return aProductsList;
      },

      _changeModel(aUpdatedProducts) {
        this.oModel.setProperty("/products", aUpdatedProducts);
      },
    };
  }
);