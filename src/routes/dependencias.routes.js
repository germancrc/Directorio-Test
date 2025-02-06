import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as dependenciasController from "../controllers/dependencias.controller.js";

const router = Router();

router.get("/api/dependencias", checkAuth, dependenciasController.getDependencias);


// Create dependencia
router.post(
    "/api/dependencias",
    checkAuth,
    dependenciasController.createDependencia
  );
  
  // Update specific dependencia
  router.post(
    "/api/dependencias/:dep",
    checkAuth,
    dependenciasController.updateDependencia
  );
  



export default router;