import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as propiedadesController from "../controllers/propiedades.controller.js";

const router = Router();

router.get("/api/propiedades", propiedadesController.getPropiedades);



export default router;