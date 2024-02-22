sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "veronchi/leverx/project/model/productModel"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.model.json.JSONModel} JSONModel
   */
  function (Controller, JSONModel, productModel) {
    "use strict";

    return Controller.extend("veronchi.leverx.project.controller.ProductsList", {
      onInit: function () {
        this.oComponent = this.getOwnerComponent();
        const oModel = productModel.getModel();

        this.oTableModel = new JSONModel({
          isActive: false
        });

        this.getView().setModel(oModel, "appModel");
        this.getView().setModel(this.oTableModel, "tableModel");
      },

      onSelectProduct: function (oEvent) {
        oEvent.getParameter('selected') ?
          this.oTableModel.setProperty('/isActive', true) : this.oTableModel.setProperty('/isActive', false);
      }
    });
  });
