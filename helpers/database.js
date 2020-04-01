const Sequelize = require('sequelize');

const sequelize = new Sequelize('shop-kart', 'root', 'deepak1456', {
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;



