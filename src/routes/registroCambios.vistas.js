import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as registroCambiosModel from "../models/registroCambios.model.js"; // Corregí el nombre del archivo
import { getPropiedadByCodigo } from "../models/propiedades.model.js"; // Importar la función para obtener el nombre de la propiedad

const router = Router();

router.get("/cambios-all", checkAuth, async (req, res) => {
  try {
    const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
    const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad

    // Obtener todos los cambios desde el modelo
    const { cambiosConfig } = await registroCambiosModel.getTodosCambios(codigoPropiedad);

    res.render("regCambios", {
      layout: "adminPanel",
      navbar: "navconfig",
      role: req.session.role,
      isPublicRoute: false,
      pageTitle: "REGISTRO DE CAMBIOS",
      codigoPropiedad: codigoPropiedad,
      nombrePropiedad: nombrePropiedad,
      cambios: cambiosConfig, // Pasar los cambios a la vista
      breadcrumbs: [
        { name: "Inicio", url: "/" },
        { name: "Extensiones", url: "/cambios-all" },
        { name: "Editar Extensión", url: null }, // El último no lleva URL
      ],
    });
  } catch (error) {
    console.error("Error al obtener el nombre de la propiedad o los cambios:", error.message);
    res.status(500).send("Error al cargar la página");
  }
});

export default router;