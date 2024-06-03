const users = [];

function addUser(user) {
    users.push(user);
    console.log('User added:', user);
    console.log('Current users:', users);
}

function getUser(id) {
    const user = users.find(user => user.id == id);
    console.log(`Requested user id: ${id}, Found user:`, user);
    return user;
}

module.exports = { addUser, getUser };