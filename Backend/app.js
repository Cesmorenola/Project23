//Invocamos a express
const express = require('express');
const app = express();

// Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path: __dirname+'/env/.env'}) // Env => Variables de entorno

//Motor de plantillas
app.set('view engine', 'ejs');

//Invocamos bcrypts.js
const bcryptjs = require('bcryptjs');

//Variables de sesión
const session = require('express-session');
app.use(session({
	secret:'secret',
	resave: true,
	saveUninitialized:true
}));

// Conexión bd
const connection = require('./Database/db.js');

//Rutas
app.get('/', (req, res)=>{
	res.send('Hola mundo');
});

app.listen(3080, (req, res)=>{
	console.log("Server running on http://localhost:3080");
})