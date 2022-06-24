const fs = require('fs')
const http = require('http')
const url = require('url')
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `this is whatre : ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('file written')

const replaceTemplate = (temp, product) => {
     output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
     output = output.replace(/{%IMAGE%}/g, product.image);
     output = output.replace(/{%PRICE%}/g, product.price);
     output = output.replace(/{%FROM%}/g, product.from);
     output = output.replace(/{%QUANTITY%}/g, product.quantity);
     output = output.replace(/{%DESCRIPTION%}/g, product.description);
     output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template.overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template.card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')

const dataObject = JSON.parse(data)

const server = http.createServer((req, res) => {
    const{query, pathname} = url.parse(req.url, true)
   if(pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {"Content-type": "text/html"})

    const cardHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output)

    //Product page
   }else if(pathname === '/product') {
       res.writeHead(200, { 'Content-type': 'text/html'})
       const product = dataObject[query.id]
       const output = replaceTemplate(tempProduct, product)
       res.end(output);
    //API

   }else if(pathname === '/api') {
       fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //    const productData = JSON.parse(data);
           res.writeHead(200, {"Content-type": "application/json"})
        //    console.log(productData);
           res.end(data);     
       })

       //Not found       
   }else{
       res.writeHead(404, {
           'Content-type': 'text/html',
           'my-own-header': 'hello-word'
       })
       res.end('<h1>Page not found!</h1>');
   }
});

server.listen(8001, '127.0.0.1', () => {
    console.log('Listening to request on port 8000')
})


//2.introduction 10-start building very simple api
