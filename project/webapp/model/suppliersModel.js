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

      getDraftSupplier() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const oNewSupplier = aSuppliers[aSuppliers.length - 1];

        if(!oNewSupplier) {
          return
        }

        this.oModel.setProperty("/suppliers", aSuppliers);

        return oNewSupplier;
      },

      getNewSuppliers() {
        const aSuppliers = this.oModel.getProperty("/suppliers");

        aSuppliers.filter((item) => {
          item.isDraft ? item.isDraft = false : null;
        });

        this.oModel.setProperty("/suppliers", aSuppliers);

        return aSuppliers;
      },

      addDraftSupplier() {
        const aSuppliers = this.oModel.getProperty("/suppliers");

        aSuppliers.push({
          "id": parseInt(Math.random() * 10000, 0).toString(),
          "name": "",
          "country": "",
          "city": "", 
          "street": "",
          "state": "",
          "zipCode": 0,
          "isDraft": true,
          "Countries": [],
          "States": [],
          "Cities": []
        });

        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      setSupplierCountries(aCountries) {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const oCurrentDraftSupplier = this.getDraftSupplier();

        aSuppliers.find((item) => {
          if(item.id === oCurrentDraftSupplier.id) {
            item.Countries =  aCountries;
          }
        });

        this.oModel.setProperty("/suppliers", aSuppliers);
      },

      resetSuppliers() {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const aNewSuppliers = aSuppliers.filter((item) => !item.isDraft);
        
        this.oModel.setProperty("/suppliers", aNewSuppliers);
      },

      removeSupplierById(sSupplierId) {
        const aSuppliers = this.oModel.getProperty("/suppliers");
        const aNewSuppliers = aSuppliers.filter((item) => item.id !== sSupplierId);
        
        this.oModel.setProperty("/suppliers", aNewSuppliers);
      },

      setSupplierProperty(sSupplierPath, sPropertyName, sValue) {
        const oCurrentSupplier = this.oModel.getProperty(sSupplierPath);
        oCurrentSupplier[sPropertyName] = sValue;

        this.oModel.setProperty(sSupplierPath, oCurrentSupplier);
      },
      
      resetSupplierProperty(sSupplierPath, sPropertyName) {
        const oCurrentSupplier = this.oModel.getProperty(sSupplierPath);
       
        oCurrentSupplier[sPropertyName] = "";

        this.oModel.setProperty(sSupplierPath, oCurrentSupplier);
      },
    };
  }
);
