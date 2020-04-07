const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
    .connect('mongodb+srv://deepak:deepak1456@cluster0-nqe1i.mongodb.net/shopKart?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
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


