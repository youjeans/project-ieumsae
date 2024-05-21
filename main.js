const express = require('express');
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true}));
app.use(express.json());


app.set('view engine', 'ejs');

const path = require("path");

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/getForm', (req, res) => {
    console.log(req.query);
    res.send('get 요청 성공');
});

app.post('/postForm', (req, res) => {
    console.log(req.body);
    res.render('result', {data: req.body});
});

app.listen(port, () => {
    console.log('Server Open : ', port);
});
