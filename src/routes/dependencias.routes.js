import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as dependenciasController from "../controllers/dependencias.controller.js";

const router = Router();

router.get("/api/dependencias", checkAuth, dependenciasController.getDependencias);



export default router;