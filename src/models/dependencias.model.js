import pool from "../database/connection.js";

//obteer dependencias

export const getDependencias = async () => {
    try {
      const [rows] = await pool.query("SELECT depend_nombre FROM dependencias_hrpuj");
      return rows.map(row => row.depend_nombre); // Devuelve solo los nombres
    } catch (error) {
      console.error("Error al obtener dependencias:", error.message);
      throw error;
    }
  };