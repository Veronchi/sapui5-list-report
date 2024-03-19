sap.ui.define(
  [
    "veronchi/leverx/project/controller/BaseController",
    "veronchi/leverx/project/utils/constants",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/formatter",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/filterBarModel",
    "sap/ui/core/Messaging",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "veronchi/leverx/project/model/suppliersModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
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
    FilterOperator
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
          isSuppliersChange: false
        });
        this.oCountriesModel = new JSONModel({});

        this.getView().setModel(this.oEditModel, constants.EDIT_MODEL_NAME);
        this.getView().setModel(this.oFilterBarModel, constants.FILTER_BAR_MODEL_NAME);
        this.getView().setModel(this.oSuppliersModel, constants.SUPPLIERS_MODEL_NAME);
        this.getView().setModel(this.oCountriesModel, constants.COUNTRIES_MODEL_NAME)

        this.fetchCountries("", result => {
          this.oCountriesModel.setProperty("/Countries", JSON.parse(result));
        });
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
          }
        });
      },

      fetchCountries(endpoint, callback) {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", constants.API_KEY);

        const requestOptions = {
          method: 'GET',
          headers: headers,
          redirect: 'follow'
        };

        fetch(`https://api.countrystatecity.in/v1/countries${endpoint}`, requestOptions)
        .then(response => response.text())
        .then(callback)
        .catch(error => console.log('error', error));
      },

      filterSuppliers(oEvent) {
        const oSuppliersTable = oEvent.getSource().getBinding("items")
        const aSuppliers = this.getView().getBindingContext(constants.APP_MODEL_NAME).getObject("suppliers");
        const aFilters = aSuppliers.map((supplier) => {
          return new Filter("id", FilterOperator.EQ, supplier.id)
        });

        const oFilter = new Filter({
          aFilters,
          and: false
        });

        oSuppliersTable.filter(oFilter);
      },

      onAddSupplier() {
        suppliersModel.addCleanSupplier();
        this.oEditModel.setProperty("/isSuppliersChange", true);

        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        productModel.addCleanSupplier(sContextPath);
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
        suppliersModel.resetSuppliers();
        this.byId("commentsField").setValue("");

        this.oCurrentProductDuplicate = null;
        this._MessageManager.removeAllMessages();
        this.oEditModel.setProperty("/isEditMode", false);
        this.oEditModel.setProperty("/isSuppliersChange", false);
      },

      onProductSave() {
        const aInvalidControls = this._validateSuppliers();
        
        if(!aInvalidControls.length) {
          this.handleNewSupplier();
          this.oEditModel.setProperty("/isEditMode", false);
          this.oEditModel.setProperty("/isSuppliersChange", false);
          this._MessageManager.removeAllMessages();
          this.oAppModel.refresh(true);
        }
      },

      handleNewSupplier() {
        const oNewSupplier = suppliersModel.getNewSupplierId();

        if(oNewSupplier) {
          const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
          productModel.addNewSupplier(sContextPath, oNewSupplier);
        }
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
        const sCurrentProductId = oDeleteBtn.getBindingContext(constants.APP_MODEL_NAME).getObject('id');

        this.getRouter().navTo(constants.ROUTES.PRODUCTS_LIST);
        productModel.removeProducts([sCurrentProductId]);
      },

      onDeleteSupplierPress(oEvent) {
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        const supplierItem = oEvent.getParameter("listItem");
        const sSupplierId = supplierItem.getBindingContext(constants.SUPPLIERS_MODEL_NAME).getObject('id');

        suppliersModel.removeSupplierById(sSupplierId);
        productModel.removeSupplierById(sContextPath, sSupplierId);
      },

      handleCountrySelection(oEvent) {
        const oCountriesField = oEvent.getSource();

        if(oCountriesField.getSelectedItemId()) {
          const oSelectedItem = oEvent.getParameter("selectedItem");
          const sCountryName = oSelectedItem.getBindingContext("countriesModel").getObject("name");
          const sCountryISO = oSelectedItem.getBindingContext("countriesModel").getObject("iso2");
          
          suppliersModel.setSupplierCountry(sCountryName);
          this._handleFetchSupplierLocation(sCountryISO);
        } else {
          this.oCountriesModel.setProperty("/States", []);
          this._getSupplierSuggestionControl("statesSuggestion").clearSelection();
          this._getSupplierSuggestionControl("citiesSuggestion").clearSelection();
          suppliersModel.resetSupplierCountry();
          suppliersModel.resetSupplierState();
          suppliersModel.resetSupplierCity();
        }
      },

      handleStateSelection(oEvent) {
        const sItemId = oEvent.getSource().getSelectedItemId();
        if(sItemId) {
          const oSelectedItem = this._getSupplierSuggestionControl("countriesSuggestion").getSelectedItem();
          const sCountryISO = oSelectedItem.getBindingContext("countriesModel").getObject("iso2");
          const sStateName = oEvent.getParameter("selectedItem").getBindingContext("countriesModel").getObject("name");
          const sStateISO = oEvent.getParameter("selectedItem").getBindingContext("countriesModel").getObject("iso2");
          
          suppliersModel.setSupplierState(sStateName);
          this.fetchCountries(`/${sCountryISO}/states/${sStateISO}/cities`, result => {
            this.oCountriesModel.setProperty("/Cities", JSON.parse(result));
          })
        } else {
          this.oCountriesModel.setProperty("/Cities", []);
          this._getSupplierSuggestionControl("citiesSuggestion").clearSelection();
          suppliersModel.resetSupplierState();
          suppliersModel.resetSupplierCity();
        }
      },

      handleCitySelection(oEvent) {
        const sItemId = oEvent.getSource().getSelectedItemId();

        if(sItemId) {
          const sCityName = oEvent.getParameter("selectedItem").getBindingContext("countriesModel").getObject("name");
          suppliersModel.setSupplierCity(sCityName);
        } else {
          suppliersModel.resetSupplierCity();
        }
      },

      onMessagePopoverPress(oPopoverBtn) {
        if (!this.oMessagePopover) {
          this._createMessagePopover();
        }

        this.oMessagePopover.toggle(oPopoverBtn);
      },

      onCommentPost(sFeedValue) {
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        productModel.addProductComment(sContextPath, sFeedValue);
      },

      _handleFetchSupplierLocation(sCountryISO) {
        let aFetchedStates;

        this.fetchCountries(`/${sCountryISO}/states`, result => {
          aFetchedStates = result;
        })

        if(aFetchedStates) {
          this.oCountriesModel.setProperty("/States", JSON.parse(result));
        } else {
          this.fetchCountries(`/${sCountryISO}/cities`, result => {
            this.oCountriesModel.setProperty("/Cities", JSON.parse(result));
          })
        }
      },

      _getSupplierSuggestionControl(groupId) {
        return this.getView().getControlsByFieldGroupId(groupId).filter((oControl) => {
          if(oControl.getMetadata().getName().includes('sap.m.ComboBox') && oControl.getRequired() && oControl.getVisible()) {
            return oControl;
          }
        })[0];
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
