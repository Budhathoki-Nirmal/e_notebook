
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "AuthenticationToken";
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
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some errror occured");

  }
})

//Authenticate a user using: POST "/api/auth/login"
router.post('/login', [
  body('email', 'Enter Valid Email').isEmail(),
  body('password', 'Password never blank').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //retrieve email and password from req.body
  const { email, password } = req.body;
  try {
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ errors: 'Please enter valid credentials' });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: 'Please enter valid credentials' });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal errror occured");
  }
})
module.exports = router