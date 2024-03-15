sap.ui.define(
  ["sap/ui/model/json/JSONModel"],

  function (JSONModel) {
    "use strict";

    return {
      initModel() {
        const oModel = new JSONModel();
        oModel.loadData(sap.ui.require.toUrl("veronchi/leverx/project/localData/products.json"));

        this.oModel = oModel;
      },

      getModel() {
        return this.oModel;
      },

      removeProducts(aProductsId) {
        const aProductsList = this.oModel.getProperty("/products");

        const aUpdatedProducts = aProductsList.filter(({ id }) => !aProductsId.includes(id));

        this.oModel.setProperty("/products", aUpdatedProducts);
      },

      resetProductChange(sContextPath, oInitialProductClone) {
        this.oModel.setProperty(sContextPath, oInitialProductClone);
      },

      removeProductCategory(sContextPath, aProductsCategoryId) {
        const aProductCategories = this.oModel.getProperty(`${sContextPath}/categories`);

        const aUpdatedCategories = aProductCategories.filter((category) => category.id !== aProductsCategoryId);

        this.oModel.setProperty(`${sContextPath}/categories`, aUpdatedCategories);
      },

      addProductCategory(sContextPath, category) {
        const aProductCategories = this.oModel.getProperty(`${sContextPath}/categories`);

        aProductCategories.push(category);

        this.oModel.setProperty(`${sContextPath}/categories`, aProductCategories);
      }
    };
  }
);
