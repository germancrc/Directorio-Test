import * as registroCambiosModel from "../models/registroCambios.model.js";

export const getCambios = async (req, res) => {
  try {
    // Extraer el valor de 'propiedad' desde la solicitud (query string o parámetro)
    const { propiedad } = req.query;

    // Verificar que 'propiedad' esté presente
    if (!propiedad) {
      return res.status(400).json({ message: "El campo 'propiedad' es requerido." });
    }

    // Llamar al modelo pasando 'propiedad'
    const regCambios = await registroCambiosModel.getCambios(propiedad);

    // Enviar la respuesta al cliente
    res.json(regCambios);
  } catch (error) {
    console.error('Error en el controlador getCambios:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getTodosCambios = async (req, res) => {
  try {
    const { propiedad } = req.query;

    if (!propiedad) {
      return res.status(400).json({ message: "El campo 'propiedad' es requerido." });
    }

    const regTodosCambios = await registroCambiosModel.getTodosCambios(propiedad);
    res.json(regTodosCambios); // Devuelve la respuesta del modelo
  } catch (error) {
    console.error('Error en el controlador getCambios:', error);
    res.status(500).json({ message: error.message });
  }
};