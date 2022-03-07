const express = require('express');
const cors = require('cors');
const app = express();

const empleadosRoutes = require('./src/routes/empleados.routes');
const empresasRoutes = require('./src/routes/empresas.routes');


app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cors());
app.use('/api', empresasRoutes, empleadosRoutes);

module.exports = app;