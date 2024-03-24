sap.ui.define(
  ["sap/ui/core/UIComponent", "veronchi/leverx/project/model/productModel", "veronchi/leverx/project/utils/constants"],
  function (UIComponent, productModel, constants) {
    "use strict";

    /**
     * The component controller provides the metadata and the component methods
     *
     * @extends sap.ui.core.UIComponent
     * @namespace veronchi.leverx.project.Component
     */

    return UIComponent.extend("veronchi.leverx.project.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * It calls the `init` method of the base class (`UIComponent`) using the `apply` function to ensure proper initialization.
       * After initializing the base class, it also initializes the component's router and Product Model.
       *
       * @function
       * @name init
       * @memberof veronchi.leverx.project.Component
       * @returns {void} - No return value.
       */

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        productModel.initModel();
        this.setModel(productModel.getModel(), constants.APP_MODEL_NAME);

        this.getRouter().initialize();
      }
    });
  }
);
