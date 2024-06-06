// Desactivar la caja del cielo para poder ajustar el color de fondo
// viewer.scene.skyBox.show = false;

$(document).ready(function () {
    var selectedFile = null; // Variable global para almacenar el archivo seleccionado.

    // Configura el controlador de eventos para el botón de selección de archivos.
    $("#fileInput").on("change", function () {
        console.log("Archivo seleccionado:", this.files[0]);
        selectedFile = this.files[0];

        // Mostrar el nombre del archivo seleccionado debajo del botón.
        if (selectedFile) {
            $("#selectedFileName").text(" " + selectedFile.name).show();
            $("#selectedFileName").css("text-align", "center");
        } else {
            $("#selectedFileName").hide().text("");
        }
    });

    // Configura el controlador de eventos para el botón "Load Files".
    $("#saveFile").on("click", function () {
        if (selectedFile) {
            // Llama a la función loadFile() para cargar el archivo.
            loadFile(selectedFile);
        } else {
            /*   alert("Por favor, selecciona un archivo primero.");*/
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, selecciona un archivo primero",
                showConfirmButton: false,
                timer: 3000
            });
        }
    });

    let c = 0;

    function loadFile(file) {
        var formData = new FormData();
        formData.append("file_Key", file);

        jQuery.ajax({
            url: "/Gis/LoadFile",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                let datac = data.makehtml;
                let namedata = data.nombreArchivo;
                let namesin = data.nombresin;
                let alert = data.alert;
                console.log( alert);
                console.log("Respuesta del servidor:", data);
                /* alert(data.mensaje);*/
                if (alert === 1) { 
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: data.mensaje1,
                    showConfirmButton: false,
                    timer: 3000
                });
            }else if (alert==2){

                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: data.mensaje2,
                    showConfirmButton: false,
                    timer: 6000
                });
            }
                console.log("Mensaje recibido:", data.mensaje);
                console.log("Nombre del archivo:", namedata);

                if (datac === 1) {
                    c = c + 1;
                    var fileId = "data" + c; // Genera un nuevo ID único
                    var label = namesin;
                    var newItem =
                        `<div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id2="${fileId}" name="cesiumLayouts" value="${fileId}">
                            <label class="form-check-label" for="${fileId}">${label}</label>
                        </div>`;

                    // Agregar el nuevo elemento al DOM
                    var uli = $("ul.menuviewer2");
                    uli.append(newItem);

                    // Almacena información sobre el nuevo elemento en localStorage
                    

                    //var storedData = JSON.parse(localStorage.getItem("checkboxes")) || {};
                    //storedData[fileId] = {
                    //    label: label,
                    //    namedata: namedata
                    //};
                    //localStorage.setItem("checkboxes", JSON.stringify(storedData));


                      closeModal1();
                    render(fileId, namedata);
                   

                } else {
                    console.log("Error en la respuesta del servidor");
                }
            },


            error: function (xhr, status, error) {
                console.log("Error en la solicitud AJAX:", error);
            }
        });
    }

    //// Función para cargar elementos checkbox almacenados en localStorage y renderizar
    //function loadAndRenderStoredCheckboxes() {
    //    var storedData = JSON.parse(localStorage.getItem("checkboxes")) || {};
    //    var uli = $("ul.menuviewer2");

    //    $.each(storedData, function (fileId, data) {
    //        var label = data.label;
    //        var namedata = data.namedata;

    //        var newItem =
    //            `<div class="form-check form-switch">
    //            <input class="form-check-input" type="checkbox" id="${fileId}" name="potreeLayouts" value="${fileId}">
    //            <label class="form-check-label" for="${fileId}">${label}</label>
    //        </div>`;
    //        uli.append(newItem);

    //        // Llama a la función render con los datos almacenados
    //        render(fileId, namedata);
    //    });
    //}


    //// Llama a la función para cargar elementos almacenados en localStorage y renderizar
    //loadAndRenderStoredCheckboxes();








});








