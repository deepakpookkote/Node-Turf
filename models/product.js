// const products = [];

const fs = require('fs');
const path = require('path');
const dirName = require('../helpers/path');

const p = path.join(dirName, 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log('error', error);
            });
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
}