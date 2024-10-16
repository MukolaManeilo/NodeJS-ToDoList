const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user-routes');
const taskRouter = require('./routes/task-routes');
const createPath = require('./helpers/create-path');
const User = require('./models/user');

// -------------------------init------------------------------------
const app = express();
const PORT = 3000;
const db = 'mongodb+srv://kolamanejlo:rXmomGpC4IgcWhI2@cluster0.6ydhe.mongodb.net/ToDoList?retryWrites=true&w=majority&appName=Cluster0';

mongoose
    .connect(db)
    .then(() => console.log('Connected to DB'))
    .catch(error => console.log(error));

app.set('view engine', 'ejs');

// -----------------------middleware---------------------------------
app.use(session({
    secret: '6Ycy6S2EsTJvWBAn',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// -----------------------Passport Configuration---------------------

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        // Знаходимо користувача за email (async/await замість callback)
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Порівнюємо введений пароль з хешованим паролем у базі
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return done(null, user); // Якщо пароль співпав
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }

    } catch (err) {
        return done(err);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// -----------------------Routes-------------------------------------
app.use('/users', userRoutes);
app.use('/', taskRouter);

// ------------------------errorMiddleware--------------------------
app.use((req, res) => {
    const pageTitle = 'Error';
    res.status(404).render(createPath('error'), { pageTitle });
});

// -------------------------start------------------------------------
app.listen(PORT, (error => {
    error ? console.log(error) : console.log('http://localhost:' + PORT);
}));
