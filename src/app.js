const express = require('express');
const cors = require('cors');

const app = express();

require('./models/db');
//los middleware
app.use(cors());
app.use(express.json());

//ruta de autenticar despues de iniciar la app
const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authRoutes);
//ruta de listar vehiculos
const vehicleRoutes = require('./modules/vehicles/vehicle.routes');
app.use('/vehicles', vehicleRoutes);

//ruta de listar usuarios
const userRoutes = require('./modules/users/users.routes');
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});
//ruta para el repostaje
const refuelingRoutes = require('./modules/refueling/refueling.routes');
app.use('/refueling', refuelingRoutes);



//exponer ruta de vauchers
const path = require('path');

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

//para listar roles
const roleRoutes = require('./modules/users/role.routes');
app.use('/roles', roleRoutes);

//para listar clientes
const clientRoutes = require('./modules/clients/client.routes');
app.use('/clients', clientRoutes);

//SIMULACION DATOS DE TELEMETRIA GPS
const telemetriaRoutes = require('./modules/telemetry/telemetry.routes');
app.use('/api/telemetria', telemetriaRoutes);

//SIMULACION DE PROVEEDOR COMBUSTIBLE
const fuelSupplierRouter = require('./modules/fuelSupplier/fuel.supplier.routes');
app.use('/fuelSupplier', fuelSupplierRouter);


//EXPONER DASHBOARD
const dashboardRouter = require('./modules/dashboard/dashboard.routes');
app.use('/api/dashboard', dashboardRouter);

const fuelRequestRoutes = require('./modules/fuelRequest/fuelrequest.routes');
app.use('/api/fuelrequest', fuelRequestRoutes);


//CAMBIAR SI AL PROBAR MI PROTOTIPO YA TIENEN ESTE PUERTO EN USO
const PORT = 3000;


//PARA IMPRIMIR EN TERMINAL QUE ESTA CORRIENDO EN QUE PUERTO
app.listen(PORT, () => {
  console.log(`Servidor  en puerto ${PORT}`);
});


