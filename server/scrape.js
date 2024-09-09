const axios = require('axios');
const cheerio = require('cheerio');
async function scrape(url) {
  try {
    // Fetch the HTML of the page
    const { data } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    const title = $("#productTitle").text().trim();

    const imgURL = $("#landingImage").attr("src");

    const priceTxt = $(".a-price-whole").first().text().trim();

    const ratingTxt = $(".a-size-base .a-color-base").first().text().trim();

    console.log({ title, imgURL, priceTxt, ratingTxt });
    return { title, imgURL, priceTxt, ratingTxt };
  } catch (error) {
    console.error("Error scraping the data:", error);
  }
}
module.exports = {scrape};