// middlewares/adminMiddleware.js
export const checkAdmin = (req, res, next) => {
  if (req.session.role !== "admin") {
    // Asignar mensaje de error a res.locals
    res.locals.toast = {
      type: "danger",
      title: "Acceso Denegado",
      message: "No tienes permisos para acceder a esta sección",
    };
    return res.redirect("/config");
  }
  next();
};