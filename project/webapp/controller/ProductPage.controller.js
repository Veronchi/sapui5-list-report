sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "veronchi/leverx/project/utils/Constants",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/formatter",
    "sap/ui/model/json/JSONModel",
    "veronchi/leverx/project/model/filterBarModel"
  ],

  function (Controller, Constants, productModel, formatter, JSONModel, filterBarModel) {
    "use strict";

    return Controller.extend("veronchi.leverx.project.controller.ProductPage", {
      
      

      formatter: formatter,

      onInit() {
        this.oComponent = this.getOwnerComponent();
        this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();
        const oRouter = this.oComponent.getRouter();

        filterBarModel.initFilterBarModel();
        oRouter.getRoute(Constants.ROUTES.PRODUCTS_PAGE).attachPatternMatched(this.onPatternMatched, this);

        this.oFilterBarModel = filterBarModel.getFilterBarModel();
        this.oEditModel = new JSONModel({
          isEditMode: false
        });

        this.getView().setModel(this.oEditModel, Constants.EDIT_MODEL_NAME);
        this.getView().setModel(this.oFilterBarModel, Constants.FILTER_BAR_MODEL_NAME);
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
              model: Constants.APP_MODEL_NAME
            });
          }
        });
      },

      onProductEdit() {
        const oCurrentProduct = this.getView().getModel(Constants.APP_MODEL_NAME).getProperty(`/products/${this.iCurrentProductIndex}`);

        this.oCurrentProductDuplicate = structuredClone(oCurrentProduct);
        this.oEditModel.setProperty("/isEditMode", true);
      },

      onProductCancel() {
        productModel.resetProductChange(this.iCurrentProductIndex, this.oCurrentProductDuplicate);

        this.oCurrentProductDuplicate = null;
        this.oEditModel.setProperty("/isEditMode", false);
      },

      onProductSave() {
        this.oEditModel.setProperty("/isEditMode", false);
      },

      onProductCategoriesEdit(oEvent) {
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
        const oCurrentProductId = oEvent.getSource().getBindingContext(Constants.APP_MODEL_NAME).getObject('id');
        
        this.oComponent.getRouter().navTo(Constants.ROUTES.PRODUCTS_LIST);
        productModel.removeProducts([oCurrentProductId]);
      }
    });
  }
);
