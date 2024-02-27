sap.ui.define([
  "sap/ui/model/json/JSONModel",
],

  function (JSONModel) {
    "use strict";

    return {
      _initModel() {
        const oModel = new JSONModel();
        oModel.loadData('../localData/products.json');

        return oModel;
      },

      getModel() {
        return this._initModel();
      }
    };
  });