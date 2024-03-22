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
      },

      addDraftSupplier(sContextPath, oNewSupplier) {
        const aProductSuppliers = this.oModel.getProperty(`${sContextPath}/suppliers`);

        aProductSuppliers.push({id: oNewSupplier.id, name: oNewSupplier.name});

        this.oModel.setProperty(`${sContextPath}/suppliers`, aProductSuppliers);
      },

      addNewSuppliers(sContextPath, aNewSuppliers) {
        const aProductSuppliers = this.oModel.getProperty(`${sContextPath}/suppliers`);
        const aNewProductSuppliers = aProductSuppliers.map((supplier) => {

          if(!supplier.name) {
            const oCurrNewSupplier = aNewSuppliers.find(item => item.id === supplier.id);
            return {id: oCurrNewSupplier.id, name: oCurrNewSupplier.name};
          }
          return supplier;
        })

        this.oModel.setProperty(`${sContextPath}/suppliers`, aNewProductSuppliers);
      },

      removeSupplierById(sContextPath, sSupplierId) {
        const aProductSuppliers = this.oModel.getProperty(`${sContextPath}/suppliers`);
        const aNewProductSuppliers = aProductSuppliers.filter((item) => item.id !== sSupplierId);
        
        this.oModel.setProperty(`${sContextPath}/suppliers`, aNewProductSuppliers);
      }
    };
  }
);
