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

      addClearProduct() {
        const aNewProductsList = this.oModel.getProperty("/products");
        aNewProductsList.push({
            "id": "0",
            "name": "",
            "description": "",
            "rating": 0,
            "releaseDate": "",
            "discountDate": "",
            "price": 0,
            "currencyCode": "USD",
            "categories": [],
            "suppliers": [],
            "comments": []
          }
        );
        
        this.oModel.setProperty("/products", aNewProductsList);
      },

      addNewProduct() {
        const aNewProductsList = this.oModel.getProperty("/products");
        const oNewProduct = aNewProductsList.find((item) => item.id === "0");

        oNewProduct.id = parseInt(Math.random() * 10000, 0).toString();
        this.oModel.setProperty("/products", aNewProductsList);
      },

      resetProductCreate() {
        const aProductsList = this.oModel.getProperty("/products");
        const aNewProductsList = aProductsList.filter((item) => item.id !== "0");

        this.oModel.setProperty("/products", aNewProductsList);
      },

      addProductCategory(sContextPath, category) {
        const aProductCategories = this.oModel.getProperty(`${sContextPath}/categories`);
        aProductCategories.push(category);

        this.oModel.setProperty(`${sContextPath}/categories`, aProductCategories);
      },

      addCleanSupplier(sContextPath) {
        const aProductSuppliers = this.oModel.getProperty(`${sContextPath}/suppliers`);

        if(!aProductSuppliers.find((item) => item.id === "0")) {
          aProductSuppliers.push({id: "0", name: ""});

          this.oModel.setProperty(`${sContextPath}/suppliers`, aProductSuppliers);
        }
      },

      addNewSupplier(sContextPath, oNewSupplier) {
        const aProductSuppliers = this.oModel.getProperty(`${sContextPath}/suppliers`);
        const aNewProductSuppliers = aProductSuppliers.map((supplier) => {
          if(supplier.id === "0") {
            return {id: oNewSupplier.id, name: oNewSupplier.name};
          }

          return supplier;
        });

        this.oModel.setProperty(`${sContextPath}/suppliers`, aNewProductSuppliers);
      },

      removeSupplierById(sContextPath, sSupplierId) {
        const aProductSuppliers = this.oModel.getProperty(`${sContextPath}/suppliers`);

        const aNewProductSuppliers = aProductSuppliers.filter((item) => item.id !== sSupplierId);
        this.oModel.setProperty(`${sContextPath}/suppliers`, aNewProductSuppliers);
      },

      addProductComment(sContextPath, sProductComment) {
        const aProductComments = this.oModel.getProperty(`${sContextPath}/comments`);
        aProductComments.push({
          id: parseInt(Math.random() * 10000, 0).toString(),
          comment: sProductComment
        });

        this.oModel.setProperty(`${sContextPath}/comments`, aProductComments);
      }
    };
  }
);
