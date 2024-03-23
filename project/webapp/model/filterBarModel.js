sap.ui.define(
  ["sap/ui/model/json/JSONModel"],

  function (JSONModel) {
    "use strict";

    return {
      initFilterBarModel() {
        const oModel = new JSONModel();
        oModel.loadData(sap.ui.require.toUrl("veronchi/leverx/project/localData/filterBarData.json"));

        this.oModel = oModel;
      },

      getFilterBarModel() {
        return this.oModel;
      },

      getCategoryById(sCategoryId) {
        return this.oModel.getProperty(`/categories`).find((category) => category.id === sCategoryId);
      }
    };
  }
);
