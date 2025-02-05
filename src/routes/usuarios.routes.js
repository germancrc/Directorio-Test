import { Router } from 'express';
import * as usuariosController from '../controllers/usuarios.controller.js';
import checkAuth from '../middlewares/authMiddleware.js';  // Importar el middleware
import { checkAdmin } from '../middlewares/checkAdmin.js';

const router = Router();

// Proteger las rutas de API de usuarios
router.get('/api/usuarios', checkAuth, checkAdmin, usuariosController.getUsuarios);  // Listar usuarios
router.post('/api/usuario', checkAuth, checkAdmin,usuariosController.createUsuario);  // Crear usuario
router.put('/api/usuario/:id_colab', checkAuth, checkAdmin ,usuariosController.updateUsuario);  // Actualizar usuario
router.delete('/api/usuario/:id_colab', checkAuth, checkAdmin, usuariosController.deleteUsuario);  // Eliminar usuario

export default router;
