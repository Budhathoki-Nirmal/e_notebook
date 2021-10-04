
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// const { findOne } = require('../models/User');


//create a user using: POST "/api/auth/createuser"
router.post('/createuser', [
  body('name', 'Enter Valid Name').isLength({ min: 3 }),
  body('email', 'Enter Valid Email').isEmail(),
  body('password', 'Enter Valid Password').isLength({ min: 5 }),
], async (req, res) => {
  //if there are errors then return bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {

    //check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ errors: 'Sorry User already exists' });
    }
    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    //   .then(user => res.json(user)).catch(err=> {console.log(err)
    res.json({ user })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some errror occured");

  }
})
module.exports = router