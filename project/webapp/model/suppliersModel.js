sap.ui.define(
  ["sap/ui/model/json/JSONModel"],

  function (JSONModel) {
    "use strict";

    return {
      initSuppliersModel() {
        const oModel = new JSONModel();
        oModel.loadData("../localData/suppliers.json");

        this.oModel = oModel;
      },

      getSuppliersModel() {
        return this.oModel;
      },

      getNewSupplierId() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const oNewSupplier = aSuppliers.find((item) => item.id === "0");

        if(!oNewSupplier) {
          return
        }

        oNewSupplier.id = parseInt(Math.random() * 10000, 0).toString();
        this.oModel.setProperty("/suppliers", aSuppliers);

        return oNewSupplier;
      },

      addCleanSupplier() {
        const aSuppliers = this.oModel.getProperty("/suppliers");

        aSuppliers.push({
          "id": "0",
          "name": "",
          "country": "",
          "city": "", 
          "street": "",
          "state": "",
          "zipCode": 0
        });

        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      resetSuppliers() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const aNewSuppliers = aSuppliers.filter((item) => item.id !== "0");
        
        this.oModel.setProperty("/suppliers", aNewSuppliers);
      }
    };
  }
);
