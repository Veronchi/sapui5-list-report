sap.ui.define(["sap/ui/test/opaQunit", "./pages/ProductsList"], function (opaTest) {
  "use strict";

  QUnit.module("ProductList Journey");

  opaTest("Should be able to delete product", function (Given, When, Then) {
    Given.iStartMyApp();

    Then.onTheProductsList.theTableShouldHaveProducts(10);
    Then.onTheProductsList.theDeleteButtonShouldBeEnabled(false);

    When.onTheProductsList.iSelectListItem();
    Then.onTheProductsList.theDeleteButtonShouldBeEnabled(true);

    When.onTheProductsList.iClickOnDeleteButton();

    When.onTheProductsList.iClickOnConfirmDeleteButton();
    Then.onTheProductsList.theTableShouldHaveProducts(9);

    Then.iTeardownMyApp();
  });
});
