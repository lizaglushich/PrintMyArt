const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;


// create an array to store user data
const users = [];

function createUser(username, password){
    users.push({username, password});
    console.log(users);
}

function authenticateUser(username, password){
    //find user by user name in the array
    const user = users.find(user => user.username === username)

    if(!user || user.password !== password)
    {
        return false;
    }
    return true;
}

module.exports = {createUser, authenticateUser};