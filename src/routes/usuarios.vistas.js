import { Router } from 'express';
import checkAuth from '../middlewares/authMiddleware.js';
import { checkAdmin } from '../middlewares/checkAdmin.js';
import { getPropiedadByCodigo } from "../models/propiedades.model.js"; 

const router = Router();

// Ruta para listar usuarios
router.get('/', checkAuth, checkAdmin, async (req, res) => {
    try {
      const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
      const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad
  
      res.render('usuarios/user-list', {
        navbar: 'navconfig',
        isPublicRoute: false,
        pageTitle: 'LISTADO DE USUARIOS',
        layout: 'adminPanel',
        role: req.session.role,
        codigoPropiedad: codigoPropiedad, // Pasar el código de la propiedad
        nombrePropiedad: nombrePropiedad, // Pasar el nombre de la propiedad
        breadcrumbs: [
          { name: "Inicio", url: "/" },
          { name: "Usuarios", url: "/usuarios" },
          { name: "Listado de Usuarios", url: null }, // El último no lleva URL
        ],
      });
    } catch (error) {
      console.error("Error al obtener el nombre de la propiedad:", error.message);
      res.status(500).send("Error al cargar la página");
    }
  });

// Ruta para agregar usuarios
router.get('/agregar', checkAuth, checkAdmin, async (req, res) => {
    try {
      const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
      const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad
  
      res.render('usuarios/user-add', {
        layout: 'adminPanel',
        navbar: 'navconfig',
        role: req.session.role,
        codigoPropiedad: codigoPropiedad, // Pasar el código de la propiedad
        nombrePropiedad: nombrePropiedad, // Pasar el nombre de la propiedad
        userId: req.session.userId, // Pasar el ID del usuario
        nombre: req.session.nombre, // Pasar el nombre del usuario
        isPublicRoute: false,
        pageTitle: 'AGREGAR USUARIOS',
        breadcrumbs: [
          { name: "Inicio", url: "/" },
          { name: "Usuarios", url: "/usuarios" },
          { name: "Agregar Usuario", url: null }, // El último no lleva URL
        ],
        // Pasar el timestamp desde el servidor
        timestamp: new Date().toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    } catch (error) {
      console.error("Error al obtener el nombre de la propiedad:", error.message);
      res.status(500).send("Error al cargar la página");
    }
  });

// Ruta para editar usuarios
router.get('/editar', checkAuth, checkAdmin, (req, res) => {
    res.render('usuarios/user-edit', { 
        navbar: 'navconfig', 
        isPublicRoute: false, 
        pageTitle: 'EDITAR USUARIO',
        layout: 'adminPanel',
        role: req.session.role
    });
});

export default router;