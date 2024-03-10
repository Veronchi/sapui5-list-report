sap.ui.define([], () => {
  "use strict";

  return {
    initResourceBundle(oResourceBundle) {
      this.oResourceBundle = oResourceBundle;
    },

    checkIfItsNewProduct(releaseDate) {
      if (releaseDate) {
        const iReleaseDate = new Date(releaseDate).getTime();
        const iSevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();

        return iSevenDaysAgo < iReleaseDate;
      } else {
        return false;
      }
    },

    getDaysFromReleaseDate(sReleaseDate) {
      if (sReleaseDate) {
        const iReleaseDate = new Date(sReleaseDate);
        const oDateNow = new Date();
        const iDiffInTime = oDateNow.getTime() - iReleaseDate.getTime();
        const iDiffInDays = Math.round(iDiffInTime / (1000 * 3600 * 24));

        return this.oResourceBundle.getText("DaysText", [iDiffInDays]);
      }
    },

    formatConfirmMessageText(aProductsNames) {
      if (!aProductsNames || !aProductsNames.length) {
        return "";
      }

      return this.oResourceBundle.getText(aProductsNames.length > 1 ? "ConfirmDeleteProductsText" : "ConfirmDeleteProductText", [
        aProductsNames.length > 1 ? aProductsNames.length : aProductsNames[0]
      ]);
    },

    formatProdiuctCategories(aCategories) {
      if (aCategories) {
        const aCategoriesNames = aCategories.map((item) => item.name);

        return aCategoriesNames.join(" | ");
      }
    }
  };
});
