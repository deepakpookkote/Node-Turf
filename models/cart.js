const fs = require('fs');

const path = require('path');
const dirName = require('../helpers/path');

const p = path.join(dirName, 'data', 'cart.json');



module.exports = class cart {
    static addProduct(id, productPrice) {
        //Fetch Previous Product
        fs.readFile(p, (error, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!error) {
                cart = JSON.parse(fileContent);
            }
            //Analyze the cart => Find existing Product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), error => {
                console.log(error, 'in-cart');
            })
        })
        //Add new product/ increase quantity
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (error, fileContent) => {
            if(error) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), error => {
                console.log(error, 'in-cart');
            })
        });
    }

    static getCart(cb) {
        fs.readFile(p, (error, fileContent) => {
            const cart = JSON.parse(fileContent);
            if(error) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}