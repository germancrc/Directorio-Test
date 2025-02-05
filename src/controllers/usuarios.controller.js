import * as usuariosModel from '../models/usuarios.model.js';

export const getUsuarios = async (req, res) => {
    try {
            // Obtener el código de propiedad de la sesión o los parámetros de la consulta
    const codigoPropiedad = req.session.propiedad || req.query.propiedad;

    if (!codigoPropiedad) {
      throw new Error("Código de propiedad no proporcionado.");
    }

    // Llamar al modelo con el código de propiedad


        const usuarios = await usuariosModel.getUsuarios(codigoPropiedad);
        res.json(usuarios);
    } catch (error) {
        console.error("Error en getUsuarios:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const createUsuario = async (req, res) => {
    try {
        const result = await usuariosModel.createUsuario(req.body);
        res.json({ message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUsuario = async (req, res) => {
    try {
        await usuariosModel.updateUsuario({ ...req.body, id_colab: req.params.id_colab });
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        await usuariosModel.deleteUsuario(req.params.id_colab);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////para el resumen

export const getResumenUsuarios = async (req) => {
    try {
      // Obtener el código de propiedad de la sesión
      const codigoPropiedad = req.session.propiedad;
  
      // Obtener datos de usuarios
      const resumenUsuarios = await usuariosModel.getTotalesUsuarios(codigoPropiedad);
      return resumenUsuarios; // Devuelve los datos
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      throw error; // Lanza el error para que sea manejado en index.js
    }
  };