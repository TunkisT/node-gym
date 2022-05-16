const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/v1/auth');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/test', (req, res) => {
  res.send({ msg: 'Server is running' });
});

app.use('/', authRoutes);

app.all('*', (req, res) => {
  return res.status(404).send({ err: 'page not found' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
