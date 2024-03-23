sap.ui.define(
  ["sap/ui/test/Opa5", "./arrangements/Startup", "./NavigationJourney", "./ProductListJourney", "./ProductPageJourney"],
  function (Opa5, Startup) {
    "use strict";

    Opa5.extendConfig({
      arrangements: new Startup(),
      viewNamespace: "veronchi.leverx.project.view.",
      autoWait: true,
    });
  }
);
