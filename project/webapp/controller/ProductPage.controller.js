sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "veronchi/leverx/project/utils/constants",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/formatter",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/filterBarModel",
    "sap/ui/core/Messaging",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    "veronchi/leverx/project/utils/validator",
    "sap/ui/core/message/Message",
    "sap/ui/core/library"
  ],

  function (
    Controller,
    constants,
    productModel,
    formatter,
    JSONModel,
    filterBarModel,
    Messaging,
    MessagePopover,
    MessageItem,
    validator,
    Message,
    library
  ) {
    "use strict";

    return Controller.extend("veronchi.leverx.project.controller.ProductPage", {
      formatter: formatter,

      onInit() {
        this.oComponent = this.getOwnerComponent();
        this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();
        const oRouter = this.oComponent.getRouter();
        
        this._initMessageManager();
        filterBarModel.initFilterBarModel();
        oRouter.getRoute(constants.ROUTES.PRODUCTS_PAGE).attachPatternMatched(this.onPatternMatched, this);

        this.oFilterBarModel = filterBarModel.getFilterBarModel();
        this.oEditModel = new JSONModel({
          isEditMode: false
        });

        this.getView().setModel(this.oEditModel, constants.EDIT_MODEL_NAME);
        this.getView().setModel(this.oFilterBarModel, constants.FILTER_BAR_MODEL_NAME);
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

      onProductEdit() {
        const oCurrentProduct = this.getView().getModel(constants.APP_MODEL_NAME).getProperty(`/products/${this.iCurrentProductIndex}`);

        this.oCurrentProductDuplicate = structuredClone(oCurrentProduct);
        this.oEditModel.setProperty("/isEditMode", true);
      },

      onProductCancel() {
        productModel.resetProductChange(this.iCurrentProductIndex, this.oCurrentProductDuplicate);

        this.oCurrentProductDuplicate = null;
        this._MessageManager.removeAllMessages();
        this.oEditModel.setProperty("/isEditMode", false);
        productModel.getModel().refresh(true);
      },

      onProductSave() {
        this.oEditModel.setProperty("/isEditMode", false);
        this._MessageManager.removeAllMessages();
      },

      validateMandatoryField(oEvent) {
        const oProductDetailsForm = this.byId("productDetailsEdit");
        const aInvalidControls = validator.validateForm(oProductDetailsForm);

        this._removeMessageFromTarget(this._getValidationTarget(oEvent.getSource()));

        if(aInvalidControls.length) {
          this._addRequiredMessage(aInvalidControls);
        }
      },

      onProductCategoriesEdit(oEvent) {
        this.validateMandatoryField(oEvent);
        const bSelectedCategory = oEvent.getParameter("selected");
        const sProductCategoryKey = oEvent.getParameter("changedItem").getProperty("key");

        if (bSelectedCategory) {
          const oCategory = filterBarModel.getCategoryById(sProductCategoryKey);

          productModel.addProductCategory(this.iCurrentProductIndex, oCategory);
        } else {
          productModel.removeProductCategory(this.iCurrentProductIndex, sProductCategoryKey);
        }
      },
      
      onProductDelete(oEvent) {
        const oCurrentProductId = oEvent.getSource().getBindingContext(constants.APP_MODEL_NAME).getObject('id');

        this.oComponent.getRouter().navTo(constants.ROUTES.PRODUCTS_LIST);
        productModel.removeProducts([oCurrentProductId]);
      },

      onMessagePopoverPress(oEvent) {
        if (!this.oMessagePopover) {
          this._createMessagePopover();
        }

        this.oMessagePopover.toggle(oEvent.getSource());
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

      _addRequiredMessage(aInvalidControls) {
        const aTargets = aInvalidControls.map((oInput) => {
          const sPath = oInput.getBindingContext(constants.APP_MODEL_NAME).getPath();

          return oInput.getMetadata().getName().includes("sap.m.MultiComboBox")
            ? `${sPath}/${oInput.getBindingPath("selectedKeys")}`
            : `${sPath}/${oInput.getBindingPath("value")}`; 
        });

        aTargets.forEach((target) => {
          Messaging.addMessages(
            new Message({
              message: this.oResourceBundle.getText("EmptyInputErrorText"),
              type: library.ValueState.Error,
              target: target,
              processor: this.getView().getModel(constants.APP_MODEL_NAME)
            })
          );
        });
      },

      _getValidationTarget(oInput) {
        const sPath = oInput.getBindingContext(constants.APP_MODEL_NAME).getPath();

        return oInput.getMetadata().getName().includes("sap.m.MultiComboBox")
          ? `${sPath}/${oInput.getBindingPath("selectedKeys")}`
          : `${sPath}/${oInput.getBindingPath("value")}`; 
      },

      _removeMessageFromTarget (sTarget) {
        this._MessageManager.getMessageModel().getData().forEach((oMessage) => {
          if (oMessage.target === sTarget) {
            this._MessageManager.removeMessages(oMessage);
          }
        });
      },
    });
  }
);
