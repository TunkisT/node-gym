const express = require('express');
const mysql = require('mysql2/promise');
const validation = require('../../middleware/validation');
const { userSchema } = require('../../models/auth');
const { mysqlConfig } = require('../../config');

const router = express.Router();

router.post('/register', validation(userSchema), async (req, res) => {
  console.log(req.body);

  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `
      INSERT INTO users (email, password)
      VALUES (${mysql.escape(req.body.email)}, ${mysql.escape(
        req.body.password
      )})
    `
    );
    await con.end();

    if (!data.insertId) {
      return res.status(500).send({ err: 'Server issue - please try again' });
    }

    return res.send({ msg: 'Registration successful', userId: data.insertId });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Server issue - please try again' });
  }
});

router.post('/login', validation(userSchema), (req, res) => {
  console.log(req.body);
  return res.send({ msg: 'Login successful' });
});

module.exports = router;
