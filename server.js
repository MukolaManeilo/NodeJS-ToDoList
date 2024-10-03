const express = require('express');
const path = require('path');
const morgan = require('morgan')

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

app.listen(PORT, (error => {
    error ? console.log(error) : console.log('http://localhost:' + PORT);
}));

const createPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req,res) => {
    const title = 'Home';
    res.render(createPath('index'), {title});
});

app.get('/edit', (req,res) => {
    const title = 'Edit';
    res.render(createPath('edit'), {title});
});


app.get('/create', (req,res) => {
    const title = 'Create';
    res.render(createPath('create'), {title});
});

app.use((req, res) => {
    res
        .status(404)
        .render(createPath('error'));
})