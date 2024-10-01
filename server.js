const express = require('express');
const app = express();

const PORT = 3000;

const createPath = (page) => Path2D.resolve(__dirname, 'views', page + '.html');

app.listen(PORT, (error => {
    error ? console.log(error) : console.log('https://localhost:' + PORT);
}));

app.get('/', (req,res) => {
    res.sendFile(createPath('index'));
});

app.get('/edit', (req,res) => {
    res.sendFile(createPath('edit'));
});

app.post('/edit', (req,res) => {

});


app.get('/create', (req,res) => {
    res.sendFile(createPath('edit'));
});

app.post('/create', (req,res) => {

});

app.use((req, res) => {
    res
        .status(404)
        .sendFile(createPath('error'));
})