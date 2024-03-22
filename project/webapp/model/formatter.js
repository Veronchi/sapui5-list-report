sap.ui.define([], () => {
  "use strict";

  return {
    checkIfNewProduct(releaseDate) {
      if (!releaseDate) {
        return false;
      }

      const iReleaseDate = new Date(releaseDate).getTime();
      const iSevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();

      return iSevenDaysAgo < iReleaseDate;
    },

    getDaysFromReleaseDate(sReleaseDate) {
      if (!sReleaseDate) {
        return "";
      }

      const iReleaseDate = new Date(sReleaseDate);
      const oDateNow = new Date();
      const iDiffInTime = oDateNow.getTime() - iReleaseDate.getTime();
      const iDiffInDays = Math.round(iDiffInTime / (1000 * 3600 * 24));

      return this.oResourceBundle.getText("DaysText", [iDiffInDays]);
    },

    checkIfNewProduct(releaseDate) {
      if (!releaseDate) {
        return false;
      }

      const iReleaseDate = new Date(releaseDate).getTime();
      const iSevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();

      return iSevenDaysAgo < iReleaseDate;
    },

    getDaysFromReleaseDate(sReleaseDate) {
      if (!sReleaseDate) {
        return false;
      }

      const iReleaseDate = new Date(sReleaseDate);
      const oDateNow = new Date();
      const iDiffInTime = oDateNow.getTime() - iReleaseDate.getTime();
      const iDiffInDays = Math.round(iDiffInTime / (1000 * 3600 * 24));

      return this.oResourceBundle.getText("DaysText", [iDiffInDays]);
    },

    formatConfirmMessageText(aProductsNames) {
      if (!aProductsNames || !aProductsNames.length) {
        return "";
      }

      const confirmationText = aProductsNames.length > 1 ? "ConfirmDeleteProductsText" : "ConfirmDeleteProductText";
      const confirmationPlaceholder =  aProductsNames.length > 1 ? aProductsNames.length : aProductsNames[0];

      return this.oResourceBundle.getText(confirmationText, [confirmationPlaceholder]);
    },

    formatProductCategories(aCategories) {
      if (aCategories) {
        return aCategories.map((item) => item.name).join(" | ");
      }
    },

    getCategoriesId(aCategories) {
      return  aCategories?.length ? aCategories.map((item) => item.id) : [];
    }
  };
});
