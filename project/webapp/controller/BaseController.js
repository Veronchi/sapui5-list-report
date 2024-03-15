sap.ui.define([
    "sap/ui/core/mvc/Controller",
  ], function(Controller) {
  
    "use strict";
    return Controller.extend("veronchi.leverx.project.controller.BaseController", {
      getRouter() {
        return this.getOwnerComponent().getRouter();
      },

      getResourceBundle() {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      }
    });
  });