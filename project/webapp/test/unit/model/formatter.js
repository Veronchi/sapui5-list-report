sap.ui.define(["veronchi/leverx/project/model/formatter", "sap/ui/model/resource/ResourceModel"], function (formatter, ResourceModel) {
  "use strict";

  function getResourceBundle() {
    return new ResourceModel({
      bundleUrl: sap.ui.require.toUrl("veronchi/leverx/projecti18n/i18n.properties")
    }).getResourceBundle();
  }

  QUnit.module("Formatting functions", {
    beforeEach() {
      this.oRresourceBundle = getResourceBundle();
      formatter.initResourceBundle(this.oRresourceBundle);
    }
  });

  QUnit.test("Should return text with the name of the product that will be deleted", function (assert) {
    const aOneProduct = ["MacBook Air"];
    const sResultForOneProduct = formatter.formatConfirmMessageText(aOneProduct);

    assert.strictEqual(
      sResultForOneProduct,
      this.oRresourceBundle.getText("ConfirmDeleteProductText", [aOneProduct[0]]),
      sResultForOneProduct
    );
  });

  QUnit.test("Should return text with the number of products to be deleted", function (assert) {
    const aMultipleProducts = ["MacBook Air", "MacBook Pro 14"];
    const sResultForMultipleProducts = formatter.formatConfirmMessageText(aMultipleProducts);

    assert.strictEqual(
      sResultForMultipleProducts,
      this.oRresourceBundle.getText("ConfirmDeleteProductsText", [aMultipleProducts.length]),
      sResultForMultipleProducts
    );
  });
});
