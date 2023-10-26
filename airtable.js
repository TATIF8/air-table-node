const axios = require("axios");

const API_TOKEN =
  "patP4DYdNBbMxgNfM.86a4d3d893407e1e7ad07e5e59bda9c8abadb7d33e86eecbe2e21eaac386445a";

const API_URL = `https://api.airtable.com/v0/appiSfzer3iVlkmir/tbl5AnU1BeuS9cALH`;
const config = {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

axios
  .get(API_URL, config)
  .then((response) => {
    const data = response.data;
    console.log(data.records);
  })
  .catch((error) => {
    console.error(error);
  });
