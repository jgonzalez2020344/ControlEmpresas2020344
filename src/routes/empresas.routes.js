const express = require('express');
const controlEmpresas = require('../controllers/empresas.controller');
const md_Auth = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/login', controlEmpresas.login);
api.post('/agregarEmpresas', md_Auth.Auth, controlEmpresas.agregarEmpresas);
api.get('/obtenerEmpresas', md_Auth.Auth, controlEmpresas.obtenerEmpresas);
api.put('/editarEmpresas/:idEmpresas', md_Auth.Auth, controlEmpresas.editarEmpresas)
api.delete('/eliminarEmpresas/:idEmpresas', md_Auth.Auth, controlEmpresas.eliminarEmpresas);


module.exports = api;