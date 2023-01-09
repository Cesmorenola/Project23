//Invocamos a express
const express = require("express");
const app = express();
const path = require("path");

// Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Invocamos a dotenv
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/env/.env" }); // Env => Variables de entorno

//Motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, ".." + "/Frontend/Views"));

//Invocamos bcrypts.js
const bcryptjs = require("bcryptjs");

//Variables de sesión
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Conexión bd
const connection = require("./Database/db.js");
const { nextTick } = require("process");

//Rutas
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("registro");
});

//Registro de usuarios
app.post("/register", async (req, res) => {
  const name = req.body.name;
  const user = req.body.user;
  const apellidos = req.body.apellido1 + " " + req.body.apellido2;
  const identificacion = req.body.identificacion;
  const email = req.body.correo;
  const phone = req.body.telefono;
  const password = req.body.contrasena;
  let passwordHash = await bcryptjs.hash(password, 8);
  connection.query(
    "INSERT INTO users SET ?",
    {
      Nombres: name,
      Apellidos: apellidos,
      Telefono: phone,
      Correo: email,
      Usuario: user,
      Contrasena: passwordHash,
      NIdentificacion: identificacion,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("index");
      }
    }
  );
});

// Autenticación
let NAME;
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.contrasena;    
    let passwordHash = await bcryptjs.hash(pass, 8);
	if (user && pass) {
		connection.query('SELECT * FROM users WHERE Usuario = ?', [user], async (error, results, fields)=> {
			//console.log(results[0].Contrasena);
			if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].Contrasena)) ) {  
               	console.log('Incorrect Username and/or Password!');	
				res.render('login');			
			} else {  
				console.log('Login válido. Hola, '+results[0].Nombres);	       
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].Nombres;
				let nombre=results[0].Nombres;
				res.render('index',{login:true, name: nombre});

			}
		});
	} else {	
		console.log('Please enter user and Password!');
		res.render('login');
		res.end();
	}
});

// Autenticación de páginas
app.get('/', (req, res)=>{
	if(req.session.loggedin){
		res.render('index',{
			login:true,
			name:req.session.name
		});
	}else{
		res.render('index',{
		login:false,
		name:'Debes iniciar sesión.'
		});
	}
});

// Cerrar sesión
app.get('/logout', (req, res)=>{
	req.session.destroy(()=>{
		res.redirect('/');
	});
})

app.listen(3080, (req, res) => {
  console.log("Server running on http://localhost:3080");
});
