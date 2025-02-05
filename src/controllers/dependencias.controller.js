import * as dependenciasModel  from "../models/dependencias.model.js";

export const getDependencias = async (req, res) => {
    try {
        const dependencias = await dependenciasModel.getDependencias();
        res.json(dependencias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};