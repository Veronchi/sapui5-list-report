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
    "sap/ui/core/library"
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
    library
  ) {
    "use strict";

    return BaseController.extend("veronchi.leverx.project.controller.ProductPage", {
      formatter: formatter,

      onInit() {
        this.oResourceBundle = this.getResourceBundle();
        const oRouter = this.getRouter();
        
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
        const oCurrentProduct = this.getView().getBindingContext(constants.APP_MODEL_NAME).getObject();
        this.oCurrentProductDuplicate = structuredClone(oCurrentProduct);

        this.oEditModel.setProperty("/isEditMode", true);
        this.oAppModel.refresh(true);
      },

      onProductCancel() {
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();
        productModel.resetProductChange(sContextPath, this.oCurrentProductDuplicate);

        this.oCurrentProductDuplicate = null;
        this._MessageManager.removeAllMessages();
        this.oEditModel.setProperty("/isEditMode", false);
      },

      onProductSave() {
        this.oEditModel.setProperty("/isEditMode", false);
        this._MessageManager.removeAllMessages();
        this.oAppModel.refresh(true);
      },

      onProductCategoriesEdit(oEvent) {
        this._validateCategoriesField(oEvent);
        
        const oCategoryField = oEvent.getSource();
        const bSelectedCategory = oEvent.getParameter("selected");
        const sProductCategoryKey = oEvent.getParameter("changedItem").getProperty("key");
        const sContextPath = this.getView().getBindingContext(constants.APP_MODEL_NAME).getPath();

        if (bSelectedCategory) {
          const oCategory = filterBarModel.getCategoryById(sProductCategoryKey);

          productModel.addProductCategory(sContextPath, oCategory);
          this._removeMessageFromInput(this._getValidationFieldPath(oCategoryField));
        } else {
          productModel.removeProductCategory(sContextPath, sProductCategoryKey);
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

      _validateCategoriesField(oEvent) {
        const oCategoriesField = oEvent.getSource();

        if(!oCategoriesField.getSelectedItems().length) {
          oCategoriesField.setValueState("Error");
          this._addRequiredMessage(oCategoriesField);
        }
      },

      _addRequiredMessage(oInvalidControl) {
        const sTarget = this._getValidationFieldPath(oInvalidControl); 

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
        const sPath = oInput.getBindingContext(constants.APP_MODEL_NAME).getPath();

        return `${sPath}/${oInput.getBindingPath("selectedKeys")}`;
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
