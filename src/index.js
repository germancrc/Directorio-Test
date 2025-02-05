import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkDBConnection } from "./database/connection.js";
/* import { getTotalesExtensiones } from './models/extensiones.model.js';  */
import { getTotalesUsuarios } from './models/usuarios.model.js'; 
import methodOverride from 'method-override'; 
import { getPropiedadByCodigo } from './models/propiedades.model.js';
import { getResumenExtensiones } from './controllers/extensiones.controller.js';
import { getResumenUsuarios } from './controllers/usuarios.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "./.env") });

import express from "express";
import morgan from "morgan";
import { create } from "express-handlebars";
import session from "express-session"; // Importar express-session
import extensionesAPIRoutes from "./routes/extensiones.routes.js";
import usuariosAPIRoutes from "./routes/usuarios.routes.js";
import cambiosAPIRoutes from "./routes/registroCambios.routes.js";
import propiedadesAPIRoutes from "./routes/propiedades.routes.js";
import extensionesViewRoutes from "./routes/extensiones.vistas.js";
import usuariosViewRoutes from "./routes/usuarios.vistas.js"; // Importar las rutas de vistas de usuarios
import loginRoutes from "./routes/login.js";
import dependenciasAPIRoutes from "./routes/dependencias.routes.js";
import registrocambiosViewRoutes from "./routes/registroCambios.vistas.js";
import checkAuth from "./middlewares/authMiddleware.js"; // Importar el middleware

// Inicialización
const app = express();

// Estado base de datos
checkDBConnection();

// Configuración de Handlebars
const hbs = create({
  defaultLayout: "main",
  layoutsDir: join(__dirname, "views", "layouts"),
  partialsDir: join(__dirname, "views", "partials"),
  extname: ".hbs",
  helpers: {
    eq: (a, b) => a === b,
    json: (context) => JSON.stringify(context), // Agregar el helper `json`
  },
});


// Configuración de Express
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Middlewares básicos - PRIMERO
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Cambiado a true para mejor soporte
app.use(methodOverride('_method'));

// Middleware de sesión - DESPUÉS de los parsers
app.use(
  session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { 
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 // 24 horas
      }
  })
);

// Middleware para manejos de flash - DESPUÉS de session
app.use((req, res, next) => {
    if (!req.session) {
        console.error("Error: Session middleware no está disponible");
        return next(new Error("Session middleware no está disponible"));
    }
    
    console.log("Middleware: Verificando mensajes flash...");
    if (req.session.toast) {
        console.log("Middleware: Mensaje encontrado en la sesión:", req.session.toast);
        res.locals.toast = req.session.toast;
        req.session.toast = null; // Limpiar el mensaje
    } else {
        console.log("Middleware: No hay mensaje en la sesión.");
        res.locals.toast = null;
    }
    next();
});

// Archivos públicos
app.use(express.static(join(__dirname, "public")));

// Rutas públicas
app.get("/", (req, res) => {
  res.render("index", { navbar: "navigation", isPublicRoute: true });
});

// Rutas privadas (vistas)
app.get('/config', checkAuth, async (req, res, next) => {
  try {
    // Obtener el nombre de la propiedad basado en el código
    const codigoPropiedad = req.session.propiedad;
    const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad);

    // Obtener los datos de extensiones y usuarios
    const resumenExtensiones = await getResumenExtensiones(req); // Pasar req para obtener el código de propiedad
    const resumenUsuarios = await getResumenUsuarios(req); // Pasar req para obtener el código de propiedad

    // Renderizar la vista con todos los datos
    return res.render('mainconfig', {
      layout: 'adminPanel',
      navbar: 'navconfig',
      pageTitle: 'Resumen',
      isPublicRoute: false,
      role: req.session.role,
      // Datos de extensiones
      totalExtensiones: resumenExtensiones.totalExtensiones,
      totalExtActivas: resumenExtensiones.totalExtActivas,
      totalExtInactivas: resumenExtensiones.totalExtInactivas,
      // Datos de usuarios
      totalUsuarios: resumenUsuarios.totalUsuarios,
      totalUserActivos: resumenUsuarios.totalUserActivos,
      totalUserInactivos: resumenUsuarios.totalUserInactivos,
      // Nombre de la propiedad
      nombrePropiedad: nombrePropiedad,
      codigoPropiedad: codigoPropiedad,
    });
  } catch (error) {
    console.error("Error al obtener el resumen:", error);
    return res.status(500).json({
      success: false,
      message: "Error al cargar el resumen",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
    });
  }
});


// Ruta POST para manejar el login
app.use(loginRoutes); // Aquí se maneja el login

app.use("/extensiones", extensionesViewRoutes); // Rutas para vistas de extensiones
app.use("/usuarios", usuariosViewRoutes); // Rutas para vistas de usuarios
app.use(registrocambiosViewRoutes); // Agrega esta línea

// Rutas de API
app.use(extensionesAPIRoutes); // Rutas para API de extensiones
app.use(usuariosAPIRoutes); // Rutas para API de usuarios
app.use(dependenciasAPIRoutes); // Rutas para API de dependencias
app.use(cambiosAPIRoutes); // Rutas para API de cambios
app.use(propiedadesAPIRoutes); // Rutas para API de propiedades


// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(404).json({
      success: false,
      message: "Ruta no encontrada",
    });
  } else {
    res.status(404).render("404", {
      layout: "main",
      navbar: "navigation",
      pageTitle: "Página no encontrada",
      isPublicRoute: true,
    });
  }
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);

  if (req.originalUrl.startsWith("/api")) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
  } else {
    res.status(500).render("500", {
      layout: "main",
      navbar: "navigation",
      pageTitle: "Error interno del servidor",
      isPublicRoute: true,
    });
  }
});

// Inicializar el servidor
app.listen(app.get("port"), () => {
  console.log("Servidor escuchando en el puerto ", app.get("port"));
});
