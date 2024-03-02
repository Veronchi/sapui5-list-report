sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "ProductsList";
	
	Opa5.createPageObjects({
		onTheViewPage: {

			actions: {
        iPressOnProductSelect() {
          return this.waitFor({
            controlType: "sap.m.ColumnListItem",
            viewName: sViewName,
            actions: new Press(),
            errorMessage: "The table does not have a trigger."
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
        theProductsShouldBeSelected() {
          return this.waitFor({
              controlType: "sap.m.ColumnListItem",
              viewName: sViewName,
              success: function () {
                Opa5.assert.ok(true, "");
              },
              errorMessage: ""
            });
        }
			}
		}
	});

});
