sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/productModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],

  function (Controller, JSONModel, productModel, Filter, FilterOperator) {
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

        this.oFilterBar = new JSONModel({
          categories: [
            {
              id: "1",
              name: "laptop",
            },
            {
              id: "2",
              name: "M1",
            },
            {
              id: "3",
              name: "vacuum cleaner",
            },
            {
              id: "4",
              name: "2in1",
            },
            {
              id: "5",
              name: "M3",
            },
            {
              id: "6",
              name: "wet cleaning",
            },
            {
              id: "7",
              name: "coffee machines",
            },
          ],
          suppliers: [
            {
              id: "1",
              name: "AMD",
            },
            {
              id: "2",
              name: "Onliner",
            },
            {
              id: "3",
              name: "Newton",
            },
            {
              id: "4",
              name: "XStore",
            },
          ],
        });

        this.getView().setModel(oModel, this.APP_MODEL_NAME);
        this.getView().setModel(this.oTableModel, this.TABLE_MODEL_NAME);
        this.getView().setModel(this.oFilterBar, "filterBarModel");
      },

      onSelectProduct(bProductSelected) {
        this.oTableModel.setProperty("/isProductsSelected", bProductSelected);
      },

      _getSearchNameFilter: function () {
        const sSearchQuery = this.byId("searchName").getProperty("value");

        return sSearchQuery.length ? new Filter("name", FilterOperator.Contains, sSearchQuery) : null;
      },

      _getCategoriesFilter: function () {
        const aSelectedCategories = this.byId("categorySelect").getProperty("selectedKeys");
        const aFilters = [];

        if (aSelectedCategories.length > 0) {
          aSelectedCategories.forEach((sSelectedKey) => {
            aFilters.push(
              new Filter({
                path: "categories",
                operator: FilterOperator.EQ,
                value1: sSelectedKey,
                test: (categories) => {
                  const aResult = categories.filter((item) => item.id === sSelectedKey);

                  return aResult.length > 0;
                },
              })
            );
          });
        }

        return aFilters.length ? aFilters : null;
      },

      _getDateFilter: function () {
        let sDate = this.byId("releaseDate");
        const sDateStart = sDate.getDateValue();
        const sDateEnd = sDate.getSecondDateValue();

        if (!sDateStart || !sDateEnd) {
          return null;
        }

        return new Filter({
          path: "discountDate",
          operator: FilterOperator.BT,
          value1: sDateStart.toISOString(),
          value2: sDateEnd.toISOString(),
        });
      },

      _getSupplierFilter: function () {
        const sSupplier = this.byId("supplier").getSelectedKey();

        const supplierFilter = new Filter({
          path: "suppliers",
          operator: FilterOperator.EQ,
          value1: sSupplier,
          test: (supplier) => {
            const res = supplier.filter((item) => item.id === sSupplier);

            return res.length > 0;
          },
        });

        return sSupplier ? supplierFilter : null;
      },

      _getAllFilters: function () {
        let aFilters = [];

        aFilters.push(this._getSearchNameFilter());

        if (this._getCategoriesFilter()) {
          aFilters.push(
            new Filter({
              filters: this._getCategoriesFilter(),
              and: false,
            })
          );
        }

        aFilters.push(this._getDateFilter());
        aFilters.push(this._getSupplierFilter());

        aFilters = aFilters.filter((item) => {
          return item !== null;
        });

        return aFilters;
      },

      onSearchProducts: function () {
        const oTableBinding = this.byId("productList").getBinding("items");
        const aFilters = this._getAllFilters();

        oTableBinding.filter(aFilters);
      },

      onClearFilters: function () {
        const oTableBinding = this.byId("productList").getBinding("items");

        this.byId("releaseDate").setValue(null);
        this.byId("supplier").setValue(null);
        this.byId("searchName").setValue(null);
        this.byId("categorySelect").setSelectedKeys([]);

        oTableBinding.filter(null);
      },
    });
  }
);
