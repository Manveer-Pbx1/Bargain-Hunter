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

    const priceString = $(".a-price-whole").first().text().trim();
    const price = parseInt(priceString.replace(/,/g, ''));

    const rating = $(".a-size-base .a-color-base").first().text().trim();


    console.log({ title, imgURL, price, rating, url });
    return { title, imgURL, price, rating, url };
  } catch (error) {
    console.error("Error scraping the data:", error);
  }
}
module.exports = {scrape};