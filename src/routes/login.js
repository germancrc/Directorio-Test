// routes/login.js
import express from "express";
import { loginUser } from "../controllers/login.controller.js";
import { validateLogin } from "../middlewares/validateLogin.js"; // Importar el middleware

const router = express.Router();

// Ruta para la vista de login
router.get("/login", (req, res) => {
  res.render("auth/login", {
    layout: "loginPage",
    role: req.session.role,
    propiedad: req.session.propiedad,
    isPublicRoute: false,
  });
});

// Ruta para mostrar el formulario de login
/* router.get('/login', (req, res) => {
    const toast = req.session.toast; // Recuperar el mensaje de la sesión
    console.log('Mensaje de error recuperado de sesión:', toast);

    // Renderizar la vista con el mensaje
    res.render('auth/login', { 
        layout: "loginPage",
        toast 
    }, () => {
        // Este callback asegura que el mensaje se elimine después de renderizar
        req.session.toast = null; // Eliminar el mensaje de la sesión
        console.log('Mensaje de error eliminado de la sesión');
    });
}); */

// Ruta para procesar el login
router.post("/login", validateLogin, loginUser); // Usamos el middleware antes del controlador

export default router;

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("No se pudo cerrar sesión");
    }
    res.redirect("/login"); // Redirigir al formulario de login después de cerrar sesión
  });
});
