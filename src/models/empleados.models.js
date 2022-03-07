const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empleadoSchema = new Schema({
    nombre: String,
    puesto: String,
    departamento: String,
    password: String,
    email: String,
    rol: String,
    idEmpresas: {type: Schema.Types.ObjectId, ref: 'Empresas'}
})

module.exports = mongoose.model('Empleados', empleadoSchema);