const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.set('view engine', 'ejs');
app.use(express.json());
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the MVC App!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
