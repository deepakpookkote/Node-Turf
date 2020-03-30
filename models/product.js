// const products = [];

const fs = require('fs');
const path = require('path');
const dirName = require('../helpers/path');

const p = path.join(dirName, 'data', 'products.json');

const Cart = require('../models/cart');

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
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                    console.log(error, 'in-save&update');
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (error) => {
                    console.log('error', error);
                });
            }
        })
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter((prod) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                if(!error) {
                    Cart.deleteProduct(id, product.totalPrice);
                }
            })
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((item) => item.id === id);
            cb(product);
        })
    }
}