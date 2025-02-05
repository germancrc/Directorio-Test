import * as propiedadesModel from "../models/propiedades.model.js";

export const getPropiedades = async (req, res) => {
    try {
        const propiedades = await propiedadesModel.getPropiedades();
        res.json(propiedades); // Devuelve las propiedades como JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
