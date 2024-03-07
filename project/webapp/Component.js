sap.ui.define(
  ["sap/ui/core/UIComponent", "veronchi/leverx/project/model/productModel", "veronchi/leverx/project/utils/Constants"],
  function (UIComponent, productModel, Constants) {
    "use strict";

    return UIComponent.extend("veronchi.leverx.project.Component", {
      metadata: {
        manifest: "json"
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        productModel.initModel();
        this.setModel(productModel.getModel(), Constants.APP_MODEL_NAME);

        this.getRouter().initialize();
      }
    });
  }
);
