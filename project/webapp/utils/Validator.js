sap.ui.define([], function () {
  "use strict";
  return {
    
    validateForm(form) {
      const validateFormControls = this._getValidateFormControls(form);

      const invalidControls = validateFormControls.filter((control) => this._validateRequiredControl(control));

      return invalidControls;
    },

    _getValidateFormControls(form) {
      const controlNames = ["sap.m.Input", "sap.m.DatePicker", "sap.m.TextArea", "sap.m.MultiComboBox"];
      return form.getContent().filter((item) => controlNames.includes(item.getMetadata().getName()));
    },

    _validateRequiredControl(control) {
      if (!control.getRequired()) {
        return false;
      }

      if(control.getMetadata().getName().includes("sap.m.MultiComboBox")) {

        if( !control.getSelectedItems().length) {
          control.setValueState("Error");

          return true
        }
      } else {
        return control.getValue().length ? false : true;
      }
    }

  };
});
