sap.ui.define(["sap/ui/test/opaQunit", "./pages/ProductsList"], function (opaTest) {
  "use strict";

  QUnit.module("ProductList Journey");

  opaTest("Should see the table with 10 products and disabled deletion button", function (Given, When, Then) {
    Given.iStartMyApp();

    Then.onTheProductsList.theTableShouldHaveProducts(10);
    Then.onTheProductsList.theDeleteButtonShouldHaveEnablement(false);
  });

  opaTest("Should be possible to select a product, after which the delete button will be enabled.", function (Given, When, Then) {
    When.onTheProductsList.iSelectListItem();
    Then.onTheProductsList.theDeleteButtonShouldHaveEnablement(true);
  });

  opaTest("Should press the 'Delete' button after which 'confirmation' dialog is open", function (Given, When, Then) {
    When.onTheProductsList.iPressOnDeleteButton();
    Then.onTheProductsList.iShouldSeeConfirmationDialog();
  });

  opaTest("Should confirm product deletion and see table with 9 products", function (Given, When, Then) {
    When.onTheProductsList.iClickOnConfirmDeleteButton();
    Then.onTheProductsList.theTableShouldHaveProducts(9);

    Then.iTeardownMyApp();
  });
});
