const db = require('mysql2');

const connection = db.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '4151561',
  database: 'ieumsae'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
