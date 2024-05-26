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
app.use(session({secret:  'ieumsae', cookie: {maxAge: 60000}, resave:true, saveUninitialized:true,}));
app.use((req, res, next) => {
    res.locals.id = "";
    res.locals.name = "";
    if(req.session.member){
    res.locals.id = req.session.member.아이디;
    res.locals.name = req.session.member.이름;
    }
    next()
  })
app.use('/api', userRoutes);

const signupRoutes = require('./routes/signupRoutes') //signup 라우트 등록
app.use('/signup', signupRoutes); 

const loginRoutes = require('./routes/loginRoutes') //login 라우트 등록
app.use('/login', loginRoutes); 

app.get('/', (req, res) => {
    res.render('test')
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
