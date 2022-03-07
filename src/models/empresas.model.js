const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empresaSchema = new Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String
})

module.exports = mongoose.model('Empresas', empresaSchema);