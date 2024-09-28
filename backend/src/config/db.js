require('dotenv').config({ path: './backend/.env' });
const client = process.env.MONGO_DB_URI;
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(client).then(() => {
    console.log('Conectado ao MongoDB!');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  })};

module.exports = connectToDatabase;


