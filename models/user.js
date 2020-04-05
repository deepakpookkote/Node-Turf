const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

class User {
    constructor(userName, email, cart, id) {
        this.name = userName;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(error => console.log(error));

    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        })
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
        }
        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }

            )
            .then(result => {
                console.log(result);
            })
            .catch(error => console.log(error));
    }

    // getCart() {
    //     const db = getDb();
    //     const productIds = this.cart.items.map(i => {
    //         return i.productId
    //     })
    //     return db
    //         .collection('products')
    //         .find({ _id: { $in: productIds } })
    //         .toArray()
    //         .then(products => {
    //             return products.map(p => {
    //                 return {
    //                     ...p,
    //                     quantity: this.cart.items.find(i => {
    //                         return i.productId.toString() === p._id.toString();
    //                     }).quantity
    //                 };
    //             });
    //         })
    //         .catch(error => console.log(error));
    // }

    /*get  cart function will remove the deleted products from cart*/
    getCart() {
        if (!this.cart) {
          this.cart = { items: [] };
        }
        const db = getDb();
        const cartProductIds = this.cart.items.map(item => {
          return item.productId;
        });
        return db
          .collection("products")
          .find({ _id: { $in: cartProductIds } }) //mongodb method $in:array
          .toArray()
          .then(products => {
            if (products.length !== cartProductIds.length) {
              return db
                .collection("users")
                .updateOne(
                  { _id: new mongodb.ObjectId(this._id) },
                  { $set: { cart: { items: [] } } }
                );
            }
            return products.map(product => {
              return {
                ...product,
                quantity: this.cart.items.find(item => {
                  return item.productId.toString() === product._id.toString();
                }).quantity
              };
            });
          })
          .catch(err => console.log(err));
      }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }

            )
            .then(result => {
                console.log(result);
            })
            .catch(error => console.log(error));
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    }
                };
                return db.collection('orders').insertOne(order)
            }).then(result => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new mongodb.ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            })
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders').find({'user._id': new mongodb.ObjectId(this._id)})
            .toArray()
            .then(result => {
                return result
            })
            .catch(error => console.log(error));

    }

    static findUserById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then(user => {
                return user;
            })
            .catch(error => console.log(error));
    }
}

module.exports = User;