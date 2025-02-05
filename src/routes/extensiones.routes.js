import { Router } from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import * as extensionesController from "../controllers/extensiones.controller.js";

const router = Router();

// Get all extensions
router.get("/api/extensiones", extensionesController.getExtensiones);

// Get admin extensions
router.get(
  "/api/extensionesAdm",
  extensionesController.getAllExtensionesForAdmin
);

// Create extension
router.post(
  "/api/extensiones",
  checkAuth,
  extensionesController.createExtension
);

// Update specific extension
router.post(
  "/api/extensiones/:ext",
  checkAuth,
  extensionesController.updateExtension
);

// Delete specific extension
/* router.delete(
  "/api/extensiones/:ext",
  checkAuth,
  extensionesController.deleteExtension
); */

export default router;
