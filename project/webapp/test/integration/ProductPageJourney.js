sap.ui.define(["sap/ui/test/opaQunit", "./pages/ProductPage"], function (opaTest) {
  "use strict";

  QUnit.module("ProductPage Journey");

  opaTest("Should be possible to press on Edit button", function (Given, When, Then) {
    When.onTheProductPage.iPressOnEditButton();
    Then.onTheProductPage.theEditButtonShouldHaveEnablement(false);
  });

  opaTest("Should be possible to edit a product details", function (Given, When, Then) {

    When.onTheProductPage.iChangeProductName("MacBook Air").
      and.iPressOnSaveButton();
    
    Then.onTheProductPage.iShouldSeeProductWithNewName("MacBook Air");

    Then.iTeardownMyApp();
  });
});
