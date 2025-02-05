// middlewares/authMiddleware.js
const checkAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    res.locals.nombre_nav = req.session.nombre || "Usuario"; // Cambiar a 'nombre_nav'
    res.locals.role = req.session.userRole || "tectel";
    res.locals.propiedad = req.session.propiedad || "Propiedad";
    return next();
  }
  res.redirect("/login");
};

export default checkAuth;
