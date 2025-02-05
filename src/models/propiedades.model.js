// propiedades.model.js
import pool from "../database/connection.js";

export const getPropiedades = async () => {
    try {
        const [rows] = await pool.query("SELECT codigo, propiedad FROM propiedades");
        return rows; // Devuelve todos los campos necesarios
    } catch (error) {
        console.error("Error al obtener propiedades:", error.message);
        throw error;
    }
};

export const getPropiedadByCodigo = async (codigo) => {
    try {
        const [rows] = await pool.query("SELECT propiedad FROM propiedades WHERE codigo = ?", [codigo]);
        return rows.length > 0 ? rows[0].propiedad : null;
    } catch (error) {
        console.error("Error al obtener la propiedad por código:", error.message);
        throw error;
    }
};