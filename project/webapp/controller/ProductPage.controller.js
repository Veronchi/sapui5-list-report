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
      EDIT_MODEL_NAME: "editMdel",
      FILTER_BAR_MODEL_NAME: "filterBarModel",

      formatter: formatter,

      onInit() {
        this.oComponent = this.getOwnerComponent();
        this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();
        const oRouter = this.oComponent.getRouter();

        filterBarModel.initFilterBarModel();
        formatter.initResourceBundle(this.oResourceBundle);
        oRouter.getRoute(Constants.ROUTES.PRODUCTS_PAGE).attachPatternMatched(this.onPatternMatched, this);

        this.oFilterBarModel = filterBarModel.getFilterBarModel();
        this.oEditModel = new JSONModel({
          isEditMode: true
        });

        this.getView().setModel(this.oEditModel, this.EDIT_MODEL_NAME);
        this.getView().setModel(this.oFilterBarModel, this.FILTER_BAR_MODEL_NAME);
      },

      onPatternMatched(oEvent) {
        this.oAppModel = productModel.getModel();
        const oRouteArguments = oEvent.getParameter("arguments");
        const sProductId = oRouteArguments.productId;

        const aProducts = this.oAppModel.getProperty(`/products`);
        aProducts.find((item, idx) => {
          if (item.id === sProductId) {
            this.getView().bindObject({
              path: `/products/${idx}`,
              model: Constants.APP_MODEL_NAME
            });
          }
        });
      }
    });
  }
);
