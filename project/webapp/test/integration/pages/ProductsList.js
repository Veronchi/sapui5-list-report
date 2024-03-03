sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/BindingPath"
  ],
  function (Opa5, Press, Properties, AggregationLengthEquals, BindingPath) {
    "use strict";
    var sViewName = "ProductsList";

    Opa5.createPageObjects({
      onTheProductsList: {
        actions: {
          iSelectListItem() {
            return this.waitFor({
              controlType: "sap.m.CheckBox",
              viewName: sViewName,
              actions: new Press(),
              matchers: new BindingPath({
                path: "/products/0",
                modelName: "appModel"
              }),
              success() {
                Opa5.assert.ok(true, "The first product is selected");
              },
              errorMessage: "The table does not have a trigger"
            });
          },
          iClickOnDeleteButton() {
            return this.waitFor({
              id: "deleteProductsBtn",
              viewName: sViewName,
              actions: new Press(),
              success() {
                Opa5.assert.ok(true, "The Delete button is pressed");
              },
              errorMessage: "Can't press delete button"
            });
          },
          iClickOnConfirmDeleteButton() {
            return this.waitFor({
              viewName: sViewName,
              searchOpenDialogs: true,
              controlType: "sap.m.Button",
              matchers: new Properties({
                text: "OK"
              }),
              actions: new Press(),
              success() {
                Opa5.assert.ok(true, "The confirm delete button is pressed");
              },
              errorMessage: "Can't press delete confirm button"
            });
          }
        },

        assertions: {
          iShouldSeeThePageView() {
            return this.waitFor({
              id: "productsListPage",
              viewName: sViewName,
              success() {
                Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
              },
              errorMessage: "Did not find the " + sViewName + " view"
            });
          },
          theTableShouldHaveProducts(nAmountItems) {
            return this.waitFor({
              id: "productList",
              viewName: sViewName,
              matchers: new AggregationLengthEquals({
                name: "items",
                length: nAmountItems
              }),
              success: function () {
                Opa5.assert.ok(true, `The table has ${nAmountItems} items on the productList page`);
              },
              errorMessage: "The table does not contain all items"
            });
          },
          theDeleteButtonShouldBeEnabled(bValue) {
            return this.waitFor({
              autoWait: true,
              enabled: bValue,
              id: "deleteProductsBtn",
              viewName: sViewName,
              success() {
                Opa5.assert.ok(true, "The Delete button is enabled: " + bValue);
              },
              errorMessage: "The Delete button isn't available"
            });
          }
        }
      }
    });
  }
);
