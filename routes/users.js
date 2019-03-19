const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Model
const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

//Register Handle
router.post('/register', (req, res) => {
  // console.log(req.body);
  // res.send('Hello');
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check rtequired
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all the fileds' });
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: 'Password Must be be at lease 6 Character length' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // res.send('passed');
    //validation passed

    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msh: 'Email is alresdy exist' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password
        });
        // console.log(newUser);
        // res.send('gasds');

        //bcrypt hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //set password hashed
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then(user => {
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
