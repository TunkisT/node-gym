const express = require('express');
const isLoggedIn = require('../../middleware/auth');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.send({ msg: 'Hi' });
});

module.exports = router;
