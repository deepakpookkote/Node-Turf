// const products = [];

// const fs = require('fs');
// const path = require('path');
// const dirName = require('../helpers/path');

// const p = path.join(dirName, 'data', 'products.json');

const db = require('../helpers/database');

const Cart = require('../models/cart');

// const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     });
// };

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
        // return db.execute(
        //     'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
        //     [this.title, this.price, this.imageUrl, this.description]
        //   );
    }

    static deleteById(id) {
        // getProductsFromFile((products) => {
        //     const product = products.find(prod => prod.id === id);
        //     const updatedProducts = products.filter((prod) => prod.id !== id);
        //     fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
        //         if(!error) {
        //             Cart.deleteProduct(id, product.totalPrice);
        //         }
        //     })
        // });
    }

    static fetchAll() {
        //getProductsFromFile(cb)
        return db.execute('SELECT * FROM products');

    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}