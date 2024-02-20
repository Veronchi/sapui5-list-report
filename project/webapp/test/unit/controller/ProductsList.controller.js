/*global QUnit*/

sap.ui.define([
	"veronchileverx/project/controller/ProductsList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProductsList Controller");

	QUnit.test("I should test the ProductsList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
