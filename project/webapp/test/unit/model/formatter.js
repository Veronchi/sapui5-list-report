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
      formatter.formatConfirmMessageText(''),
      "",
      "Formatter works correct"
    );
  });
});
