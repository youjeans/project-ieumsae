const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
const db = require('./config/mysql');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/api', userRoutes);

const signupRoutes = require('./routes/signupRoutes') //signup 라우트 등록
app.use('/signup', signupRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the MVC App!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
