$(document).ready(function () {
    // Sección para el botón de eliminar archivo
    $("#deletefile").on("click", function () {
        deletefile();
    });
});

function deletefile() {
    // Función para eliminar el archivo mediante una solicitud AJAX
    jQuery.ajax({
        url: "/Lidar/LoadFile",
        method: "POST",
        
        success: function (data) {
            // Borra los elementos checkbox del localStorage
            localStorage.removeItem("checkboxes");
            location.reload(true);
            console.log("Carpetas eliminadas exitosamente.");
        },
        error: function () {
            console.error("Ocurrió un error al intentar eliminar las carpetas.");
        }
    });
}

//--------------------------------------------------------------------------------

$(document).ready(function () {
    // Sección para el botón de recargar
    $("#reloadess").on("click", function () {
        reload();
    });
});

function reload() {
    // Función para recargar la página
    location.reload(true);
}

//--------------------------------------------------------------------------------

$(document).ready(function () {
    // Sección para el botón Home
    $("#Homeb").on("click", function () {
        poshome();
    });
});

function poshome() {
    // Función para llevar la cámara de Cesium a la posición inicial (Home)
    cesiumViewer.camera.flyHome();
}

//---------------------------------------------------------------------------------

// Funciones para el manejo de un modal
function toggleMapModal() {
    const mapModal = document.getElementById('mapModal');
    mapModal.style.display = mapModal.style.display === 'block' ? 'none' : 'block';
}

function closeMapModal() {
    document.getElementById('mapModal').style.display = 'none';
}



//--------------------------------------------------------------------------------

$(document).ready(function () {
    // Sección para el botón de toggle del slider
    $("#toggleButton").on("click", function () {
        toggleSlider();
    });
});

function toggleSlider() {
    // Función para activar/desactivar el slider en Cesium
    const layers = cesiumViewer.imageryLayers;
    const earthvector = Cesium.ImageryLayer.fromProviderAsync(
        new Cesium.OpenStreetMapImageryProvider({
            url: "https://a.tile.openstreetmap.org/",
        })
    );

    earthvector.splitDirection = Cesium.SplitDirection.LEFT;
    layers.add(earthvector);

    const slider = document.getElementById("slider");
    const toggleButton = document.getElementById("toggleButton");
    let moveActive = false;

    function move(movement) {
        if (!moveActive) {
            return;
        }

        const relativeOffset = movement.endPosition.x;
        const splitPosition =
            (slider.offsetLeft + relativeOffset) /
            slider.parentElement.offsetWidth;
        slider.style.left = `${100.0 * splitPosition}%`;
        cesiumViewer.scene.splitPosition = splitPosition;
    }

    const handler = new Cesium.ScreenSpaceEventHandler(slider);

    handler.setInputAction(() => {
        moveActive = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(() => {
        moveActive = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);

    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

    handler.setInputAction(() => {
        moveActive = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(() => {
        moveActive = false;
    }, Cesium.ScreenSpaceEventType.PINCH_END);

    const sliderStyle = slider.style;
    if (sliderStyle.display === "none") {
        sliderStyle.display = "block";
    } else {
        sliderStyle.display = "none";
    }
}

//--------------------------------------------------------------------------------

// Sección para cambiar el mapa en Cesium
function changeMap(mapType) {
    cesiumViewer.imageryLayers.removeAll();

    // Cambiar el mapa según el tipo seleccionado
    if (mapType === 'mapa1') {
        const mapa1 = Cesium.ImageryLayer.fromProviderAsync(
            Cesium.IonImageryProvider.fromAssetId(2)
        );

        cesiumViewer.imageryLayers.add(mapa1);

    } else if (mapType === 'mapa2') {
        const mapa2 = Cesium.ImageryLayer.fromProviderAsync(
            Cesium.IonImageryProvider.fromAssetId(3)
        );

        cesiumViewer.imageryLayers.add(mapa2);

    } else if (mapType === 'mapa3') {
        const mapa3 = Cesium.ImageryLayer.fromProviderAsync(
            Cesium.IonImageryProvider.fromAssetId(4)
        );

        cesiumViewer.imageryLayers.add(mapa3);

    } else if (mapType === 'mapa4') {
        // ...

    } else if (mapType === 'mapa5') {
        // ...

    } else if (mapType === 'mapa6') {
        cesiumViewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.opentopomap.org/'
        }));

    } else if (mapType === 'mapa7') {
        cesiumViewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        }));

    } else if (mapType === 'none') {
        // Nada
    }

    closeMapModal();
}

//--------------------------------------------------------------------------------------------------------

// Funciones para manejar el evento de clic en el botón de abrir/cerrar el modal
$(document).ready(function () {
    $("#openmodal").on("click", function () {
        openModal();
    });
});

$(document).ready(function () {
    $("#closew").on("click", function () {
        closeModal();
    });
});
function openModal() {
    // Función para abrir un modal
    var modal = document.getElementById("myModal");
    var overlay = document.getElementById("overlay");
    modal.style.display = "block";
    overlay.style.display = "block";
}

function closeModal() {
    // Función para cerrar un modal
    var modal = document.getElementById("myModal");
    var overlay = document.getElementById("overlay");
    modal.style.display = "none";
    overlay.style.display = "none";
}

//-------------------



$(document).ready(function () {
    // Sección para el botón de recargar
    $("#changeScene").on("click", function () {
        changeSceneMode();
    });
});




function changeSceneMode() {
    var scene = cesiumViewer.scene;
    var currentMode = scene.mode;

    // Cambia entre 3D y 2D
    scene.mode = (currentMode === Cesium.SceneMode.SCENE3D) ? Cesium.SceneMode.SCENE2D : Cesium.SceneMode.SCENE3D;
}