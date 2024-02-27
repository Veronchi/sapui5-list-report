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
      FILTERBAR_MODEL_NAME: "filterBarModel",
      TOKEN_REMOVED_TYPE: "removed",

      onInit() {
        this.oComponent = this.getOwnerComponent();
        productModel.initModel();
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
        this.getView().setModel(this.oFilterBar, this.FILTERBAR_MODEL_NAME);
      },

      onSelectProduct(bProductSelected) {
        this.oTableModel.setProperty("/isProductsSelected", bProductSelected);
      },

      _getSearchNameFilter() {
        const sSearchQuery = this.byId("searchName").getProperty("value");

        return sSearchQuery.length ? new Filter("name", FilterOperator.Contains, sSearchQuery) : null;
      },

      _getCategoriesFilter() {
        const aSelectedCategories = this.byId("categorySelect").getProperty("selectedKeys");
        const aFilters = [];

        if (!!aSelectedCategories.length) {
          aSelectedCategories.forEach((sSelectedKey) => {
            aFilters.push(
              new Filter({
                path: "categories",
                operator: FilterOperator.EQ,
                value1: sSelectedKey,
                test: (aCategories) => {
                  const aResult = aCategories.filter((item) => item.id === sSelectedKey);

                  return !!aResult.length;
                },
              })
            );
          });
        }

        return aFilters.length ? aFilters : null;
      },

      _getDateFilter() {
        const sDate = this.byId("releaseDate");
        const sDateStart = sDate.getDateValue();
        const sDateEnd = sDate.getSecondDateValue();

        if (!sDateStart || !sDateEnd) {
          return null;
        }

        return new Filter({
          path: "releaseDate",
          operator: FilterOperator.BT,
          value1: sDateStart.toISOString(),
          value2: sDateEnd.toISOString(),
        });
      },

      _getCurrTokens(oEvent) {
        let aSuppliersTokens = this.byId("supplier").getTokens();
        const oMultiInput = oEvent.getParameters();
        const sTokenType = oMultiInput.type;

        if (sTokenType === this.TOKEN_REMOVED_TYPE) {
          aSuppliersTokens = aSuppliersTokens.filter((item) => item !== oMultiInput.removedTokens[0]);
        }

        return aSuppliersTokens;
      },

      _getSupplierFilterWithoutToken() {
        const sSupplierValue = this.byId("supplier").getValue();

        return [
          new Filter({
            path: "suppliers",
            operator: FilterOperator.EQ,
            value1: sSupplierValue,
            test: () => sSupplierValue === "",
          }),
        ];
      },

      _getSupplierFilterWithTokens(aSuppliersTokens) {
        const aFilters = [];

        aSuppliersTokens.forEach((sToken) => {
          aFilters.push(
            new Filter({
              path: "suppliers",
              operator: FilterOperator.EQ,
              value1: sToken,
              test: (aSuppliers) => {
                const aResult = aSuppliers.filter((item) => item.id === sToken.getProperty("key"));

                return !!aResult.length;
              },
            })
          );
        });

        return aFilters;
      },

      _getSupplierFilter(oEvent) {
        const aSuppliersTokens = this._getCurrTokens(oEvent);

        if (!aSuppliersTokens.length) {
          return this._getSupplierFilterWithoutToken(oEvent);
        } else {
          const aFilters = this._getSupplierFilterWithTokens(aSuppliersTokens);

          return aFilters;
        }
      },

      _getAllFilters(oEvent) {
        let aFilters = [];
        const categoriesFilter = this._getCategoriesFilter();
        const suppliersFilter = this._getSupplierFilter(oEvent);

        aFilters.push(this._getSearchNameFilter());
        aFilters.push(this._getDateFilter());

        if (categoriesFilter) {
          aFilters.push(
            new Filter({
              filters: categoriesFilter,
              and: false,
            })
          );
        }
        if (suppliersFilter) {
          aFilters.push(
            new Filter({
              filters: suppliersFilter,
              and: false,
            })
          );
        }

        aFilters = aFilters.filter((item) => {
          return item !== null;
        });

        return aFilters;
      },

      onSearchProducts(oEvent) {
        const oTableBinding = this.byId("productList").getBinding("items");
        const aFilters = this._getAllFilters(oEvent);

        oTableBinding.filter(aFilters);
      },

      onClearFilters() {
        const oTableBinding = this.byId("productList").getBinding("items");

        this.byId("releaseDate").setValue(null);
        this.byId("supplier").setTokens([]);
        this.byId("searchName").setValue(null);
        this.byId("categorySelect").setSelectedKeys([]);

        oTableBinding.filter(null);
      },
    });
  }
);
