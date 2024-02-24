sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "veronchi/leverx/project/model/productModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
],

  function (Controller, JSONModel, productModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("veronchi.leverx.project.controller.ProductsList", {
      onInit: function () {
        this.oComponent = this.getOwnerComponent();
        const oModel = productModel.getModel();

        this.oTableModel = new JSONModel({
          isActive: false
        });

        this.oFilterBar = new JSONModel({
          categories: [
            {
              "id": "1",
              "name": "laptop"
            },
            {
              "id": "2",
              "name": "M1"
            },
            {
              "id": "3",
              "name": "vacuum cleaner"
            },
            {
              "id": "4",
              "name": "2in1"
            },
            {
              "id": "5",
              "name": "M3"
            },
            {
              "id": "6",
              "name": "wet cleaning"
            },
            {
              "id": "7",
              "name": "coffee machines"
            }
          ],
          suppliers: [
            {
              "id": "1",
              "name": "AMD"
            },
            {
              "id": "2",
              "name": "Onliner"
            },
            {
              "id": "3",
              "name": "Newton"
            },
            {
              "id": "4",
              "name": "XStore"
            }
          ]
        })

        this.getView().setModel(oModel, "appModel");
        this.getView().setModel(this.oTableModel, "tableModel");
        this.getView().setModel(this.oFilterBar, "filterBarModel");
      },

      onSelectProduct: function (oEvent) {
        oEvent.getParameter('selected') ?
          this.oTableModel.setProperty('/isActive', true) : this.oTableModel.setProperty('/isActive', false);
      },

      onSearchProducts: function () {
        const oTableBinding = this.byId("productList").getBinding("items");
        const sSearchQery = this.byId("searchName").getProperty('value');
        const aSelectedCategories = this.byId('categorySelect').getProperty('selectedKeys');

        const aFilters = new Filter({
          filters: [
            new Filter("name", FilterOperator.Contains, sSearchQery)
          ]
        });

        oTableBinding.filter(aFilters);
      },
    })
  });
