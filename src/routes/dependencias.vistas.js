import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as dependenciasModel from "../models/dependencias.model.js"; // Importar el modelo de dependencias
import { getPropiedadByCodigo } from "../models/propiedades.model.js"; // Importar la función para obtener el nombre de la propiedad

const router = Router();

router.get("/", checkAuth, async (req, res) => {
  try {
    const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
    const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad

    // Obtener las dependencias desde el modelo
    const dependenciasData = await dependenciasModel.getDependencias(codigoPropiedad);

    res.render("dependencias/dep-list", { // Cambiado de 'extensiones' a 'dependencias'
      layout: "adminPanel",
      navbar: "navconfig",
      role: req.session.role,
      isPublicRoute: false,
      pageTitle: "LISTADO DE DEPENDENCIAS", // Cambiado de 'EXTENSIONES' a 'DEPENDENCIAS'
      codigoPropiedad: codigoPropiedad,
      nombrePropiedad: nombrePropiedad,
      dependencias: dependenciasData.dependencias, // Pasar las dependencias a la vista
      headers: dependenciasData.headers, // Pasar los encabezados a la vista
      breadcrumbs: [
        { name: "Inicio", url: "/" },
        { name: "Dependencias", url: "/dependencias" }, // Cambiado de 'Extensiones' a 'Dependencias'
        { name: "Editar Dependencia", url: null }, // Cambiado de 'Extensión' a 'Dependencia'
      ],
    });
  } catch (error) {
    console.error("Error al obtener el nombre de la propiedad:", error.message);
    res.status(500).send("Error al cargar la página");
  }
});

export default router;
