sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "veronchi/leverx/project/utils/Constants",
    "veronchi/leverx/project/model/productModel",
    "veronchi/leverx/project/model/formatter"
  ],

  function (Controller, Constants, productModel, formatter) {
    "use strict";

    return Controller.extend("veronchi.leverx.project.controller.ProductPage", {
      formatter: formatter,

      onInit() {
        this.oComponent = this.getOwnerComponent();
        this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();
        const oRouter = this.oComponent.getRouter();

        formatter.initResourceBundle(this.oResourceBundle);
        oRouter.getRoute(Constants.ROUTES.PRODUCTS_PAGE).attachPatternMatched(this.onPatternMatched, this);
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
