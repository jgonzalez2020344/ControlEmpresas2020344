const Empleados = require('../models/empleados.models');
const Empresas = require('../models/empresas.model');
const jwt = require('../services/jwt');
const bcrypt = require('bcrypt-nodejs');

function agregarEmpleados(req, res) {
    var parametros = req.body;
    var modeloEmpleados = new Empleados();

    if (req.user.rol == 'Empresa') {
        if (parametros.nombre && parametros.email && parametros.password) {
            Empleados.find({ email: parametros.email }, (err, empleadosEncontrado) => {
                if (empleadosEncontrado.length > 0) {
                    return res.status(500).send({ mensaje: 'El correo ya esta en uso' });
                } else {
                    modeloEmpleados.nombre = parametros.nombre;
                    modeloEmpleados.puesto = parametros.puesto;
                    modeloEmpleados.departamento = parametros.departamento;
                    modeloEmpleados.password = parametros.password;
                    modeloEmpleados.email = parametros.email;
                    modeloEmpleados.rol = 'Empleado';
                    modeloEmpleados.idEmpresas = parametros.idEmpresas;

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        modeloEmpleados.password = passwordEncriptada;

                        modeloEmpleados.save((err, empleadosGuardados) => {
                            if (err) res.status(200).send({ mensaje: 'Error en la peticion' });
                            if (!empleadosGuardados) return res.status(403).send({ mensaje: 'Error al guardar empleados' });
                            return res.status(200).send({ empleados: empleadosGuardados });
                        })
                    })
                }
            })
        } else {
            return res.status(403).send({ mensaje: 'Ingrese los parametros necesarios' });
        }
    } else {
        return res.status(500).send({ mensaje: 'No tiene los permisos necesarios' });
    }
}

function buscarEmpleados(req, res) {
    if (req.user.rol == 'Empresa') {
        Empleados.find({}, (err, empleadosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadosEncontrados) return res.status(403).send({ mensaje: 'Error al obtener empleados' });
            return res.status(200).send({ empleados: empleadosEncontrados });
        }).populate('idEmpresas', 'nombre');
    }
}

function editarEmpleados(req, res) {
    var idEmpleados = req.params.idEmpleados;
    var parametros = req.body;
    var idEmp = req.user.params;

    Empleados.findOne({ idEmp: idEmpleados }, (err, empresasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

        if (empresasEncontradas.idEmp !== Empleados.idEmpresas) {
            return res.status(500).send({ mensaje: 'No tiene los permisos para editar este Empleado' });
        } else {
            Empleados.findByIdAndUpdate(idEmpleados, parametros, { new: true }, (err, empleadosEditados) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!empleadosEditados) return res.status(403).send({ mensaje: 'Error al editar empleados' });
                return res.status(200).send({ empleados: empleadosEditados });
            });
        }
    });
}

function eliminarEmpleados(req, res) {
    var idEmpleados = req.params.idEmpleados;
    var idEmp = req.user.sub;

    Empleados.findOne({idEmp: idEmpleados}, (err, empresasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (empresasEncontradas.idEmp !== Empleados.idEmpresas) {
            return res.status(500).send({ mensaje: 'No puede eliminar empleados que no sean de su empresa' }); 
        } else {
            Empleados.findByIdAndDelete(idEmpleados, (err, empleadosEliminados) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!empleadosEliminados) return res.status(500).send({ mensaje: 'Error al eliminar empleados' });

                return res.status(200).send({ mensaje: 'Empleado eliminado con exito' });
            })
        }
    })
}

function buscarPorId(req, res) {
    var idEmpleados = req.params.idEmpleados;

    Empleados.findOne({empleados: {$elemMach:{_id: idEmpleados}}}, (err, empleadosEncontrados) => {
        if(err) return res.status('Error en la peticion');
        if(!empleadosEncontrados) return res.status({mensaje: 'Error al encontrar al empleado'});
        return res.status(200).send({empleados: empleadosEncontrados});
    })
}

function buscarPorNombre(req, res) {
    var nEmpleados = req.body.nombre;

    Empleados.findOne({nombre: nEmpleados}, (err, empleadoEncontradoN) =>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadoEncontradoN) res.status(500).send({mensaje: 'Error al obtener empleado por nombre'});

        return res.status(200).send({empleados: empleadoEncontradoN});
    })
}

function buscarPorDepartamento(req, res) {
    var buscarEmpleadoD = req.body.departamento;

    Empleados.findOne({departamento: buscarEmpleadoD}, (err, empleadoEncontradoD) =>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadoEncontradoD) return res.status(403).send({mensaje: 'Error al encontrar empleados'});
        return res.status(200).send({ empleados: empleadoEncontradoD});
    })
}

module.exports = {
    agregarEmpleados,
    buscarEmpleados,
    editarEmpleados,
    eliminarEmpleados,
    buscarPorId,
    buscarPorNombre,
    buscarPorDepartamento
}

