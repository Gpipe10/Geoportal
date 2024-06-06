$(document).ready(function () {
    var selectedFile = null; // Variable global para almacenar el archivo seleccionado.

    // Configura el controlador de eventos para el botón de selección de archivos.
    $("#fileInput").on("change", function () {
        console.log("Archivo seleccionado:", this.files[0]);
        selectedFile = this.files[0];

        // Mostrar el nombre del archivo seleccionado debajo del botón.
        if (selectedFile) {
            $("#selectedFileName").text(" " + selectedFile.name).show();
        } else {
            $("#selectedFileName").hide().text("");
        }
    });

    // Configura el controlador de eventos para el cambio del checkbox #gison.
    $("#formulario-container").hide();
    $("#gison").on("change", function () {
        if ($(this).prop("checked")) {
            // Función 1 cuando el checkbox está activado
            funcion1();
        } else {
            // Función 2 cuando el checkbox está desactivado
            funcion2();
        }
    });

    function funcion1() {
        // Mostrar contenedor del formulario
        $("#formulario-container").show();
    }

    function funcion2() {
        // Ocultar contenedor del formulario
        $("#formulario-container").hide();
    }

    $("#saveFile").on("click", function () {
        if (selectedFile) {
            // Verifica el estado del checkbox y llama a la función correspondiente.
            if ($("#gison").prop("checked")) {
                $("#colnone").attr("value", "null");
                if (!validarYCapturar()) {
                    loadFile(selectedFile);
                }
            } else {
                // Cambiar el valor del elemento con id "colnone" a "skybox"
                $("#colnone").attr("value", "skybox");
                capturarDatos();
                loadFile(selectedFile);
            }
        } else {
            alert("Por favor, selecciona un archivo primero.");
        }
    });

    // Función para cargar un archivo
    let c = 0;

    function loadFile(file) {
        let utmCoordinates = capturarDatos();
        var formData = new FormData();
        formData.append("file_key", file);

        jQuery.ajax({
            url: "/Lidar/LoadFile",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                let datac = data.makehtml;
                let nameWithout = data.nombreSin;
                


                console.log("Respuesta del servidor:", data);
                alert(data.mensaje);
              
                console.log("Mensaje recibido:", data.mensaje);
                console.log("Mensaje recibido:", data.mensaje);
                console.log("Nombre del archivo:", nameWithout);



                if (datac === 1) {
                    c = c + 1;
                    var fileId = "data" + c; // Genera un nuevo ID único
                    var label = nameWithout;
                    var newItem =
                        `<div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="${fileId}" name="potreeLayouts" value="${fileId}">
                            <label class="form-check-label" for="${fileId}">${label}</label>
                        </div>`;

                    // Agregar el nuevo elemento al DOM
                    var uli = $("ul.menuviewer");
                    uli.append(newItem);

                    // Almacena información sobre el nuevo elemento en localStorage
                    var storedData = JSON.parse(localStorage.getItem("checkboxes")) || {};
                    storedData[fileId] = label;
                    localStorage.setItem("checkboxes", JSON.stringify(storedData));
                  
                    render(fileId, nameWithout, utmCoordinates[0], utmCoordinates[1], utmCoordinates[2], utmCoordinates[3]);
                } else {
                    console.log("Error en la respuesta del servidor");
                }
            },
            error: function (xhr, status, error) {
                console.log("Error en la solicitud AJAX:", error);
            }
        });
    }

    // Función para validar y capturar datos, devuelve true si los campos están vacíos.
    function validarYCapturar() {
        var latitud = document.getElementById('latitud').value;
        var longitud = document.getElementById('longitud').value;
        var zona = document.getElementById('zona').value;

        if (latitud.trim() === "" || longitud.trim() === "" || zona.trim() === "") {
            alert("Todos los campos son obligatorios. Si no posee las coordenadas de la nube de puntos desactive la opción GIS.");

            

            return true; // Campos vacíos
        } else {
            capturarDatos();
            return false; // Campos no están vacíos
        }
    }

    function capturarDatos() {
        var latitud = parseFloat(document.getElementById('latitud').value);
        var longitud = parseFloat(document.getElementById('longitud').value);
        var zona = parseInt(document.getElementById('zona').value);
        var detect = 0;

        // Verifica si alguno de los campos está vacío
        if (isNaN(latitud) || isNaN(longitud) || isNaN(zona)) {
            var utmCoordinates = wgs84ToUtm(0, 0, 0, detect = 0);
            console.log('Coordenadas UTM:', utmCoordinates);
            console.log('Uno o más campos están vacíos.');
        } else {
            // Si todos los campos están llenos y son números válidos
            var utmCoordinates = wgs84ToUtm(longitud, latitud, zona);
            console.log('Coordenadas UTM:', utmCoordinates);
        }

        // Retorna las coordenadas UTM y la variable de detección
        return utmCoordinates;
    }

    // Función para cargar elementos checkbox almacenados en localStorage y renderizar
    // Función para cargar elementos checkbox almacenados en localStorage y renderizar
    function loadAndRenderStoredCheckboxes() {
        var storedData = JSON.parse(localStorage.getItem("checkboxes")) || {};
        var uli = $("ul.menuviewer");

        $.each(storedData, function (fileId, label) {
            var newItem =
                `<div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="${fileId}" name="potreeLayouts" value="${fileId}">
                <label class="form-check-label" for="${fileId}">${label}</label>
            </div>`;
            uli.append(newItem);

            // Obtén las coordenadas UTM correspondientes a este checkbox almacenado
            var utmCoordinates = capturarDatos();

            // Llama a la función render con los datos almacenados
            render(fileId, label, utmCoordinates[0], utmCoordinates[1], utmCoordinates[2], utmCoordinates[3]);
        });
    }

   

    // Llama a la función para cargar elementos almacenados en localStorage y renderizar
    loadAndRenderStoredCheckboxes();
});

// Función para convertir coordenadas WGS84 a UTM
function wgs84ToUtm(lon, lat, zone, detect = 1) {
    const utmProjection = `+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
    const utmCoordinates = proj4(proj4.defs.WGS84, utmProjection, [lon, lat]);
    const utm_x = utmCoordinates[0];
    const utm_y = utmCoordinates[1];

    return [utm_x, utm_y, zone, detect];
}
