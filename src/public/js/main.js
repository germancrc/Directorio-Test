let extensionsTable;
let editingExt = null;

// Mostrar loader
const loader = document.getElementById('loader');
const content = document.getElementById('hotelSelected');
const aviso = document.getElementById('noHotelSelected');
const selector = document.getElementById('propiedadesSelector');

  document.addEventListener("DOMContentLoaded", function () {
    const switchElement = document.getElementById("switchThemeColor");

    if (!switchElement) {
      console.error("El switch de tema no se encontró.");
      return;
    }

    // Obtener el tema guardado o establecer 'dark' por defecto
    const savedTheme = localStorage.getItem("theme") || "dark";
    
    // Aplicar el tema guardado
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    switchElement.checked = (savedTheme === "dark");

    console.log("Tema actual:", savedTheme);

    // Evento para cambiar el tema
    switchElement.addEventListener("change", function () {
      const newTheme = this.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      console.log("Nuevo tema aplicado:", newTheme);
    });
  });



  document.addEventListener("DOMContentLoaded", function () {
    const switchElement = document.getElementById("switchThemeColor");

    if (!switchElement) {
      console.error("El switch de tema no se encontró.");
      return;
    }

    // Obtener el tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";

    // Aplicar el tema guardado
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    switchElement.checked = savedTheme === "dark";

    // Evento para cambiar el tema
    switchElement.addEventListener("change", function () {
      const newTheme = this.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  });



// Mostrar todo oculto inicialmente
document.addEventListener("DOMContentLoaded", function () {
    loader.style.display = 'block';
    content.style.display = 'none';
    aviso.style.display = 'none';  // Ocultar el aviso de inicio

    // Verificar si hay una propiedad guardada en localStorage
   /*  const propiedad = localStorage.getItem("selectedProperty"); */
    const propiedad = "hrpuj";
    console.log("Propiedad guardada:", propiedad);

    if (!propiedad) {
        // Si no hay valor guardado, mostrar el aviso y ocultar el contenido
        aviso.style.display = 'block';
        content.style.display = 'none';
        loader.style.display = 'none';
    } else {
        // Si hay valor guardado, cargar la tabla con esa propiedad
        selector.value = propiedad;
        loader.style.display = 'none';
        content.style.display = 'block';

        loadTableExt(propiedad);
    }
});

// Función para obtener la longitud de página según la altura del viewport
function getPageLengthBasedOnViewport() {
    const viewportHeight = window.innerHeight;
    console.log("Viewport height:", viewportHeight);

    // Define fixed pageLength values based on viewport height
    if (viewportHeight < 900) {
        return 10;
    } else {
        return 20;
    }
}

// Función para cargar la tabla de extensiones
async function loadTableExt(propiedad) {
    // Verificar que propiedad tenga un valor válido
    if (!propiedad) {
        console.error("No se ha seleccionado una propiedad válida.");
        return;
    }

    const pageLength = getPageLengthBasedOnViewport();

    extensionsTable = new DataTable('#extensiones', {
        destroy: true, // Reiniciar tabla si ya existe
        ajax: {
            url: `/api/extensiones?propiedad=${propiedad}`, // Enviar el código seleccionado
            dataSrc: 'extensionesOficinas',
        },
        lengthMenu: [10, 15, 20, 25, 50, 75, 100],
        pageLength: pageLength,
        language: {
            url: '/data/tablaMx.json',
            info: "Mostrando _START_ a _END_ de _TOTAL_",
            infoEmpty: "Mostrando 0 a 0 de 0",
            infoFiltered: "(Filtrado de _MAX_ en total)",
            lengthMenu: "Mostrar _MENU_ extensiones",
            zeroRecords: "No se encontraron extensiones",
        },
        columnDefs: [
            {
                targets: [0, 1, 2, 3], // Aplicar a todas las columnas
                className: 'text-center-vertical text-left', // Combinar clases
            }
        ],
        columns: [
            { title: "EXT" },
            { title: "NOMBRE" },
            { title: "DEPARTAMENTO" },
            { title: "POSICIÓN" },
        ],
    });
}

// Inicializar el selector y cargar las propiedades
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/propiedades'); // Endpoint para obtener las propiedades
        if (!response.ok) throw new Error("Error al obtener las propiedades");

        const propiedades = await response.json();

        // Agregar las propiedades al selector
        propiedades.forEach(({ codigo, propiedad }) => {
            const option = document.createElement("option");
            option.value = codigo;
            option.textContent = propiedad;
            selector.appendChild(option);
        });

        // Verificar si hay una propiedad seleccionada previamente en localStorage
        const savedValue = localStorage.getItem("selectedProperty");
        if (savedValue) {
            selector.value = savedValue;
            selector.dispatchEvent(new Event("change"));
        }

        // Manejar el cambio de selección en el selector
        selector.addEventListener("change", async () => {
            const selectedProperty = selector.value;
          
            if (!selectedProperty) {
              content.style.display = "none";
              aviso.style.display = "block"; // Mostrar el aviso si no hay propiedad seleccionada
              return;
            }
          
            aviso.style.display = "none"; // Ocultar el aviso
            loader.style.display = "block";
          
            try {
              await loadTableExt(selectedProperty);
          
              // Mostrar el contenido y aplicar el efecto fade-in
              content.style.display = "block";
              const hotelSelected = document.getElementById("hotelSelected");
          
              // Eliminar la clase para reiniciar la animación
              hotelSelected.classList.remove("fade-in");
          
              // Forzar un reflow para reiniciar la animación
              void hotelSelected.offsetWidth;
          
              // Agregar la clase para activar la animación
              hotelSelected.classList.add("fade-in");
          
            } catch (error) {
              console.error("Error al cargar extensiones:", error);
            } finally {
              loader.style.display = "none";
            }
          
            // Guardar la propiedad seleccionada en localStorage
            localStorage.setItem("selectedProperty", selectedProperty);
          });
    } catch (error) {
        console.error("Error al cargar las propiedades:", error.message);
    }
});