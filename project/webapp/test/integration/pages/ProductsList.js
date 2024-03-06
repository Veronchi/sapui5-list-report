sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/BindingPath",
    "sap/m/MessageBox",
  ],
  function (Opa5, Press, Properties, AggregationLengthEquals, BindingPath, MessageBox) {
    "use strict";
    const sViewName = "ProductsList";

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
          iPressOnDeleteButton() {
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
                text: MessageBox.Action.OK
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
                Opa5.assert.ok(true, `The ${sViewName} view is displayed`);
              },
              errorMessage: `Did not find the ${sViewName} view`
            });
          },
          theTableShouldHaveProducts(iAmountItems) {
            return this.waitFor({
              id: "productList",
              viewName: sViewName,
              matchers: new AggregationLengthEquals({
                name: "items",
                length: iAmountItems
              }),
              success: function () {
                Opa5.assert.ok(true, `The table has ${iAmountItems} items on the productList page`);
              },
              errorMessage: "The table does not contain all items"
            });
          },
          theDeleteButtonShouldHaveEnablement(bValue) {
            return this.waitFor({
              autoWait: true,
              enabled: bValue,
              id: "deleteProductsBtn",
              viewName: sViewName,
              success() {
                Opa5.assert.ok(true, `The Delete button is enabled: ${bValue}`);
              },
              errorMessage: "The Delete button isn't available"
            });
          },
          iShouldSeeConfirmationDialog() {
            return this.waitFor({
              viewName: sViewName,
              controlType: "sap.m.Dialog",
              searchOpenDialogs: true,
              success() {
                Opa5.assert.ok(true, "The confirmation dialog is visible");
              },
              errorMessage: "The confirmation dialog is not visible"
            });
          }
        }
      }
    });
  }
);
