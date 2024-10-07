const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const taskRouter = require('./routes/task-routes');
const createPath = require('./helpers/create-path');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', taskRouter);

// ------------------------/errorMiddleware--------------------------
app.use((req, res) => {
    const pageTitle = 'Error';
    res.status(404).render(createPath('error'), { pageTitle });
});

// -------------------------start------------------------------------
app.listen(PORT, (error => {
    error ? console.log(error) : console.log('http://localhost:' + PORT);
}));
