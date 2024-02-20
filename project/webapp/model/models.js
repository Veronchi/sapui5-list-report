sap.ui.define([
    "sap/ui/model/json/JSONModel",
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * 
     * @returns {Function} createModel() for providing runtime products mock data
     */
    function (JSONModel) {
        "use strict";

        return {
            createModel: function () {
                const oModel = new JSONModel();
                return oModel;
        }
    };
});