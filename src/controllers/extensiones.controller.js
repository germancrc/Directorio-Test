import * as extensionesModel from "../models/extensiones.model.js";
import * as registroCambiosModel from "../models/registroCambios.model.js";

export const getExtensiones = async (req, res) => {
  const { propiedad } = req.query; // Obtener el código de la propiedad desde la solicitud
  try {
    if (!propiedad) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar un código de propiedad válido." });
    }

    const extensiones = await extensionesModel.getExtensiones(propiedad);
    res.json(extensiones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExtensionesForAdmin = async (req, res) => {
  try {
    // Obtener el código de propiedad de la sesión o los parámetros de la consulta
    const codigoPropiedad = req.session.propiedad || req.query.propiedad;

    if (!codigoPropiedad) {
      throw new Error("Código de propiedad no proporcionado.");
    }

    // Llamar al modelo con el código de propiedad
    const extensionesAdm = await extensionesModel.getAllExtensionesForAdmin(
      codigoPropiedad
    );
    res.json(extensionesAdm);
  } catch (error) {
    console.error("Error en getAllExtensionesForAdmin:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createExtension = async (req, res) => {
  try {
    // Verificar sesión
    if (!req.session || !req.session.userId) {
      req.session.toast = {
        type: "danger",
        title: "Error",
        message:
          "Sesión expirada o no disponible. Por favor, inicia sesión nuevamente.",
      };
      return res.redirect("/login");
    }

    // Depurar los datos recibidos
    console.log("Datos recibidos en el controlador:", req.body);

    // Extraer datos del cuerpo de la solicitud
    const {
      ext,
      nombre,
      departamento,
      posicion,
      estado,
      tipo,
      dependencia,
      codigoPropiedad, // Extraer codigoPropiedad del cuerpo de la solicitud
    } = req.body;

    // Validar campos requeridos
    if (
      !ext ||
      !nombre ||
      !departamento ||
      !posicion ||
      !estado ||
      !tipo ||
      !dependencia ||
      !codigoPropiedad
    ) {
      throw new Error("Todos los campos son requeridos");
    }

    // Llamar al modelo para crear la extensión
    await extensionesModel.createExtension(
      {
        ext,
        nombre,
        departamento,
        posicion,
        propiedad: codigoPropiedad, // Cambiado de "codigoPropiedad" a "propiedad"
        estado,
        tipo,
        dependencia,
      },
      codigoPropiedad // Pasar codigoPropiedad como segundo parámetro
    );

    // Redirigir con mensaje de éxito
    req.session.toast = {
      type: "success",
      title: "Éxito",
      message: `Extensión (${ext}) agregada exitosamente`,
    };
    return res.redirect("/extensiones");
  } catch (error) {
    console.error("Error en createExtension:", error.message);

    // Redirigir con mensaje de error
    req.session.toast = {
      type: "danger",
      title: "Error",
      message: error.message || "Ocurrió un error al agregar la extensión",
    };
    return res.redirect("/extensiones/agregar");
  }
};

export const updateExtension = async (req, res) => {
  try {
    // Verificar sesión
    if (!req.session || !req.session.userId) {
      req.session.toast = {
        type: "danger",
        title: "Error",
        message: "Sesión expirada o no disponible. Por favor, inicia sesión nuevamente.",
      };
      return res.redirect("/login");
    }

    // Obtener ext desde los parámetros de la URL
    const { ext } = req.params;

    // Extraer datos del cuerpo de la solicitud
    const { nombre, departamento, posicion, tipo, dependencia, estado } = req.body;

    // Obtener codigoPropiedad desde el cuerpo de la solicitud o la sesión
    const codigoPropiedad = req.body.propiedad || req.session.propiedad;

    // Validar que codigoPropiedad esté presente
    if (!codigoPropiedad) {
      throw new Error("El campo 'codigoPropiedad' es requerido.");
    }

    // Validar que estado esté presente y sea válido
    if (!estado || (estado !== "activo" && estado !== "inactivo")) {
      throw new Error("El campo 'estado' es requerido y debe ser 'activo' o 'inactivo'.");
    }

    const modified_by_nombre = req.session.nombre; // Obtener el nombre del usuario de la sesión

    // Validar datos requeridos
    if (!nombre || !departamento || !posicion || !tipo || !dependencia) {
      req.session.toast = {
        type: "danger",
        title: "Error",
        message: "Todos los campos son obligatorios",
      };
      return res.redirect(`/extensiones/editar?ext=${ext}`);
    }

    // Obtener datos actuales de la extensión
    const extensionActual = await extensionesModel.getExtensionById(ext, codigoPropiedad);
    if (!extensionActual) {
      throw new Error('Extensión no encontrada');
    }

    // Comparar valores y registrar cambios
    const cambios = [];
    const camposAComparar = {
      nombre: { actual: extensionActual.nombre, nuevo: nombre },
      departamento: { actual: extensionActual.departamento, nuevo: departamento },
      posicion: { actual: extensionActual.posicion, nuevo: posicion },
      tipo: { actual: extensionActual.tipo, nuevo: tipo },
      dependencia: { actual: extensionActual.dependencia, nuevo: dependencia },
      estado: { actual: extensionActual.estado, nuevo: estado }
    };

    for (const [campo, valores] of Object.entries(camposAComparar)) {
      if (valores.actual !== valores.nuevo) {
        cambios.push({
          campo,
          valorAnterior: valores.actual,
          valorNuevo: valores.nuevo
        });
      }
    }

    // Si hay cambios, registrarlos en la tabla correspondiente
    if (cambios.length > 0) {
      await registroCambiosModel.registrarCambios(ext, cambios, modified_by_nombre, codigoPropiedad);
    }

    // Actualizar la extensión en la base de datos
    await extensionesModel.updateExtension({
      ext,
      nombre,
      departamento,
      posicion,
      estado,
      tipo,
      dependencia,
    }, codigoPropiedad); // Pasar codigoPropiedad como segundo parámetro

    // Redirigir con éxito
    req.session.toast = {
      type: "success",
      title: "Éxito",
      message: `Extensión ${ext} actualizada exitosamente`,
    };
    res.redirect("/extensiones");
  } catch (error) {
    console.error("Error al actualizar la extensión:", error.message);
    req.session.toast = {
      type: "danger",
      title: "Error",
      message: error.message || "Error al actualizar la extensión",
    };

    // Verifica si 'ext' está disponible en 'req.params'
    const ext = req.params.ext || '';
    res.redirect(`/extensiones/editar?ext=${ext}`);
  }
};


/* export const deleteExtension = async (req, res) => {
    try {
        await extensionesModel.deleteExtension(req.params.ext);
        res.json({ message: 'Extensión eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 */

//////////////////////////////para el resumen

export const getResumenExtensiones = async (req) => {
  try {
    // Obtener el código de propiedad de la sesión
    const codigoPropiedad = req.session.propiedad;

    // Obtener datos de extensiones
    const resumenExtensiones = await extensionesModel.getTotalesExtensiones(
      codigoPropiedad
    );
    return resumenExtensiones; // Devuelve los datos
  } catch (error) {
    console.error("Error al obtener resumen:", error);
    throw error; // Lanza el error para que sea manejado en index.js
  }
};
