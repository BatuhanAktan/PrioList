  
const puppeteer = require('puppeteer');


// This is a function that scrapes relevant information given the correct url.
async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    // Scrapes the current price 
    const[el] = await page.$x('//*[@id="priceblock_ourprice"]');
    const src = await el.getProperty('textContent')
    const price = await src.jsonValue();
    
    // Scrapes the title of the item
    const[ele] = await page.$x('//*[@id="productTitle"]');   // Copy x path of the element
    const txt2 = await ele.getProperty('textContent')
    const Txt2 = await txt2.jsonValue();    
    var title = Txt2.replace(/[\n\r\t]/g,"");  //Reomoves unneccessary new lines in json string
    
    // Scrapes the img of the item
    const[el2] = await page.$x('//*[@id="landingImage"]');
    const imag = await el2.getProperty('src')
    const img = await imag.jsonValue(); 

    // Scrapes the tags of the item so sorting can be done
    const[el3] = await page.$x('//*[@id="wayfinding-breadcrumbs_feature_div"]/ul/li[1]/span/a');
    const cat = await el3.getProperty('textContent')
    const Cat = await cat.jsonValue(); 
    var category = Cat.replace(/[\n\r\t]/g,"").trim(); 

    console.log({price, title, img, category});

    browser.close();

    
}
console.log(scrape('https://www.amazon.ca/gp/product/B081M769PX?pf_rd_r=X5MR51AB3P938F38DW9D&pf_rd_p=05326fd5-c43e-4948-99b1-a65b129fdd73'));