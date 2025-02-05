import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as registroCambiosController from "../controllers/registroCambios.controller.js";

const router = Router();

// Get 10 cambios
router.get("/api/cambios", checkAuth, registroCambiosController.getCambios);

// Get all cambios
router.get("/api/cambios-all", checkAuth, registroCambiosController.getTodosCambios);


export default router;