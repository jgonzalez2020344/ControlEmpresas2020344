const Empresas = require('../models/empresas.model');
const jwt = require('../services/jwt');
const bcrypt = require('bcrypt-nodejs');

function registrarAdmin() {
    var modeloEmpresa = new Empresas();

    Empresas.find({ nombre: 'Admin'}, (err, nombreEncontrado) => {
      if(nombreEncontrado.length > 0){
          return console.log('El usuario ya esta creado');
      }  else {
          modeloEmpresa.nombre = 'Admin';
          modeloEmpresa.email = 'admin@admin.com';
          modeloEmpresa.password = '123456'
          modeloEmpresa.rol = 'Admin'

          bcrypt.hash('123456', null, null, (err, passwordEnciptada) =>{
              modeloEmpresa.password = passwordEnciptada;

              modeloEmpresa.save((err, adminGuardado) => {
                  if(err) return console.log({mensaje: 'Error en la peticion'});
                  if(!adminGuardado) return console.log({mensaje: 'Error al guardar Admin'});
                  return console.log('Admin:' + ' ' + adminGuardado);
              })
          })
      }
    })
}

function login (req,res) {
    var parametros = req.body

    Empresas.findOne({nombre: parametros.nombre}, (err, adminEncontrado) => {
        if(err) res.status(500).send({mensaje: 'Error en la peticion'});
        if(adminEncontrado){

            bcrypt.compare(parametros.password, adminEncontrado.password, (err, verificacionPassword) => {
                if(verificacionPassword){
                    return res.status(200).send({token: jwt.crearToken(adminEncontrado)});
                } else {
                    return res.status(500).send({mensaje: 'La contraseña no coincide'});
                }
            })
        } else {
            return res.status(500).send({mensaje: 'El admin no se ha encontrado'})
        }
    })
}

function agregarEmpresas(req, res) {
    const parametros = req.body;
    const modeloEmpresas = new Empresas();

    if(req.user.rol == 'Admin'){
        if(parametros.nombre && parametros.email && parametros.password) {
            Empresas.find({email: parametros.email }, (err, empresaEncontrada) => {
                if(empresaEncontrada.length > 0){
                    return res.status(500).send({mensaje: 'Este correo ya esta en uso'})
                } else {
                    modeloEmpresas.nombre = parametros.nombre;
                    modeloEmpresas.email = parametros.email;
                    modeloEmpresas.password = parametros.password;
                    modeloEmpresas.rol = 'Empresa';

                    bcrypt.hash(parametros.password, null, null, (err, passwordEnciptada) =>{
                        modeloEmpresas.password = passwordEnciptada;

                        modeloEmpresas.save((err, empresaAgregada) =>{
                            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                            if(!empresaAgregada) return res.status(403).send({mensaje: 'Error al guardar empresa'});
                            return res.status(200).send({empresas: empresaAgregada});
                        })
                    })
                }
            })
        } else {
            return res.status(403).send({mensaje: 'Ingrese los parametros obligatorios'})
        }
    }
}

function obtenerEmpresas(req, res){
    Empresas.find({}, (err, empresaObtenida) => {
        return res.send({empresas: empresaObtenida});
    })
}

function editarEmpresas(req, res){
    var idEmpresas = req.params.idEmpresas;
    var parametros = req.body;

    if (req.user.rol == 'Admin'){
        Empresas.findByIdAndUpdate(idEmpresas, parametros, {new: true}, (err, empresaEditada) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if (!empresaEditada) return res.status(403).send({mensaje: 'Error al editar empresas'});
            return res.status(200).send({empresas: empresaEditada});
        })
    } else {
        return res.status(403).send({mensaje: 'No tiene los permisos para editar empresas'});
    }
}

function eliminarEmpresas (req, res) {
    var idEmpresas = req.params.idEmpresas;

    if (req.user.rol == 'Admin'){
        Empresas.findByIdAndDelete(idEmpresas, (err, empresaEliminada) =>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!empresaEliminada) res.status(403).send({mensaje: 'Error al eliminar empresa'});
            return res.status(200).send({mensaje: 'Empresa eliminada con exito'});
        })
    } else {
        return res.status(500).send({mensaje: 'No tiene los permisos para eliminar empresas'});
    }
}



module.exports = {
    registrarAdmin,
    login,
    agregarEmpresas,
    obtenerEmpresas,
    editarEmpresas,
    eliminarEmpresas,
}