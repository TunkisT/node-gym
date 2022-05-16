const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const validation = require('../../middleware/validation');
const { userSchema } = require('../../models/auth');
const { mysqlConfig, jwtSecret } = require('../../config');
var jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', validation(userSchema), async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const passHash = bcrypt.hashSync(req.body.password, 10);
    const [data] = await con.execute(
      `
      INSERT INTO users (email, password)
      VALUES (${mysql.escape(req.body.email)}, '${passHash}')
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

router.post('/login', validation(userSchema), async (req, res) => {
  console.log(req.body);
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `
      SELECT * FROM users 
      WHERE email = (${mysql.escape(req.body.email)})
      LIMIT 1
    `
    );
    await con.end();

    if (data.length !== 1) {
      return res.status(400).send({ err: 'Email or password incorrect' });
    }
    const token = jwt.sign({ userId: data[0].id }, jwtSecret);
    return res.send({ msg: 'Login successful', token });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Server issue - please try again' });
  }
});

module.exports = router;
