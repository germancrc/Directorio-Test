import pool from "../database/connection.js";

export const getExtensiones = async (codigoPropiedad) => {
  try {
    // Generar el nombre de la tabla dinámicamente
    const tableName = `extensiones_${codigoPropiedad}`;
    const query = `
      SELECT * 
      FROM ${tableName} 
      WHERE estado = 'activo'
    `;

    //console.log("Consulta SQL:", query); // Depuración

    const [rows] = await pool.query(query);

    return {
      headers: ["ext", "nombre", "departamento", "posicion"],
      extensionesOficinas: rows.map((row) => [
        row.ext != null ? row.ext.toString() : "",
        row.nombre || "",
        row.departamento || "",
        row.posicion || "",
      ]),
    };
  } catch (error) {
    console.error("Error al obtener extensiones:", error.message);
    throw error;
  }
};


export const getExtensionById = async (ext, codigoPropiedad) => {
  try {
    // Validar que el código de propiedad esté presente
    if (!codigoPropiedad) {
      throw new Error("El campo 'codigoPropiedad' es requerido.");
    }

    // Generar el nombre de la tabla dinámicamente
    const tableName = `extensiones_${codigoPropiedad.toLowerCase()}`;

    // Consultar la extensión en la tabla correspondiente
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE ext = ?`, [ext]);

    // Retornar la primera fila encontrada o null si no hay resultados
    return rows[0] || null;
  } catch (error) {
    console.error("Error en getExtensionById:", error);
    throw error;
  }
};

export const getAllExtensionesForAdmin = async (codigoPropiedad) => {
  try {
    // Generar el nombre de la tabla dinámicamente
    const tableName = `extensiones_${codigoPropiedad}`;
    console.log("Tabla:", tableName);

    // Columnas que se van a seleccionar
    const columns = [
      "ext",
      "nombre",
      "departamento",
      "posicion",
      "propiedad",
      "estado",
      "tipo",
      "dependencia",
    ];

    // Consulta para obtener solo las columnas necesarias
    const query = `SELECT ${columns.join(", ")} FROM ${tableName}`;
    const [rows] = await pool.query(query);

    //console.log("Extensiones para administración:", rows);

    if (!rows.length) {
      console.log("No se encontraron extensiones.");
    }

    return {
      headers: columns, // Usar las columnas definidas
      extModOficinas: rows.map((row) =>
        columns.map((col) => (row[col] != null ? row[col].toString() : ""))
      ),
    };
  } catch (error) {
    console.error(
      "Error al obtener todas las extensiones para administración:",
      error.message
    );
    throw error;
  }
};

export const createExtension = async (data, codigoPropiedad) => {
  const {
    ext,
    nombre,
    departamento,
    posicion,
    estado,
    tipo,
    dependencia,
  } = data;

  // Validar campos requeridos
  if (!ext || !nombre || !departamento || !posicion || !estado || !tipo || !dependencia || !codigoPropiedad) {
    throw new Error("Todos los campos son requeridos");
  }

  // Generar el nombre de la tabla dinámicamente
  const tableName = `extensiones_${codigoPropiedad}`;

  // Validar si la extensión ya existe
  const [existingExt] = await pool.query(
    `SELECT ext FROM ${tableName} WHERE ext = ?`,
    [ext]
  );

  if (existingExt.length > 0) {
    throw new Error(`La extensión ${ext} ya existe`);
  }

  // Inserción en la base de datos
  const [result] = await pool.query(
    `INSERT INTO ${tableName} 
    (ext, nombre, departamento, posicion, propiedad, estado, tipo, dependencia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ext,
      nombre,
      departamento,
      posicion,
      codigoPropiedad, // Usar el código de la propiedad
      estado,
      tipo,
      dependencia,
    ]
  );

  return result;
};


export const updateExtension = async (extension, codigoPropiedad) => {
  try {
    // Validar que codigoPropiedad esté presente
    if (!codigoPropiedad) {
      throw new Error("El campo 'codigoPropiedad' es requerido.");
    }
    console.log("Datos recibidos en updateExtension:", extension, codigoPropiedad);
    
    // Convertir codigoPropiedad a minúsculas
    const propiedadLower = codigoPropiedad.toLowerCase();

    // Generar el nombre de la tabla dinámicamente
    const tableName = `extensiones_${propiedadLower}`;
    console.log("Nombre de la tabla generado (updateExtension):", tableName);

    const [result] = await pool.query(
      `UPDATE ${tableName} 
      SET nombre = ?, departamento = ?, posicion = ?, estado = ?, tipo = ?, dependencia = ? 
      WHERE ext = ?`,
      [
        extension.nombre,
        extension.departamento,
        extension.posicion,
        extension.estado,
        extension.tipo,
        extension.dependencia,
        extension.ext,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error(`No se encontró la extensión ${extension.ext}`);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

/* export const deleteExtension = async (ext) => {
  try {
    const [result] = await pool.query("DELETE FROM extensiones WHERE EXT = ?", [
      ext,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};
 */



//////////////////////////para el resumen

export const getTotalesExtensiones = async (codigoPropiedad) => {
  try {
    // Generar el nombre de la tabla dinámicamente
    const tableName = `extensiones_${codigoPropiedad}`;

    // Consulta total de extensiones
    const [totalExtensiones] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
    console.log("Total de Extensiones:", totalExtensiones);

    // Consulta total de extensiones activas
    const [totalExtActivas] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} WHERE estado = 'activo'`);
    console.log("Total de Extensiones Activas:", totalExtActivas);

    // Consulta total de extensiones inactivas
    const [totalExtInactivas] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} WHERE estado = 'inactivo'`);
    console.log("Total de Extensiones Inactivas:", totalExtInactivas);

    return {
      totalExtensiones: totalExtensiones[0].total,
      totalExtActivas: totalExtActivas[0].total,
      totalExtInactivas: totalExtInactivas[0].total,
    };
  } catch (error) {
    console.error("Error al obtener los totales de extensiones:", error.message);
    throw error;
  }
};



