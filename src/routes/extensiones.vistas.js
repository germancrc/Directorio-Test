import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";
import * as extensionesModel from "../models/extensiones.model.js";
import { getPropiedadByCodigo } from "../models/propiedades.model.js"; // Importar la función para obtener el nombre de la propiedad

const router = Router();

router.get("/", checkAuth, async (req, res) => {
  try {
    const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
    const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad

    res.render("extensiones/ext-list", {
      layout: "adminPanel",
      navbar: "navconfig",
      role: req.session.role,
      isPublicRoute: false,
      pageTitle: "LISTADO EXTENSIONES",
      codigoPropiedad: codigoPropiedad, 
      nombrePropiedad: nombrePropiedad, 
      breadcrumbs: [
        { name: "Inicio", url: "/" },
        { name: "Extensiones", url: "/extensiones" },
        { name: "Editar Extensión", url: null }, // El último no lleva URL
      ],
    });
  } catch (error) {
    console.error("Error al obtener el nombre de la propiedad:", error.message);
    res.status(500).send("Error al cargar la página");
  }
});

router.get("/agregar", checkAuth, async (req, res) => {
  try {
    const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
    const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad

    res.render("extensiones/ext-add", {
      layout: "adminPanel",
      navbar: "navconfig",
      role: req.session.role,
      codigoPropiedad: codigoPropiedad, 
      nombrePropiedad: nombrePropiedad, 
      userId: req.session.userId, 
      nombre: req.session.nombre, 
      isPublicRoute: false,
      pageTitle: "AGREGAR EXTENSIÓN",
      breadcrumbs: [
        { name: "Inicio", url: "/" },
        { name: "Extensiones", url: "/extensiones" },
        { name: "Nueva Extensión", url: null },
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


router.get("/editar", checkAuth, async (req, res) => {
  try {
    const { ext } = req.query;
    if (!ext) {
      return res.redirect("/extensiones"); // Si no se pasa EXT, redirige a la lista
    }

    const codigoPropiedad = req.session.propiedad; // Obtener el código de la propiedad desde la sesión
    const nombrePropiedad = await getPropiedadByCodigo(codigoPropiedad); // Obtener el nombre de la propiedad

    // Consultar detalles completos de la extensión en el modelo
    const extension = await extensionesModel.getExtensionById(ext, codigoPropiedad);
    console.log(extension); // Verifica que `dependencia` esté incluido y sea correcto

    // Renderizar el formulario con los datos obtenidos
    res.render("extensiones/ext-edit", {
      layout: "adminPanel",
      role: req.session.role,
      codigoPropiedad: codigoPropiedad, 
      nombrePropiedad: nombrePropiedad, 
      navbar: "navconfig",
      isPublicRoute: false,
      pageTitle: "EDITAR EXTENSIÓN",
      breadcrumbs: [
        { name: "Inicio", url: "/" },
        { name: "Extensiones", url: "/extensiones" },
        { name: "Editar Extensión", url: null },
      ],
      ...extension, // Pasa los datos completos al render
    });
  } catch (error) {
    console.error("Error al cargar los datos de la extensión:", error.message);
    res.status(500).send("Error al cargar los datos de la extensión");
  }
});

// Ruta para manejar la creación de extensiones desde el formulario
router.post("/", checkAuth, async (req, res) => {
  const {
    ext,
    nombre,
    departamento,
    posicion,
    codigoPropiedad,
    estado,
    tipo,
    dependencia,
  } = req.body;

  try {
    // Llamamos al controlador para crear la extensión
    await extensionesController.createExtension(
      {
        ext,
        nombre,
        departamento,
        posicion,
        codigoPropiedad,
        estado,
        tipo,
        dependencia,
      },
      req // Pasamos el objeto req completo
    );

    // Redirigir o mostrar un mensaje de éxito
    res.redirect("/extensiones");
  } catch (error) {
    console.error("Error al guardar la extensión:", error.message);
    res.status(500).send("Error al guardar la extensión");
  }
});

// Ruta para manejar la modificación de extensiones desde el formulario
router.post("/extensiones/ext", checkAuth, async (req, res) => {
  const {
    ext,
    nombre,
    departamento,
    posicion,
    estado,
    tipo,
    dependencia,
  } = req.body;
  const propiedad = req.session.propiedad; // Obtenemos el usuario autenticado

  try {
    // Llamamos al controlador para actualizar la extensión
    await extensionesController.updateExtension(
      {
        ext,
        nombre,
        departamento,
        posicion,
        propiedad,
        estado,
        tipo,
        dependencia,
      },
      propiedad
    );

    // Redirigir o mostrar un mensaje de éxito
    res.redirect("/extensiones");
  } catch (error) {
    console.error("Error al actualizar la extensión:", error.message);
    res.status(500).send("Error al actualizar la extensión");
  }
});

export default router;