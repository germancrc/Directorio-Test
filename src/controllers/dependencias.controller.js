import * as dependenciasModel from "../models/dependencias.model.js";

export const getDependencias = async (req, res) => {
  try {
    // Obtener el código de propiedad de la sesión o los parámetros de la consulta
    const codigoPropiedad = req.session.propiedad || req.query.propiedad;
    console.log("Código de propiedad obtenido (getDependencias):", codigoPropiedad);

    if (!codigoPropiedad) {
      throw new Error("Código de propiedad no proporcionado.");
    }

    // Llamar al modelo con el código de propiedad
    const dependencias = await dependenciasModel.getDependencias(codigoPropiedad);
    console.log("Dependencias obtenidas (getDependencias):", dependencias);

    res.json(dependencias);
  } catch (error) {
    console.error("Error en getDependencias:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createDependencia = async (req, res) => {
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

    // Depurar los datos recibidos
    console.log("Datos recibidos en el controlador (createDependencia):", req.body);

    // Extraer datos del cuerpo de la solicitud
    const { depend_nombre, descripcion, estado, codigoPropiedad } = req.body;
    console.log("Datos extraídos (createDependencia):", { depend_nombre, descripcion, estado, codigoPropiedad });

    // Validar campos requeridos
    if (!depend_nombre || !descripcion || !estado || !codigoPropiedad) {
      throw new Error("Todos los campos son requeridos");
    }

    // Llamar al modelo para crear la dependencia
    await dependenciasModel.createDependencia(
      { depend_nombre, descripcion, estado, propiedad: codigoPropiedad },
      codigoPropiedad
    );

    // Redirigir con mensaje de éxito
    req.session.toast = {
      type: "success",
      title: "Éxito",
      message: `Dependencia (${depend_nombre}) agregada exitosamente`,
    };
    return res.redirect("/dependencias");
  } catch (error) {
    console.error("Error en createDependencia:", error.message);

    // Redirigir con mensaje de error
    req.session.toast = {
      type: "danger",
      title: "Error",
      message: error.message || "Ocurrió un error al agregar la dependencia",
    };
    return res.redirect("/dependencias/agregar");
  }
};

export const updateDependencia = async (req, res) => {
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

    // Obtener depend_nombre desde los parámetros de la URL
    const { depend_nombre } = req.params;
    console.log("Nombre de la dependencia a actualizar (updateDependencia):", depend_nombre);

    // Extraer datos del cuerpo de la solicitud
    const { descripcion, estado } = req.body;
    console.log("Datos recibidos para actualizar (updateDependencia):", { descripcion, estado });

    // Obtener codigoPropiedad desde el cuerpo de la solicitud o la sesión
    const codigoPropiedad = req.body.propiedad || req.session.propiedad;
    console.log("Código de propiedad obtenido (updateDependencia):", codigoPropiedad);

    // Validar que codigoPropiedad esté presente
    if (!codigoPropiedad) {
      throw new Error("El campo 'codigoPropiedad' es requerido.");
    }

    // Validar que estado esté presente y sea válido
    if (!estado || (estado !== "activo" && estado !== "inactivo")) {
      throw new Error("El campo 'estado' es requerido y debe ser 'activo' o 'inactivo'.");
    }

    const modified_by_nombre = req.session.nombre; // Obtener el nombre del usuario de la sesión
    console.log("Usuario que realiza la modificación (updateDependencia):", modified_by_nombre);

    // Obtener datos actuales de la dependencia
    const dependenciaActual = await dependenciasModel.getDependenciaById(depend_nombre, codigoPropiedad);
    console.log("Dependencia actual (updateDependencia):", dependenciaActual);

    if (!dependenciaActual) {
      throw new Error('Dependencia no encontrada');
    }

    // Comparar valores y registrar cambios
    const cambios = [];
    const camposAComparar = {
      descripcion: { actual: dependenciaActual.descripcion, nuevo: descripcion },
      estado: { actual: dependenciaActual.estado, nuevo: estado },
    };

    for (const [campo, valores] of Object.entries(camposAComparar)) {
      if (valores.actual !== valores.nuevo) {
        cambios.push({
          campo,
          valorAnterior: valores.actual,
          valorNuevo: valores.nuevo,
        });
      }
    }

    console.log("Cambios detectados (updateDependencia):", cambios);

    // Si hay cambios, registrarlos en la tabla correspondiente
    if (cambios.length > 0) {
      await registroCambiosModel.registrarCambios(depend_nombre, cambios, modified_by_nombre, codigoPropiedad);
    }

    // Actualizar la dependencia en la base de datos
    await dependenciasModel.updateDependencia(
      { depend_nombre, descripcion, estado },
      codigoPropiedad
    );

    // Redirigir con éxito
    req.session.toast = {
      type: "success",
      title: "Éxito",
      message: `Dependencia ${depend_nombre} actualizada exitosamente`,
    };
    res.redirect("/dependencias");
  } catch (error) {
    console.error("Error al actualizar la dependencia (updateDependencia):", error.message);
    req.session.toast = {
      type: "danger",
      title: "Error",
      message: error.message || "Error al actualizar la dependencia",
    };

    // Verifica si 'depend_nombre' está disponible en 'req.params'
    const depend_nombre = req.params.depend_nombre || '';
    res.redirect(`/dependencias/editar?depend_nombre=${depend_nombre}`);
  }
};

export const getResumenDependencias = async (req) => {
  try {
    // Obtener el código de propiedad de la sesión
    const codigoPropiedad = req.session.propiedad;
    console.log("Código de propiedad obtenido (getResumenDependencias):", codigoPropiedad);

    // Obtener datos de dependencias
    const resumenDependencias = await dependenciasModel.getTotalesDependencias(codigoPropiedad);
    console.log("Resumen de dependencias obtenido (getResumenDependencias):", resumenDependencias);

    return resumenDependencias; // Devuelve los datos
  } catch (error) {
    console.error("Error al obtener resumen (getResumenDependencias):", error);
    throw error; // Lanza el error para que sea manejado en index.js
  }
};