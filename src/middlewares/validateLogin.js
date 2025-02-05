export const validateLogin = (req, res, next) => {
  const { username, password, propiedad } = req.body;

  if (!username || !password || !propiedad) {
    req.session.toast = {
      type: "danger",
      title: "Error",
      message: "Todos los campos son requeridos",
    };
    return res.redirect("/login");
  }

  if (password.length < 8) {
    req.session.toast = {
      type: "danger",
      title: "Error",
      message: "Nombre de usuario, contraseña o propiedad incorrectos.",
    };
    return res.redirect("/login");
  }

  next();
};