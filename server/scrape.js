import puppeteer from "puppeteer";
export async function scrape(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);


  const [el] = await page.$$('xpath/.//*[@id="productTitle"]');
  const txt = await el.getProperty("textContent");
  const title = await txt.jsonValue();

  const [img] = await page.$$('xpath/.//*[@id="landingImage"]');
  const src = await img.getProperty('src');
  const imgURL = await src.jsonValue();

  const price = await page.$('.a-price-whole');
  const txt2 = await price.getProperty('textContent');
  const priceTxt = await txt2.jsonValue();

  const rating = await page.$('.a-size-base .a-color-base');
  const txt3 = await rating.getProperty('textContent');
  const ratingTxt = await txt3.jsonValue();
  console.log({title, imgURL, priceTxt, ratingTxt});

  await browser.close();
  return {title, imgURL, priceTxt, ratingTxt};
}

// scrape('https://www.amazon.in/BIGBERRY-Backpack-Multiple-Compartments-organiser/dp/B0CQRBBWP3/ref=sr_1_1_sspa?crid=2DOULZ8BSNDRU&dib=eyJ2IjoiMSJ9.Jtii_8L1SRc3pdwm-FSX5E6hJCBWLq1W4A2muU1oY5Emz-VGlN2-c8KfbQaP9VBmUoZPInxVglLjCMKamhcfUtzQCRJ6jt2BfvxYu4W70gk9KFC6zfUSWh1dK_7Dp_FJSEoW0HyoVbsruMzX0LT_ifwjuTUOsLRZMmW-uu8409TtAy8lCmlEmLZhFHh22sicDhNlaD6lU27aKg9jlujl_OABtPmeJPh37GF9FT8hN2A.8wPp4NxJjWPkkGsSwB7UM1mZLmkNO-Y6-fGJw---s3w&dib_tag=se&keywords=bag+for+men&qid=1724962153&sprefix=bag+for+%2Caps%2C256&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1');