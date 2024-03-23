sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/BindingPath",
    "sap/m/MessageBox",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Ancestor"
  ],
  function (Opa5, Press, Properties, EnterText, Ancestor) {
    "use strict";
    const sViewName = "ProductPage";

    Opa5.createPageObjects({
      onTheProductPage: {
        actions: {
          iPressOnEditButton() {
            return this.waitFor({
              id: "productEditBtn",
              viewName: sViewName,
              actions: new Press(),
              success() {
                Opa5.assert.ok(true, "The Edit button is pressed");
              },
              errorMessage: "Can't press Edit button"
            });
          },
          iChangeProductName(sValue) {
            return this.waitFor({
              id: "productNameEdit",
              viewName: sViewName,
              actions: (control) => {
                control.setValue(sValue);
              },
              errorMessage: "productNameEdit was not found."
            });
          },
          iPressOnSaveButton() {
            return this.waitFor({
              id: "productSaveBtn",
              viewName: sViewName,
              actions: new Press(),
              success() {
                Opa5.assert.ok(true, "The Save button is pressed");
              },
              errorMessage: "Can't press Save button"
            });
          },
        },

        assertions: {
          iShouldSeeTheProductPageView() {
            return this.waitFor({
              id: "ProductPage",
              viewName: sViewName,
              success() {
                Opa5.assert.ok(true, `The ${sViewName} view is displayed`);
              },
              errorMessage: `Did not find the ${sViewName} view`
            });
          },
          theEditButtonShouldHaveEnablement(bValue) {
            return this.waitFor({
              autoWait: true,
              enabled: bValue,
              id: "productEditBtn",
              viewName: sViewName,
              success() {
                Opa5.assert.ok(true, `The Edit button is enabled: ${bValue}`);
              },
              errorMessage: "The Edit button isn't available"
            });
          },
          iShouldSeeProductWithNewName(sName) {
            return this.waitFor({
							success: function () {
								return this.waitFor({
									id: "productNameTitle",
									viewName: sViewName,
									matchers: new Properties({
										text: sName
									}),
									success: function () {
										Opa5.assert.ok(true, "Product name was changed");
									},
									errorMessage: "The Product has new name: " + sName + ""
								});
							}
						});
          }
        }
      }
    });
  }
);
