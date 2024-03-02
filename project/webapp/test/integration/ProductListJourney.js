sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/ProductsList"
], function (opaTest) {
	"use strict";

	QUnit.module("ProductList");


  opaTest("Should be able to select products", function (Given, When, Then) {
		//Actions
		When.onTheProductsList.iPressOnProductSelect();

		// Assertions
		Then.onTheProductsList.theProductsShouldBeSelected();

		// Cleanup
		Then.iTeardownMyApp();
	});

});