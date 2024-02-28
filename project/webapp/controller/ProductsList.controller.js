sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/filterBarModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
  ],

  function (
    Controller,
    JSONModel,
    productModel,
    filterBarModel,
    Filter,
    FilterOperator,
    MessageBox,
    Sorter
  ) {
    "use strict";

    return Controller.extend(
      "veronchi.leverx.project.controller.ProductsList",
      {
        APP_MODEL_NAME: "appModel",
        TABLE_MODEL_NAME: "tableModel",
        FILTER_BAR_MODEL_NAME: "filterBarModel",
        TOKEN_REMOVED_TYPE: "removed",

        onInit() {
          productModel.initModel();
          filterBarModel.initFilterBarModel();
          const oModel = productModel.getModel();
          this.oFilterBarModel = filterBarModel.getFilterBarModel();
          this.oComponent = this.getOwnerComponent();
          this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();

          this.oTableModel = new JSONModel({
            isProductsSelected: false,
            isSortReset: false,
            isGroupReset: false,
          });

          this.getView().setModel(oModel, this.APP_MODEL_NAME);
          this.getView().setModel(this.oTableModel, this.TABLE_MODEL_NAME);
          this.getView().setModel(
            this.oFilterBarModel,
            this.FILTER_BAR_MODEL_NAME
          );
        },

        onSelectProduct(bProductSelected) {
          this.oTableModel.setProperty("/isProductsSelected", bProductSelected);
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

      async onSortButtonPress() {
        if (!this.oDialog) {
          this.oDialog = await this.loadFragment({
            name: "veronchi.leverx.project.view.fragments.SortingDialog"
          });
        }

        this.oDialog.open();
      },

      async onGroupButtonPress() {
        if (!this.oGroupingDialog) {
          this.oGroupingDialog = await this.loadFragment({
            name: "veronchi.leverx.project.view.fragments.GroupingDialog"
          });
        }

        this.oGroupingDialog.open();
      },

      handleSortingConfirm(oEvent) {
        const oTableBinding = this.byId("productList").getBinding("items");
        const isSortReset = this.oTableModel.getProperty("/isSortReset");
				const mParams = oEvent.getParameters();
        
        if(mParams.sortItem) {
          const sPath = mParams.sortItem.getKey();
          const bDescending = mParams.sortDescending;
          const oSorter = new Sorter(sPath, bDescending);

          oTableBinding.sort(oSorter);
        } else if(isSortReset) {
          oTableBinding.sort();
          this.oTableModel.setProperty("/isSortReset", false);
        }
      },

      handleResetSorting() {
        this.oTableModel.setProperty("/isSortReset", true);
      },

      handleGroupingConfirm(oEvent) {
        const oTableBinding = this.byId("productList").getBinding("items");
        const isGroupReset = this.oTableModel.getProperty("/isGroupReset");
				const mParams = oEvent.getParameters();

        if (mParams.groupItem) {
          const sPath = mParams.groupItem.getKey();
          const bDescending = mParams.groupDescending;
          const oGroup = new Sorter(sPath, bDescending, true);

          oTableBinding.sort(oGroup);
        } else if (isGroupReset) {
          oTableBinding.sort();
          this.oTableModel.setProperty("/isGroupReset", false);
        }
      },

      handleResetGrouping() {
        this.oTableModel.setProperty("/isGroupReset", true);
      },

        _getSearchNameFilter() {
          const sSearchQuery = this.byId("searchName").getProperty("value");

          return sSearchQuery.length
            ? new Filter("name", FilterOperator.Contains, sSearchQuery)
            : null;
        },

        _getCategoriesFilter() {
          const aSelectedCategories =
            this.byId("categorySelect").getProperty("selectedKeys");
          let aFilters = [];

          if (!!aSelectedCategories.length) {
            aFilters = aSelectedCategories.map((sSelectedKey) => {
              return new Filter({
                path: "categories",
                operator: FilterOperator.EQ,
                value1: sSelectedKey,
                test: (aCategories) => {
                  return aCategories.some(({ id }) => id === sSelectedKey);
                }
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
          const aFilters = aSuppliersTokens.map((oToken) => {
            return new Filter({
              path: "suppliers",
              operator: FilterOperator.EQ,
              value1: oToken,
              test: (aSuppliers) => {
                return aSuppliers.some(
                  ({ id }) => id === oToken.getProperty("key")
                );
              }
            });
          });

          return aFilters;
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
          let aFilters = [];
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

      _removeProductsFromList(aProductsList) {
        const aSelectedProducts = this.byId("productList").getSelectedItems();
        
        aSelectedProducts.map((item) => {
          const sProductId = item.getBindingContext(this.APP_MODEL_NAME).getProperty("id");
          aProductsList = aProductsList.filter(({id}) => id !== sProductId);
        })

        return aProductsList;
      },

      _deleteProducts() {
        const aProductsList = this.getView().getModel(this.APP_MODEL_NAME).getProperty("/products");
        const aUpdatedList = this._removeProductsFromList(aProductsList);
        
        this.getView().getModel(this.APP_MODEL_NAME).setProperty("/products", aUpdatedList);
        this.oTableModel.setProperty("/isProductsSelected", false);
        this.byId("productList").removeSelections(true);
      },

      onDeleteProductPress() {
        MessageBox.confirm(this._getConfirmationText(), {
          title: this.oResourceBundle.getText("ConfirmDeleteProductTitle"),
          actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
          onClose: (sAction) => {
            switch (sAction) {
              case MessageBox.Action.OK:
                this._deleteProducts();
                break;

                default:
                  break;
              }
            },
          });
        },

        _getConfirmationText() {
          const aSelectedItems = this.byId("productList").getSelectedItems();
          const sPath = aSelectedItems[0].getBindingContext(this.APP_MODEL_NAME).getPath();
          const sProductName = aSelectedItems[0].getBindingContext(this.APP_MODEL_NAME).getModel().getProperty(`${sPath}/name`);

          if (aSelectedItems.length > 1) {
            return this.oResourceBundle.getText("ConfirmDeleteProductsText", [aSelectedItems.length]);
          }

          return this.oResourceBundle.getText("ConfirmDeleteProductsText", [sProductName]);
        },
    });


  }
);
