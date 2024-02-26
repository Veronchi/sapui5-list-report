sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "veronchi/leverx/project/model/productModel",
],

  function (Controller, JSONModel, productModel) {
    "use strict";

    return Controller.extend("veronchi.leverx.project.controller.ProductsList", {
      APP_MODEL_NAME: "appModel",
      TABLE_MODEL_NAME: "tableModel",

      onInit() {
        this.oComponent = this.getOwnerComponent();
        const oModel = productModel.getModel();

        this.oTableModel = new JSONModel({
          isProductsSelected: false,
        });

        this.getView().setModel(oModel, this.APP_MODEL_NAME);
        this.getView().setModel(this.oTableModel, this.TABLE_MODEL_NAME);
      },

      onSelectProduct(bProductSelected) {
        this.oTableModel.setProperty("/isProductsSelected", bProductSelected);
      }
    });
  });
