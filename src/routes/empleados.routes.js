const express = require('express');
const controlEmpleados = require('../controllers/empleados.controller');
const md_Auth = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/agregarEmpleados', md_Auth.Auth, controlEmpleados.agregarEmpleados);
api.get('/buscarEmpleados', md_Auth.Auth, controlEmpleados.buscarEmpleados);
api.put('/editarEmpleados/:idEmpleados', md_Auth.Auth, controlEmpleados.editarEmpleados);
api.delete('/eliminarEmpleados/:idEmpleados', md_Auth.Auth, controlEmpleados.eliminarEmpleados);
api.get('/buscarPorId/:idEmpleados', md_Auth.Auth, controlEmpleados.buscarPorId);
api.get('/buscarPorNombre', md_Auth.Auth, controlEmpleados.buscarPorNombre);
api.get('/buscarPorDepartamento', md_Auth.Auth, controlEmpleados.buscarPorDepartamento);


module.exports = api;
