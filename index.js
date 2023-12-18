const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};



app.use(cors(corsOptions));
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const userRoutes = require('./routes/userRoutes.js');
const shipmentRoutes = require('./routes/shipmentRoutes.js');
dotenv.config();

const port = process.env.PORT || 5000;
connectDB();



app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); 

// Your route definitions
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);

app.get('/', (req, res) => {
  res.send('API is running....');
});



app.listen(port, () => console.log(`Server started on port ${port}`));
