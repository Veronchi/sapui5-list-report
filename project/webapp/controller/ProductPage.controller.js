sap.ui.define(
  [
    "veronchi/leverx/project/controller/BaseController",
    "veronchi/leverx/project/utils/constants",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/formatter",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/filterBarModel",
    "sap/ui/core/Messaging",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "veronchi/leverx/project/model/suppliersModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "veronchi/leverx/project/utils/locationAPI",
  ],

  function (
    BaseController,
    constants,
    productModel,
    formatter,
    JSONModel,
    filterBarModel,
    Messaging,
    MessagePopover,
    MessageItem,
    Message,
    library,
    suppliersModel,
    Filter,
    FilterOperator,
    locationAPI
  ) {
    "use strict";

    return BaseController.extend("veronchi.leverx.project.controller.ProductPage", {
      formatter: formatter,

      onInit() {
        this.oResourceBundle = this.getResourceBundle();
        const oRouter = this.getRouter();
        
        this._initMessageManager();
        filterBarModel.initFilterBarModel();
        suppliersModel.initSuppliersModel();
        oRouter.getRoute(constants.ROUTES.PRODUCTS_PAGE).attachPatternMatched(this.onPatternMatched, this);

        this.oFilterBarModel = filterBarModel.getFilterBarModel();
        this.oSuppliersModel = suppliersModel.getSuppliersModel();
        this.oEditModel = new JSONModel({
          isEditMode: false,
          isSuppliersChange: false,
          isStateBlocked: true,
          isCityBlocked: true
        });

        this.getView().setModel(this.oEditModel, constants.EDIT_MODEL_NAME);
        this.getView().setModel(this.oFilterBarModel, constants.FILTER_BAR_MODEL_NAME);
        this.getView().setModel(this.oSuppliersModel, constants.SUPPLIERS_MODEL_NAME);
      },

      onPatternMatched(oEvent) {
        this.oAppModel = productModel.getModel();
        const oRouteArguments = oEvent.getParameter("arguments");
        const sProductId = oRouteArguments.productId;
        const aProducts = this.oAppModel.getProperty(`/products`);
        
        aProducts.find((item, idx) => {
          if (item.id === sProductId) {
            this.iCurrentProductIndex = idx;
            this.getView().bindObject({
              path: `/products/${idx}`,
              model: constants.APP_MODEL_NAME
            });
            this.filterSuppliers();
          }
        });
      },

      filterSuppliers() {
        const oSuppliersTable = this.byId("suppliersTable").getBinding("items");
        const aSuppliers = this.getView().getBindingContext(constants.APP_MODEL_NAME).getObject("suppliers");

        const aFilters = aSuppliers.map((supplier) => {
          return new Filter("id", FilterOperator.EQ, supplier.id);
        });

        aFilters.push(new Filter("isDraft", FilterOperator.EQ, true));

        const oFilter = new Filter({
          aFilters,
          and: false
        });
      
        oSuppliersTable.filter(oFilter);
      },

      onAddSupplier() {
        suppliersModel.addDraftSupplier();
        const oNewSupplier = suppliersModel.getDraftSupplier();

        locationAPI.fetchCountries(result => {
          suppliersModel.setSupplierCountries(JSON.parse(result));
        })

        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        productModel.addDraftSupplier(sContextPath, oNewSupplier);
      },

      onProductEdit() {
        const oCurrentProduct = this.getView().getBindingContext(constants.APP_MODEL_NAME).getObject();
        this.oCurrentProductDuplicate = structuredClone(oCurrentProduct);

        this.oEditModel.setProperty("/isEditMode", true);
        this.oAppModel.refresh(true);
      },

      onProductCancel() {
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        productModel.resetProductChange(sContextPath, this.oCurrentProductDuplicate);
        this._resetDataFromEditMode();
      },


      onProductSave() {
        const aInvalidControls = this._validateSuppliers();
        
        if(!aInvalidControls.length) {
          this.handleNewSupplier();
          this._resetDataFromEditMode();
          this.filterSuppliers();
          this.oAppModel.refresh(true);
        }
      },

      handleNewSupplier() {
        const aNewSuppliers = suppliersModel.getNewSuppliers();

        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        productModel.addNewSuppliers(sContextPath, aNewSuppliers);
      },

      onProductCategoriesEdit(oEvent) {
        this._validateCategoriesField(oEvent);
        
        const oCategoryField = oEvent.getSource();
        const bSelectedCategory = oEvent.getParameter("selected");
        const sProductCategoryKey = oEvent.getParameter("changedItem").getProperty("key");
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();

        if (bSelectedCategory) {
          const oCategory = filterBarModel.getCategoryById(sProductCategoryKey);
          const sPath = oCategoryField.getBinding("selectedKeys").getContext().getPath();
          const sTarget = `${sPath}/${oCategoryField.getBindingPath("selectedKeys")}`;

          productModel.addProductCategory(sContextPath, oCategory);
          this._removeMessageFromInput(sTarget);
        } else {
          productModel.removeProductCategory(sContextPath, sProductCategoryKey);
        }
      },
      
      onProductDelete(oDeleteBtn) {
        const sCurrentProductId = oDeleteBtn.getBindingContext(constants.APP_MODEL_NAME).getObject("id");

        productModel.removeProducts([sCurrentProductId]);
        this.getRouter().navTo(constants.ROUTES.PRODUCTS_LIST);
      },

      onDeleteSupplierPress(oEvent) {
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        const supplierItem = oEvent.getParameter("listItem");
        const sSupplierId = supplierItem.getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("id");

        suppliersModel.removeSupplierById(sSupplierId);
        productModel.removeSupplierById(sContextPath, sSupplierId);
      },

      handleCountrySelection(oEvent) {
        const oCountriesField = oEvent.getSource();
        const sSupplierPath = this._getControlParentPath(oCountriesField);

        this._resetSupplierSuggestionValue("statesSuggestion", sSupplierPath);
        this._resetSupplierSuggestionValue("citiesSuggestion", sSupplierPath);
        suppliersModel.resetSupplierProperty(sSupplierPath, "country");
        suppliersModel.resetSupplierProperty(sSupplierPath, "state");
        suppliersModel.resetSupplierProperty(sSupplierPath, "city");
        suppliersModel.resetSupplierProperty(sSupplierPath, "States");
        suppliersModel.resetSupplierProperty(sSupplierPath, "Cities");
        
        if(oCountriesField.getSelectedItemId()) {
          const oSelectedItem = oEvent.getParameter("selectedItem");
          const sCountryName = oSelectedItem.getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("name");
          const sCountryISO = oSelectedItem.getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("iso2");

          suppliersModel.setSupplierProperty(sSupplierPath, "country", sCountryName);
          suppliersModel.setSupplierProperty(sSupplierPath, "countryIso", sCountryISO);
          this._handleFetchSupplierLocation(sCountryISO, oCountriesField);
        }
      },

      async handleStateSelection(oEvent) {
        const oStatesField = oEvent.getSource();
        const sItemId = oStatesField.getSelectedItemId();
        const sSupplierPath = this._getControlParentPath(oStatesField);
        suppliersModel.resetSupplierProperty(sSupplierPath, "state");
        suppliersModel.resetSupplierProperty(sSupplierPath, "city");
        suppliersModel.resetSupplierProperty(sSupplierPath, "Cities");
        this._resetSupplierSuggestionValue("citiesSuggestion", sSupplierPath);

        if(sItemId) {
          const sCountryISO = oEvent.getSource().getParent().getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("countryIso");
          const sStateName = oEvent.getParameter("selectedItem").getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("name");
          const sStateISO = oEvent.getParameter("selectedItem").getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("iso2");
          const oCurrSupplier = this.oSuppliersModel.getProperty(sSupplierPath);

          suppliersModel.setSupplierProperty(sSupplierPath, "state", sStateName);
          await locationAPI.fetchCities(sCountryISO, sStateISO, result => {
            this._handleCitiesData(JSON.parse(result), oCurrSupplier, sSupplierPath);
          });
        }
      },

      handleCitySelection(oEvent) {
        const oCityField = oEvent.getSource();
        const sItemId = oCityField.getSelectedItemId();
        const sSupplierPath = this._getControlParentPath(oCityField);

        suppliersModel.resetSupplierProperty(sSupplierPath, "city");

        if(sItemId) {
          const sCityName = oEvent.getParameter("selectedItem").getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject("name");
          suppliersModel.setSupplierProperty(sSupplierPath, "city", sCityName);
        }
      },

      onMessagePopoverPress(oPopoverBtn) {
        if (!this.oMessagePopover) {
          this._createMessagePopover();
        }

        this.oMessagePopover.toggle(oPopoverBtn);
      },

      _getControlParentPath(oControl) {
        return oControl.getParent().getBindingContext(constants.SUPPLIERS_MODEL_NAME).getPath();
      },

      _handleCitiesData(aParsedResult, oCurrSupplier, sSupplierPath) {
        if(aParsedResult.length) {
          oCurrSupplier.Cities = aParsedResult;
          this.oSuppliersModel.setProperty(sSupplierPath, oCurrSupplier);
        }
      },

      _resetDataFromEditMode() {
        suppliersModel.resetSuppliers();
        this.oCurrentProductDuplicate = null;
        this._MessageManager.removeAllMessages();
        this.oEditModel.setProperty("/isEditMode", false);
        this.oEditModel.setProperty("/isSuppliersChange", false);
      },

      async _handleFetchSupplierLocation(sCountryISO, oCountriesField) {
        const sSupplierPath = this._getControlParentPath(oCountriesField);
        const oCurrSupplier = this.oSuppliersModel.getProperty(sSupplierPath);
        suppliersModel.resetSupplierProperty(sSupplierPath, "States");
        suppliersModel.resetSupplierProperty(sSupplierPath, "Cities");

        await locationAPI.fetchStates(sCountryISO, result => {
          let aParsedResult = JSON.parse(result);

          if(aParsedResult.length) {
            suppliersModel.resetSupplierProperty(sSupplierPath, "Cities");
            suppliersModel.setSupplierProperty(sSupplierPath, "States", aParsedResult);
          } else {
            locationAPI.fetchCitiesByCountry(sCountryISO, result => {
              aParsedResult = JSON.parse(result);
              suppliersModel.resetSupplierProperty(sSupplierPath, "States");
              this._handleCitiesData(aParsedResult, oCurrSupplier, sSupplierPath);
            });
          }
        });
      },

      _resetSupplierSuggestionValue(groupId, sSupplierPath) {
        const oControl = this.getView().getControlsByFieldGroupId(groupId).find((oControl) => {
          const oControlPath = this._getControlParentPath(oControl);

          if(oControl.getMetadata().getName().includes("sap.m.ComboBox") && oControl.getVisible() && oControlPath.includes(sSupplierPath)) {
            return oControl;
          }
        });

        oControl.setValue("");
      },

      _validateSuppliers() {
        const aSuppliersFields = this.getView().getControlsByFieldGroupId("validateInput").filter((oControl) => {
          if(oControl.isA("sap.m.Input") && oControl.getRequired() && oControl.getVisible()) {
            return oControl;
          }
        });

        const aInvalidControls = aSuppliersFields.map((item) => this._validateInputControl(item)).filter((oControl) => oControl);

        aInvalidControls.forEach((item) => {
          const sPath = item.getBinding("value").getContext().getPath();
          const sTarget = `${sPath}/${item.getBindingPath("value")}`;

          this._addRequiredMessage(sTarget)
        });

        return aInvalidControls;
      },

      _validateInputControl(control) {
        try {
          const oControlBinding = control.getBinding("value");
          const oExternalValue = control.getProperty("value");
          const oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
          const sPath = control.getBinding("value").getContext().getPath();
          const sTarget = `${sPath}/${control.getBindingPath("value")}`;

          oControlBinding.getType().validateValue(oInternalValue);
          control.setValueState("None");
          this._removeMessageFromInput(sTarget);

          return null;
        } catch (error) {
          control.setValueState("Error");
          control.setValueStateText(error.message);

          return control;
        }
      },

      _initMessageManager() {
        this._MessageManager = Messaging;

        this._MessageManager.removeAllMessages();
        this._MessageManager.registerObject(this.byId("ProductPage"), true);
        this.getView().setModel(this._MessageManager.getMessageModel(),"message");
      },

      _createMessagePopover() {
        this.oMessagePopover = new MessagePopover({
          items: {
            path:"message>/",
            template: new MessageItem(
              {
                title: "{message>message}",
                subtitle: "{message>additionalText}",
                type: "{message>type}",
                description: "{message>message}"
              })
          },
        });
  
        this.byId("messagePopoverBtn").addDependent(this.oMessagePopover);
      },

      _validateCategoriesField(oEvent) {
        const oCategoriesField = oEvent.getSource();

        if(!oCategoriesField.getSelectedItems().length) {
          oCategoriesField.setValueState("Error");
          const sPath = oCategoriesField.getBinding("selectedKeys").getContext().getPath();
          const sTarget = `${sPath}/${oCategoriesField.getBindingPath("selectedKeys")}`;
          this._addRequiredMessage(sTarget);
        }
      },

      _addRequiredMessage(sTarget) {
        Messaging.addMessages(
          new Message({
            message: this.oResourceBundle.getText("EmptyInputErrorText"),
            type: library.ValueState.Error,
            target: sTarget,
            processor: this.getView().getModel(constants.APP_MODEL_NAME)
          })
        );
      },

      _getValidationFieldPath(oInput) {
        const sBindingPath = (oInput.isA("sap.m.Input")) ? "value" : "selectedKeys";
        const sPath = oInput.getBinding(sBindingPath).getContext().getPath();

        return `${sPath}/${oInput.getBindingPath(sBindingPath)}`;
      },

      _removeMessageFromInput (sTarget) {
        this._MessageManager.getMessageModel().getData().forEach((oMessage) => {
          if (oMessage.target === sTarget) {
            this._MessageManager.removeMessages(oMessage);
          }
        });
      },
    });
  }
);
