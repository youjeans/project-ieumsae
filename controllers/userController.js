const userModel = require('../models/userModel');

function addUser(req, res) {
    const user = { id: req.body.id, name: req.body.name };
    userModel.addUser(user);
    res.send('User added successfully!');
}

function getUser(req, res) {
    const user = userModel.getUser(req.params.id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render('userView', { user });
}

module.exports = { addUser, getUser };
