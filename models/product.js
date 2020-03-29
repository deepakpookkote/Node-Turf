// const products = [];

const fs = require('fs');
const path = require('path');
const dirName = require('../helpers/path');

const p = path.join(dirName, 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
            console.log('in');
        } else {
            console.log('in-1');
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title) {
        this.title = title;
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