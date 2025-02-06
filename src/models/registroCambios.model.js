import pool from "../database/connection.js";

// Modificar las funciones para que la propiedad esté en minúsculas

export const getCambios = async (propiedad) => {
  try {
    if (!propiedad) {
      throw new Error("El campo 'propiedad' es requerido.");
    }

    // Convertir 'propiedad' a minúsculas
    const tableName = `registro_cambios_${propiedad.toLowerCase()}`;  // Aseguramos que la propiedad esté en minúsculas
    console.log("Nombre de la tabla generado:", tableName);

    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} ORDER BY modified_at DESC LIMIT 10`
    );

    if (!rows.length) {
      console.log("No se encontraron cambios en la base de datos.");
      return { cambiosConfig: [], hasData: false };
    }

    const cambiosFormateados = rows.map((row) => {
      return [
        row.id,
        row.ext,
        row.campo,
        row.valor_anterior,
        row.valor_nuevo,
        row.modified_by_nombre,
        row.modified_at,
      ];
    });

    return { cambiosConfig: cambiosFormateados, hasData: true };
  } catch (error) {
    console.error("Error detallado al obtener cambios:", {
      message: error.message,
      stack: error.stack,
      error: error,
    });
    throw error;
  }
};

export const getTodosCambios = async (propiedad) => {
  try {
    if (!propiedad) {
      throw new Error("El campo 'propiedad' es requerido.");
    }

    // Convertir 'propiedad' a minúsculas
    const tableName = `registro_cambios_${propiedad.toLowerCase()}`;  // Aseguramos que la propiedad esté en minúsculas
    console.log("Nombre de la tabla generado:", tableName);

    const [rows] = await pool.query(
      `SELECT * FROM ${tableName}`
    );

    if (!rows.length) {
      console.log("No se encontraron cambios en la base de datos.");
      return { cambiosTodos: [], hasData: false };
    }

    const cambiosFormateados = rows.map((row) => {
      return [
        row.id,
        row.ext,
        row.campo,
        row.valor_anterior,
        row.valor_nuevo,
        row.modified_by_nombre,
        row.modified_at,
      ];
    });

    return { cambiosTodos: cambiosFormateados, hasData: true };
  } catch (error) {
    console.error("Error detallado al obtener cambios:", {
      message: error.message,
      stack: error.stack,
      error: error,
    });
    throw error;
  }
};

export const registrarCambios = async (ext, cambios, modified_by_nombre, propiedad) => {
  try {
    if (!propiedad) {
      throw new Error("El campo 'propiedad' es requerido.");
    }

    // Convertir 'propiedad' a minúsculas
    const tableName = `registro_cambios_${propiedad.toLowerCase()}`;  // Aseguramos que la propiedad esté en minúsculas
    console.log("Nombre de la tabla generado:", tableName);

    for (const cambio of cambios) {
      await pool.query(
        `INSERT INTO ${tableName} 
        (ext, campo, valor_anterior, valor_nuevo, modified_by_nombre, modified_at) 
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          ext,
          cambio.campo,
          cambio.valorAnterior,
          cambio.valorNuevo,
          modified_by_nombre, // Nombre del usuario que hizo el cambio
        ]
      );
    }
  } catch (error) {
    throw error;
  }
};
