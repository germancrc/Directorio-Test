import bcrypt from "bcryptjs";
import pool from "../database/connection.js";

export const loginUser = async (req, res) => {
  const { username, password, propiedad } = req.body;

  // Verificar que todos los datos estén presentes
  if (!username || !password || !propiedad) {
    console.log("Faltan datos en el cuerpo de la solicitud.");
    req.session.toast = {
      type: "danger",
      title: "ERROR",
      message: "Todos los datos son obligatorios.",
    };
    return res.redirect("/login");
  }

  try {
    console.log("Procesando login para usuario:", username);
    console.log("Propiedad seleccionada:", propiedad);

    // Convertir la propiedad y el nombre de usuario a minúsculas
    const propiedadNormalizada = propiedad.toLowerCase();
    const usernameNormalizado = username.toLowerCase();

    // Construir el nombre de la tabla dinámicamente
    const tableName = `usuarios_${propiedadNormalizada}`;
    console.log("Tabla a consultar:", tableName);

    // Verificar si la tabla existe
    const [tables] = await pool.query("SHOW TABLES LIKE ?", [tableName]);
    if (tables.length === 0) {
      console.log("La tabla no existe:", tableName);
      req.session.toast = {
        type: "danger",
        title: "ERROR",
        message: "Propiedad no válida.",
      };
      return res.redirect("/login");
    }

    // Consulta el usuario y verifica que esté activo y pertenezca a la propiedad seleccionada
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} WHERE LOWER(username) = ? AND propiedad = ? AND estado = "activo"`,
      [usernameNormalizado, propiedadNormalizada]
    );

    if (rows.length === 0) {
      console.log(
        "Acceso denegado: Usuario inactivo, no encontrado o no pertenece a la propiedad seleccionada:",
        username
      );
      req.session.toast = {
        type: "danger",
        title: "ERROR",
        message: "Nombre de usuario, contraseña o propiedad incorrectos.",
      };
      return res.redirect("/login");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Contraseña incorrecta para usuario:", usernameNormalizado);
      req.session.toast = {
        type: "danger",
        title: "ERROR",
        message: "Nombre de usuario, contraseña o propiedad incorrectos.",
      };
      return res.redirect("/login");
    }

    console.log("Usuario autenticado correctamente:", usernameNormalizado);
    req.session.userId = user.id_colab;
    req.session.nombre = user.nombre;
    req.session.role = user.role;
    req.session.username = user.username;
    req.session.propiedad = user.propiedad;

    console.log("Propiedad del usuario:", user.propiedad);
    console.log("Propiedad seleccionada:", propiedadNormalizada);
    console.log("Sesión configurada:", req.session);
    res.redirect("/config");
  } catch (error) {
    console.error("Error al autenticar usuario:", error.message);
    req.session.toast = {
      type: "danger",
      title: "ERROR",
      message: "Error en el servidor, inténtelo más tarde",
    };
    return res.redirect("/login"); // Asegúrate de usar return
  }
};