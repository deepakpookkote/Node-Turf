const Sequelize = require('sequelize');

const sequelize = require('../helpers/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNullL: false,
        primaryKey: true
    }
});

module.exports = Order;