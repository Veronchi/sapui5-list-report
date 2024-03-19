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
      },

      removeSupplierById(sSupplierId) {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const aNewSuppliers = aSuppliers.filter((item) => item.id !== sSupplierId);
        
        this.oModel.setProperty("/suppliers", aNewSuppliers);
      },

      setSupplierCountry(sSelectedCountry) {
        const aSuppliers = this.oModel.getProperty("/suppliers");
       
        const oCurrentSupplier = aSuppliers.find((item) => item.id === "0");
        oCurrentSupplier.country = sSelectedCountry;

        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      resetSupplierCountry() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
       
        const oCurrentSupplier = aSuppliers.find((item) => item.id === "0");
        oCurrentSupplier.country = "";
 
        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      setSupplierState(sSelectedState) {
        const aSuppliers = this.oModel.getProperty("/suppliers");
       
        const oCurrentSupplier = aSuppliers.find((item) => item.id === "0");
        oCurrentSupplier.state = sSelectedState;

        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      resetSupplierState() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
       
        const oCurrentSupplier = aSuppliers.find((item) => item.id === "0");
        oCurrentSupplier.state = "";
 
        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      setSupplierCity(sSelectedCity) {
        const aSuppliers = this.oModel.getProperty("/suppliers");
       
        const oCurrentSupplier = aSuppliers.find((item) => item.id === "0");
        oCurrentSupplier.city = sSelectedCity;

        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      resetSupplierCity() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
       
        const oCurrentSupplier = aSuppliers.find((item) => item.id === "0");
        oCurrentSupplier.city = "";
 
        this.oModel.setProperty("/suppliers", aSuppliers);
      },
    };
  }
);
