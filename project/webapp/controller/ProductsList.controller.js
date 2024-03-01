sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/filterBarModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
  ],

  function (
    Controller,
    JSONModel,
    productModel,
    filterBarModel,
    Filter,
    FilterOperator,
    MessageBox
  ) {
    "use strict";

    return Controller.extend(
      "veronchi.leverx.project.controller.ProductsList",
      {
        APP_MODEL_NAME: "appModel",
        TABLE_MODEL_NAME: "tableModel",
        FILTER_BAR_MODEL_NAME: "filterBarModel",
        TOKEN_REMOVED_TYPE: "removed",
        ACTION_OK: "OK",

        onInit() {
          productModel.initModel();
          filterBarModel.initFilterBarModel();
          const oModel = productModel.getModel();
          this.oFilterBarModel = filterBarModel.getFilterBarModel();
          this.oComponent = this.getOwnerComponent();
          this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();

          this.oTableModel = new JSONModel({
            isProductsSelected: false
          });

          this.getView().setModel(oModel, this.APP_MODEL_NAME);
          this.getView().setModel(this.oTableModel, this.TABLE_MODEL_NAME);
          this.getView().setModel(this.oFilterBarModel, this.FILTER_BAR_MODEL_NAME);
        },

        onSelectProduct(bProductSelected) {
          const aSelectedItems = this.byId("productList").getSelectedItems();

          if(bProductSelected || !aSelectedItems.length) {
            this.oTableModel.setProperty("/isProductsSelected", bProductSelected);
          }
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

        onDeleteProductPress() {
          MessageBox.confirm(this._getConfirmationText(), {
            title: this.oResourceBundle.getText("ConfirmDeleteProductTitle"),
            actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
            onClose: (sAction) => {
              if(sAction.includes(this.ACTION_OK)) {
                this._deleteProducts();
              }
            }
          });
        },

        _getSearchNameFilter() {
          const sSearchQuery = this.byId("searchName").getProperty("value");

          return sSearchQuery.length
            ? new Filter("name", FilterOperator.Contains, sSearchQuery)
            : null;
        },

        _getCategoriesFilter() {
          const aSelectedCategories = this.byId("categorySelect").getProperty("selectedKeys");
          let aFilters = [];

          if (!!aSelectedCategories.length) {
            aFilters = aSelectedCategories.map((sSelectedKey) => {
              return new Filter({
                path: "categories",
                operator: FilterOperator.EQ,
                value1: sSelectedKey,
                test: (aCategories) => aCategories.some(({ id }) => id === sSelectedKey)
              });
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
            value2: sDateEnd.toISOString()
          });
        },

        _getCurrentTokens(oEvent) {
          let aSuppliersTokens = this.byId("supplier").getTokens();
          const oEventParameters = oEvent.getParameters();
          const sTokenType = oEventParameters.type;

          if (sTokenType === this.TOKEN_REMOVED_TYPE) {
            const sRemovedTokenKey = oEventParameters.removedTokens[0].getProperty("key");

            aSuppliersTokens = aSuppliersTokens.filter(
              (item) => item.getProperty("key") !== sRemovedTokenKey
            );
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
              test: () => sSupplierValue === ""
            })
          ];
        },

        _getSupplierFilterWithTokens(aSuppliersTokens) {
          return aSuppliersTokens.map((oToken) => {
            return new Filter({
              path: "suppliers",
              operator: FilterOperator.EQ,
              value1: oToken,
              test:(aSuppliers) => aSuppliers.some(({ id }) => id === oToken.getProperty("key"))
            });
          });
        },

        _getSupplierFilter(oEvent) {
          const aSuppliersTokens = this._getCurrentTokens(oEvent);

          if (aSuppliersTokens.length) {
            return this._getSupplierFilterWithTokens(aSuppliersTokens);
          } else {
            return this._getSupplierFilterWithoutToken();
          }
        },

        _getAllFilters(oEvent) {
          const aFilters = [];
          const categoriesFilter = this._getCategoriesFilter(),
            suppliersFilter = this._getSupplierFilter(oEvent),
            searchNameFilter = this._getSearchNameFilter(),
            dateFilter = this._getDateFilter();

          searchNameFilter && aFilters.push(searchNameFilter);
          dateFilter && aFilters.push(dateFilter);

          if (categoriesFilter) {
            aFilters.push(
              new Filter({
                filters: categoriesFilter,
                and: false
              })
            );
          }
          
            aFilters.push(
              new Filter({
                filters: suppliersFilter,
                and: false
              })
            );
          
          return aFilters;
        },

        _deleteProducts() {
          const aSelectedProducts = this.byId("productList").getSelectedItems();

          productModel.removeProdactsFromModel(aSelectedProducts);

          this.oTableModel.setProperty("/isProductsSelected", false);
          this.byId("productList").removeSelections(true);
        },

        _getConfirmationText() {
          const aSelectedItems = this.byId("productList").getSelectedItems();
          const sProductName = aSelectedItems[0].getBindingContext(this.APP_MODEL_NAME).getProperty("name");
          const bGreaterThanOne = aSelectedItems.length > 1;

          return this.oResourceBundle.getText(
            bGreaterThanOne ? "ConfirmDeleteProductsText" : "ConfirmDeleteProductText",
            [bGreaterThanOne ? aSelectedItems.length : sProductName]
          );
        },
      }
    );
  }
);
