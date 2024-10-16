const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // Якщо користувач автентифікований, дозволяємо доступ до маршруту
    }
    res.redirect('/users/login'); // Якщо користувач не автентифікований, перенаправляємо на сторінку логіну
}

module.exports = ensureAuthenticated;