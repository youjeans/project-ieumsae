const crypto = require('crypto');
const salt = crypto.randomBytes(16).toString('hex');
module.exports = salt;
