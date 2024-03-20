sap.ui.define(["veronchi/leverx/project/utils/constants"], (constants) => {
  "use strict";
  
  return {
    fetchCountries(fnCallback) {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", constants.API_KEY);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
      };

      fetch(`https://api.countrystatecity.in/v1/countries`, requestOptions)
      .then(response => response.text())
      .then(fnCallback)
      .catch(error => console.log("error", error));
    },

    fetchStates(sCountryISO, fnCallback) {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", constants.API_KEY);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
      };

      fetch(`https://api.countrystatecity.in/v1/countries/${sCountryISO}/states`, requestOptions)
      .then(response => response.text())
      .then(fnCallback)
      .catch(error => console.log("error", error));
    },

    fetchCities(sCountryISO, sStateISO, fnCallback) {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", constants.API_KEY);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
      };

      fetch(`https://api.countrystatecity.in/v1/countries/${sCountryISO}/states/${sStateISO}/cities`, requestOptions)
      .then(response => response.text())
      .then(fnCallback)
      .catch(error => console.log("error", error));
    },

    fetchCitiesByCountry(sCountryISO, fnCallback) {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", constants.API_KEY);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow"
      };

      fetch(`https://api.countrystatecity.in/v1/countries/${sCountryISO}/cities`, requestOptions)
      .then(response => response.text())
      .then(fnCallback)
      .catch(error => console.log("error", error));
    },
  }
});