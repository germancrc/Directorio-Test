let extConfigTable;
let userConfigTable;

//mostrar loader
/* const loader = document.getElementById('loader');
const content = document.getElementById('content'); */

/* document.addEventListener("DOMContentLoaded", function() {
    loader.style.display = 'block';
    content.style.display = 'none';
});
 */

const switchElement = document.getElementById("switchThemeColor");

if (switchElement) {
  // Set default theme to dark
  if (document.documentElement.getAttribute("data-bs-theme") === "light") {
    switchElement.checked = true;
  }

  // Cambiar el tema global al usar el switch
  switchElement.addEventListener("change", function () {
    const newTheme = this.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // Guardar el tema en localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    switchElement.checked = savedTheme === "dark";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector(".logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault(); // Evita la redirección predeterminada

      const confirmation = confirm(
        "¿Estás seguro de que deseas cerrar sesión?"
      );
      if (confirmation) {
        // Redirige a la URL de logout si se confirma
        window.location.href = logoutButton.getAttribute("data-logout-url");
      }
    });
  }
});

// Get the viewport height
var viewportHeight = window.innerHeight;

function getPageLengthBasedOnViewport() {
  const viewportHeight = window.innerHeight;

  // Define fixed pageLength values based on viewport height
  if (viewportHeight < 900) {
    return 10;
  } else {
    return 20;
  }
}

////////////////////////////////TABLA EXTENSIONES /////////////////////////////////////////////////////

function loadTableExtConfig() {
  const pageLength = getPageLengthBasedOnViewport();

  extConfigTable = new DataTable("#ext-config", {
    ajax: {
      url: "/api/extensionesAdm",
      dataSrc: "extModOficinas",
    },
    lengthMenu: [10, 15, 20, 25, 50, 75, 100],
    pageLength: pageLength,
    language: {
      url: "/data/tablaMx.json",
      info: "Mostrando _START_ a _END_ de _TOTAL_",
      infoEmpty: "Mostrando 0 a 0 de 0",
      infoFiltered: "(Filtrado de _MAX_ en total)",
      lengthMenu: "Mostrar _MENU_ extensiones",
      zeroRecords: "No se encontraron extensiones",
    },
    columns: [
      { title: "EXT", data: 0 }, // ext
      { title: "NOMBRE", data: 1 }, // nombre
      { title: "DEPARTAMENTO", data: 2 }, // departamento
      { title: "POSICION", data: 3 }, // posicion
      {
        title: "ESTADO",
        data: 5, // estado
        render: function (data, type, row) {
          const estado = data; // Usar directamente el valor de la columna "estado"
          return estado === "activo"
            ? `<span class="badge text-bg-success p-2 shadow">ACTIVA</span>`
            : `<span class="badge text-bg-danger p-2 shadow">INACTIVA</span>`;
        },
      },
      {
        title: "TIPO TEL",
        data: 6, // índice de la columna en los datos
        render: function (data, type, row) {
          // Convertir el dato a mayúsculas
          return data ? data.toUpperCase() : "";
        },
      },
      {
        title: "DEPEND.",
        data: 7, // índice de la columna en los datos
        render: function (data, type, row) {
          // Convertir el dato a mayúsculas
          return data ? data.toUpperCase() : "";
        },
      },
      {
        title: "EDITAR",
        data: null, // No se usa una columna específica
        render: function (data, type, row) {
          return `
            <a href="/extensiones/editar?ext=${row[0]}" 
              class="btn btn-sm btn-warning edit-btn shadow btnEdit px-4" role="button">
              <i class="bi bi-pencil-square"></i>
            </a>
          `;
        },
      },
    ],
  });
}
////////////////////////////////TABLA USUARIOS /////////////////////////////////////////////////////

function loadTableUserConfig() {
  const pageLength = getPageLengthBasedOnViewport();

  userConfigTable = new DataTable("#user-config", {
    ajax: {
      url: "/api/usuarios",
      dataSrc: "usuariosConfig", // La respuesta será los datos sin el campo 'password'
    },
    lengthMenu: [10, 15, 20, 25, 50, 75, 100],
    pageLength: pageLength,
    language: {
      url: "/data/tablaMx.json",
      info: "Mostrando _START_ a _END_ de _TOTAL_",
      infoEmpty: "Mostrando 0 a 0 de 0",
      infoFiltered: "(Filtrado de _MAX_ en total)",
      lengthMenu: "Mostrar _MENU_ extensiones",
      zeroRecords: "No se encontraron extensiones",
    },
    columnDefs: [
      {
        targets: [4, 7], // Columnas ocultas si están en la respuesta
        visible: false,
        searchable: false,
      },
      {
        targets: [0, 1, 2, 3, 4, 5, 6], // Clases de alineación
        className: 'text-center-vertical text-left', // Combinar clases
      },
    ],
    columns: [
      { title: "ID COLAB" },
      { title: "NOMBRE" },
      { title: "USUARIO" },
      { title: "CORREO" },
      { title: "PROPIEDAD" },
      {
        title: "ROL",
        render: function (data, type, row) {
          return data === "tectel"
            ? "Técnico"
            : data === "admin"
            ? "Admin"
            : data;
        },
      },
      {
        title: "ESTADO",
        render: function (data, type, row) {
          return data === "activo"
            ? `<span class="badge text-bg-success">ACTIVA</span>`
            : `<span class="badge text-bg-danger">INACTIVA</span>`;
        },
      },
      { title: "MODIFICADO" },
      {
        title: "EDITAR",
        render: function (data, type, row) {
          return `
            <a href="/usuarios/editar?user=${row[0]}" 
              class="btn btn-sm btn-warning edit-btn shadow-sm btnEdit px-4" role="button">
              <i class="bi bi-pencil-square"></i>
            </a>
          `;
        },
      },
    ],
  });
}

////////////////////////////////TABLA 10 CAMBIOS /////////////////////////////////////////////////////
function loadTableCambios() {
  // Mostrar el loader
  $("#loader").show();
  $("#cambios").hide(); // Ocultar la tabla mientras se carga

  // Obtener el valor de 'codigoPropiedad' desde el campo oculto
  const codigoPropiedad = document.getElementById("codigoPropiedad").value;

  // Verificar que 'codigoPropiedad' esté presente
  if (!codigoPropiedad) {
    console.error("El campo 'codigoPropiedad' es requerido.");
    $("#loader").hide(); // Ocultar el loader si hay un error
    return;
  }

  $.ajax({
    url: `/api/cambios?propiedad=${codigoPropiedad}`, // Enviar 'codigoPropiedad' como parámetro
    method: "GET",
    success: function (response) {
      // Ocultar el loader
      $("#loader").hide();

      if (response.hasData && response.cambiosConfig.length > 0) {
        // Si hay datos, inicializa la tabla
        cambiosTable = new DataTable("#cambios", {
          data: response.cambiosConfig, // Usar los datos directamente
          pageLength: 10, // Fijar el número de filas a 10
          language: {
            url: "/data/tablaMx.json",
            zeroRecords: "No se encontraron cambios",
          },
          lengthMenu: [], // Eliminar la opción de cambiar el número de filas
          paging: false, // Desactivar la paginación
          searching: false, // Desactivar la búsqueda
          ordering: true, // Habilitar ordenación
          order: [[6, 'desc']], // Ordenar por la fecha de modificación (índice 6) de forma descendente
          info: false, // Eliminar la línea de "Mostrando 1 a 2 de 2 entradas"
          columnDefs: [
            {
              targets: [0], // Columnas ocultas si están en la respuesta
              visible: false,
              searchable: false,
            },
            {
              targets: [0, 1, 2, 3, 4, 5, 6], // Clases de alineación
              className: "text-center-vertical",
              orderable: false, // Deshabilitar la ordenación
            },
          ],
          columns: [
            { title: "ID", data: 0 },
            { title: "EXTENSIÓN", data: 1 },
            {
              title: "CAMPO",
              data: 2,
              render: function (data, type, row) {
                if (row[2] === "activo") {
                  return "estado"; // Si el campo es "activo", mostrar "estado"
                } else if (row[2] === "tipo") {
                  return "tipo tel"; // Si el campo es "tipo", mostrar "tipo tel"
                } else {
                  return data; // En cualquier otro caso, mostrar el valor original
                }
              },
            },
            {
              title: "VALOR ANTERIOR",
              data: 3,
              render: function (data, type, row) {
                if (row[2] === "activo") {
                  return data === "si" ? `ACTIVA` : `INACTIVA`;
                }
                return data;
              },
            },
            {
              title: "VALOR NUEVO",
              data: 4,
              render: function (data, type, row) {
                if (row[2] === "activo") {
                  return data === "si" ? `ACTIVA` : `INACTIVA`;
                }
                return data;
              },
            },
            { title: "MODIFICADO POR", data: 5 },
            {
              title: "FECHA MODIFICACIÓN",
              data: 6,
              render: function (data) {
                if (!data) return "";
                const date = new Date(data);
                const dia = date.getDate().toString().padStart(2, "0");
                const mes = (date.getMonth() + 1).toString().padStart(2, "0");
                const año = date.getFullYear().toString().slice(-2);
                const hora = date.getHours();
                const minutos = date.getMinutes().toString().padStart(2, "0");
                const segundos = date.getSeconds().toString().padStart(2, "0");
                const ampm = hora >= 12 ? "p.m." : "a.m.";
                const hora12 = (hora % 12 || 12).toString().padStart(2, "0");
                return `${dia}/${mes}/${año} ${hora12}:${minutos}:${segundos} ${ampm}`;
              },
            },
          ],
        });

        // Mostrar la tabla después de inicializarla
        $("#cambios").show();
      } else {
        // Si no hay datos, ocultar solo el encabezado <h3> con ID "cambiosExt"
        $("#cambiosExt").hide(); // Oculta el encabezado específico
        $("#cambios").closest(".card").hide(); // Oculta la tabla
        $("#cambios").before('<div class="alert alert-warning">No se encontraron cambios recientes.</div>');
      }
    },
    error: function (error) {
      console.error("Error al cargar los datos de la tabla:", error);
      $("#loader").hide(); // Ocultar el loader en caso de error
    },
  });
}

////////////////////////////////TABLA TODOS CAMBIOS /////////////////////////////////////////////////////
function loadTableTodosCambios() {
  const pageLength = getPageLengthBasedOnViewport();
  // Mostrar el loader
  $("#loader").show();
  $("#reg-cambios").hide(); // Ocultar la tabla mientras se carga

  // Obtener el valor de 'codigoPropiedad' desde el campo oculto
  const codigoPropiedad = document.getElementById("codigoPropiedad").value;

  // Verificar que 'codigoPropiedad' esté presente
  if (!codigoPropiedad) {
    console.error("El campo 'codigoPropiedad' es requerido.");
    $("#loader").hide(); // Ocultar el loader si hay un error
    return;
  }

  $.ajax({
    url: `/api/cambios-all?propiedad=${codigoPropiedad}`, // Enviar 'codigoPropiedad' como parámetro
    method: "GET",
    success: function (response) {
      console.log("Respuesta de la API:", response); // Verifica la respuesta
      // Ocultar el loader
      $("#loader").hide();

      if (response.hasData && response.cambiosTodos && response.cambiosTodos.length > 0) {
        // Si hay datos, inicializa la tabla
        const cambiosAllTable = new DataTable("#reg-cambios", {
          data: response.cambiosTodos, // Usar los datos directamente
          language: {
            url: "/data/tablaMx.json",
            info: "Mostrando _START_ a _END_ de _TOTAL_",
            infoEmpty: "Mostrando 0 a 0 de 0",
            infoFiltered: "(Filtrado de _MAX_ en total)",
            lengthMenu: "Mostrar _MENU_ extensiones",
            zeroRecords: "No se encontraron extensiones",
          },
          lengthMenu: [10, 15, 20, 25, 50, 75, 100],
          pageLength: pageLength,
          order: [[6, 'desc']], // Ordenar por la fecha de modificación (índice 6) de forma descendente
          columnDefs: [
            {
              targets: [0], // Columnas ocultas si están en la respuesta
              visible: false,
              searchable: false,
            },
            {
              targets: [0, 1, 2, 3, 4, 5, 6], // Clases de alineación
              className: "text-center-vertical",
              orderable: false, // Deshabilitar la ordenación
            },
          ],
          columns: [
            { title: "ID", data: 0 },
            { title: "EXTENSIÓN", data: 1 },
            {
              title: "CAMPO",
              data: 2,
              render: function (data, type, row) {
                if (row[2] === "activo") {
                  return "estado"; // Si el campo es "activo", mostrar "estado"
                } else if (row[2] === "tipo") {
                  return "tipo tel"; // Si el campo es "tipo", mostrar "tipo tel"
                } else {
                  return data; // En cualquier otro caso, mostrar el valor original
                }
              },
            },
            {
              title: "VALOR ANTERIOR",
              data: 3,
              render: function (data, type, row) {
                if (row[2] === "activo") {
                  return data === "si" ? `ACTIVA` : `INACTIVA`;
                }
                return data;
              },
            },
            {
              title: "VALOR NUEVO",
              data: 4,
              render: function (data, type, row) {
                if (row[2] === "activo") {
                  return data === "si" ? `ACTIVA` : `INACTIVA`;
                }
                return data;
              },
            },
            { title: "MODIFICADO POR", data: 5 },
            {
              title: "FECHA MODIFICACIÓN",
              data: 6,
              render: function (data) {
                if (!data) return "";
                const date = new Date(data);
                const dia = date.getDate().toString().padStart(2, "0");
                const mes = (date.getMonth() + 1).toString().padStart(2, "0");
                const año = date.getFullYear().toString().slice(-2);
                const hora = date.getHours();
                const minutos = date.getMinutes().toString().padStart(2, "0");
                const segundos = date.getSeconds().toString().padStart(2, "0");
                const ampm = hora >= 12 ? "p.m." : "a.m.";
                const hora12 = (hora % 12 || 12).toString().padStart(2, "0");
                return `${dia}/${mes}/${año} ${hora12}:${minutos}:${segundos} ${ampm}`;
              },
            },
          ],
        });

        // Mostrar la tabla después de inicializarla
        $("#reg-cambios").show();
      } else {
        // Si no hay datos, ocultar solo el encabezado <h3> con ID "cambiosExt"
        $("#cambiosExt").hide(); // Oculta el encabezado específico
        $("#reg-cambios").closest(".card").hide(); // Oculta la tabla
        $("#reg-cambios").before('<div class="alert alert-warning">No se encontraron cambios recientes.</div>');
      }
    },
    error: function (error) {
      console.error("Error al cargar los datos de la tabla:", error);
      $("#loader").hide(); // Ocultar el loader en caso de error
    },
  });
}


document.addEventListener("DOMContentLoaded", () => {
  loadTableExtConfig();
  loadTableUserConfig();
  loadTableCambios();
  loadTableTodosCambios();
});

//rellenar dependencias

document.addEventListener("DOMContentLoaded", async () => {
  const dependenciaAddSelect = document.getElementById("dependencia-add");
  const dependenciaEditSelect = document.getElementById("dependencia-edit");

  if (dependenciaAddSelect || dependenciaEditSelect) {
    try {
      const response = await fetch("/api/dependencias");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dependencias = await response.json();

      // Función para normalizar valores (convertir a minúsculas)
      const normalize = (value) => value.toLowerCase();

      if (dependenciaAddSelect) {
        dependencias.forEach((dep) => {
          const option = document.createElement("option");
          option.value = dep; // El valor sigue siendo en minúsculas
          option.textContent = dep.toUpperCase(); // Mostrar en mayúsculas
          dependenciaAddSelect.appendChild(option);
        });
      }

      if (dependenciaEditSelect) {
        const currentDependencia = dependenciaEditSelect.getAttribute("data-current-value");
        const normalizedCurrentDependencia = normalize(currentDependencia); // Normalizar el valor actual

        dependencias.forEach((dep) => {
          const option = document.createElement("option");
          option.value = dep; // El valor sigue siendo en minúsculas
          option.textContent = dep.toUpperCase(); // Mostrar en mayúsculas

          // Comparar valores normalizados
          if (normalize(dep) === normalizedCurrentDependencia) {
            option.selected = true;
          }

          dependenciaEditSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error al cargar dependencias:", error);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los toasts en la página
  const toasts = document.querySelectorAll(".toast");
  toasts.forEach((toast) => {
    // Configurar un temporizador de 5 segundos para cada toast
    setTimeout(() => {
      toast.classList.remove("show"); // Ocultar visualmente el toast
      toast.addEventListener("transitionend", () => {
        toast.remove(); // Eliminar el toast del DOM
      });
    }, 5000); // 5 segundos
  });
});

const selector = document.getElementById("propiedadesSelector");

if (selector) {
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch('/api/propiedades');
            if (!response.ok) throw new Error("Error al obtener las propiedades");

            const propiedades = await response.json();

            // Poblar el selector con las propiedades
            propiedades.forEach(({ codigo, propiedad }) => {
                const option = document.createElement("option");
                option.value = codigo; // Asegúrate de que el valor sea el código de la propiedad
                option.textContent = propiedad;
                selector.appendChild(option);
            });

            // Recuperar y establecer el valor seleccionado previo
            const savedValue = sessionStorage.getItem("selectedProperty");
            console.log("Valor guardado:", savedValue);
            if (savedValue) {
                selector.value = savedValue;
            }

            // Escuchar cambios en el selector y guardar el valor en sessionStorage
            selector.addEventListener("change", () => {
                sessionStorage.setItem("selectedProperty", selector.value);
            });
        } catch (error) {
            console.error("Error:", error.message);
        }
    });
}


///////////////////OJO DEL LOGIN//////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById("togglePassword");
  const inputPassword = document.getElementById("inputPassword");

  if (togglePassword && inputPassword) {
    togglePassword.addEventListener("click", function () {
      const type = inputPassword.getAttribute("type") === "password" ? "text" : "password";
      inputPassword.setAttribute("type", type);

      const icon = togglePassword.querySelector("i");
      if (type === "password") {
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
      } else {
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
      }
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");
  const currentPath = window.location.pathname;

  sidebarLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});
