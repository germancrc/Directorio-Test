import pool from "../database/connection.js";

export const getDependencias = async (codigoPropiedad) => {
  try {
    // Generar el nombre de la tabla dinámicamente
    const tableName = `dependencias_${codigoPropiedad}`;
    console.log("Nombre de la tabla generado (getDependencias):", tableName);

    const query = `
      SELECT * 
      FROM ${tableName} 
      WHERE estado = 'activo'
    `;

    const [rows] = await pool.query(query);
    //console.log("Dependencias obtenidas de la base de datos (getDependencias):", rows);

    return {
      headers: ["depend_nombre", "descripcion", "estado"],
      dependencias: rows.map((row) => [
        row.depend_nombre || "",
        row.descripcion || "",
        row.estado || "",
      ]),
    };
  } catch (error) {
    console.error("Error al obtener dependencias (getDependencias):", error.message);
    throw error;
  }
};

export const createDependencia = async (data, codigoPropiedad) => {
  const { depend_nombre, descripcion, estado } = data;
  console.log("Datos recibidos en el modelo (createDependencia):", { depend_nombre, descripcion, estado, codigoPropiedad });

  // Validar campos requeridos
  if (!depend_nombre || !descripcion || !estado || !codigoPropiedad) {
    throw new Error("Todos los campos son requeridos");
  }

  // Generar el nombre de la tabla dinámicamente
  const tableName = `dependencias_${codigoPropiedad}`;
  console.log("Nombre de la tabla generado (createDependencia):", tableName);

  // Validar si la dependencia ya existe
  const [existingDepend] = await pool.query(
    `SELECT depend_nombre FROM ${tableName} WHERE depend_nombre = ?`,
    [depend_nombre]
  );

  if (existingDepend.length > 0) {
    throw new Error(`La dependencia ${depend_nombre} ya existe`);
  }

  // Inserción en la base de datos
  const [result] = await pool.query(
    `INSERT INTO ${tableName} 
    (depend_nombre, descripcion, estado, propiedad) 
    VALUES (?, ?, ?, ?)`,
    [depend_nombre, descripcion, estado, codigoPropiedad]
  );

  console.log("Resultado de la inserción (createDependencia):", result);

  return result;
};

export const updateDependencia = async (dependencia, codigoPropiedad) => {
  try {
    // Validar que codigoPropiedad esté presente
    if (!codigoPropiedad) {
      throw new Error("El campo 'codigoPropiedad' es requerido.");
    }
    console.log("Datos recibidos en updateDependencia:", dependencia, codigoPropiedad);

    // Convertir codigoPropiedad a minúsculas
    const propiedadLower = codigoPropiedad.toLowerCase();

    // Generar el nombre de la tabla dinámicamente
    const tableName = `dependencias_${propiedadLower}`;
    console.log("Nombre de la tabla generado (updateDependencia):", tableName);

    const [result] = await pool.query(
      `UPDATE ${tableName} 
      SET descripcion = ?, estado = ? 
      WHERE depend_nombre = ?`,
      [dependencia.descripcion, dependencia.estado, dependencia.depend_nombre]
    );

    if (result.affectedRows === 0) {
      throw new Error(`No se encontró la dependencia ${dependencia.depend_nombre}`);
    }

    console.log("Resultado de la actualización (updateDependencia):", result);

    return result;
  } catch (error) {
    console.error("Error en updateDependencia:", error.message);
    throw error;
  }
};

export const getTotalesDependencias = async (codigoPropiedad) => {
  try {
    // Generar el nombre de la tabla dinámicamente
    const tableName = `dependencias_${codigoPropiedad}`;
    console.log("Nombre de la tabla generado (getTotalesDependencias):", tableName);

    // Consulta total de dependencias
    const [totalDependencias] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
    console.log("Total de Dependencias (getTotalesDependencias):", totalDependencias);

    // Consulta total de dependencias activas
    const [totalDepActivas] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} WHERE estado = 'activo'`);
    console.log("Total de Dependencias Activas (getTotalesDependencias):", totalDepActivas);

    // Consulta total de dependencias inactivas
    const [totalDepInactivas] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} WHERE estado = 'inactivo'`);
    console.log("Total de Dependencias Inactivas (getTotalesDependencias):", totalDepInactivas);

    return {
      totalDependencias: totalDependencias[0].total,
      totalDepActivas: totalDepActivas[0].total,
      totalDepInactivas: totalDepInactivas[0].total,
    };
  } catch (error) {
    console.error("Error al obtener los totales de dependencias (getTotalesDependencias):", error.message);
    throw error;
  }
};