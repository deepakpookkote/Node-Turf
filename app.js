const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./helpers/database').mongoConnect;

const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findUserById('5e898b4043912507c8c0ea4f')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(error => {
            console.log('User not exist');
        });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);


mongoConnect(() => {
    app.listen(3030);
});



