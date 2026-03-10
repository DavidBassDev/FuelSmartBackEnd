const express = require('express');
const cors = require('cors');


const app = express();


require('./models/db');
//los middleware
app.use(cors());
app.use(express.json());

//ruta de autenticar despues de iniciar la app
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);
//ruta de listar vehiculos
const vehicleRoutes = require('./routes/vehicle.routes');
app.use('/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor  en puerto ${PORT}`);
});


