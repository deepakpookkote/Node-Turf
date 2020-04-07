const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb+srv://deepak:deepak1456@cluster0-nqe1i.mongodb.net/shopKart?&w=majority';
const User = require('./models/user');
const app = express();

const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    User.findById('5e8b27368424bb12334cb4e2')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => {
            console.log('User not exist');
        });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected');
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'deepak',
                        email: 'deepak@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
        app.listen(3030);
    })
    .catch(error => console.log(error));


