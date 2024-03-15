sap.ui.define(
  ["sap/ui/model/SimpleType", "sap/ui/model/ValidateException", "sap/ui/model/resource/ResourceModel"],
  function (SimpleType, ValidateException, ResourceModel) {
    "use strict";

    const oResourceBundle = new ResourceModel({
      bundleUrl: sap.ui.require.toUrl("veronchi/leverx/project/i18n/i18n.properties")
    }).getResourceBundle();

    return SimpleType.extend("veronchi.leverx.project.controller.RequiredInputType", {
      parseValue(sValue) {
        return sValue;
      },

      validateValue(sValue) {
        if (this.oConstraints.minLength && sValue.length < this.oConstraints.minLength) {
          throw new ValidateException(oResourceBundle.getText("EmptyInputErrorText"), ["minLength"]);
        } else if(this.oConstraints.minimum && sValue < this.oConstraints.minimum) {
          throw new ValidateException(oResourceBundle.getText("NegativeInputErrorText"), ["minimum"]);
        }
      },

      formatValue(sValue) {
        return sValue;
      },
    });
  }
);
