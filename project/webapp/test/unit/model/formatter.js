sap.ui.define(["veronchi/leverx/project/model/formatter", "sap/ui/model/resource/ResourceModel"], function (formatter, ResourceModel) {
  "use strict";

  function getResourceBundle() {
    return new ResourceModel({
      bundleUrl: sap.ui.require.toUrl("veronchi/leverx/project/i18n/i18n.properties")
    }).getResourceBundle();
  }

  QUnit.module("Formatting functions", {
    before() {
      this.oResourceBundle = getResourceBundle();
      formatter.oResourceBundle = this.oResourceBundle;
    }
  });

  QUnit.test("Should return text with the name of the product that will be deleted", function (assert) {
    const aOneProduct = ["MacBook Air"];
    const aMultipleProducts = ["MacBook Air", "MacBook Pro 14"];
    
    assert.strictEqual(
      formatter.formatConfirmMessageText(aOneProduct),
      this.oResourceBundle.getText("ConfirmDeleteProductText", [aOneProduct[0]]),
      "Formatter works correct"
    );

    assert.strictEqual(
      formatter.formatConfirmMessageText(aMultipleProducts),
      this.oResourceBundle.getText("ConfirmDeleteProductsText", [aMultipleProducts.length]),
      "Formatter works correct"
    );

    assert.strictEqual(
      formatter.formatConfirmMessageText(),
      "",
      "Formatter works correct"
    );

    assert.strictEqual(
      formatter.formatConfirmMessageText([]),
      "",
      "Formatter works correct"
    );

    assert.strictEqual(
      formatter.formatConfirmMessageText(""),
      "",
      "Formatter works correct"
    );
  });

  QUnit.test("Should return a boolean value when checks release date and current date", function (assert) {
    const sNewReleaseDate = "2024-03-21T00:00:00";
    const sReleaseDate = "2024-03-03T00:00:00";
    
    assert.ok(
      formatter.checkIfNewProduct(sNewReleaseDate),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.checkIfNewProduct(sReleaseDate),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.checkIfNewProduct(),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.checkIfNewProduct(""),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.checkIfNewProduct([]),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.checkIfNewProduct({}),
      "Formatter works correct"
    );
  });

  QUnit.test("Should return text with the number of days since the product was released", function (assert) {
    const sReleaseDate = "2024-03-03T00:00:00";
    
    assert.strictEqual(
      formatter.getDaysFromReleaseDate(sReleaseDate),
      this.oResourceBundle.getText("DaysText", [20]),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.getDaysFromReleaseDate(),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.getDaysFromReleaseDate([]),
      "Formatter works correct"
    );

    assert.notOk(
      formatter.getDaysFromReleaseDate(""),
      "Formatter works correct"
    );
  });
});
