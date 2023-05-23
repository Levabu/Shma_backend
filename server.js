const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

