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

      resetProductChange(iProductIndex, oInitialProductClone) {
        this.oModel.setProperty(`/products/${iProductIndex}`, oInitialProductClone);
      },

      removeProductCategory(iProductId, aProductsCategoryId) {
        const aProductCategories = this.oModel.getProperty(`/products/${iProductId}/categories`);

        const aUpdatedCategories = aProductCategories.filter((category) => category.id !== aProductsCategoryId);

        this.oModel.setProperty(`/products/${iProductId}/categories`, aUpdatedCategories);
      },

      addProductCategory(iProductId, category) {
        const aProductCategories = this.oModel.getProperty(`/products/${iProductId}/categories`);

        aProductCategories.push(category);

        this.oModel.setProperty(`/products/${iProductId}/categories`, aProductCategories);
        this.oModel.refresh(true);
      }
    };
  }
);
