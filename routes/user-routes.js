const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Маршрут для реєстрації
router.get('/register', (req, res) => {
    res.render('register', { pageTitle: 'Register' });
});

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    const newUser = new User({ email, password });
    newUser.save()
        .then(() => res.redirect('/users/login'))
        .catch(err => res.status(500).send('Error registering user'));
});

// Маршрут для логіну
router.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',  // Перенаправляє на головну сторінку після успішного входу
    failureRedirect: '/users/login', // Перенаправляє назад на логін у разі помилки
}));

// Маршрут для виходу
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/users/login');
    });
});

module.exports = router;
