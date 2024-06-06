

//------------------------------------------------------------

$(document).ready(function () {
    $("#deletefile2").on("click", function () {
        deletefile();
        
    });
});

function deletefile() {
    $.ajax({
        url: "/Gis/DeleteFile",
        method: "POST",
        success: function (data) {
          
            location.reload(true);
            console.log("Carpetas eliminadas exitosamente.");
        },
        error: function () {
            console.error("Ocurri� un error al intentar eliminar las carpetas.");
        }
    });
}

//--------------------------------------------------------------------------------

$(document).ready(function () {
    $("#reloadess").on("click", function () {
        reload();
    });
});

function reload() {
    location.reload(true);
}

//--------------------------------------------------------------------------------

let customFunctionActivated = false;
let tileset;



$(document).ready(function () {
    $("#customG").on("click", function () {
        toggleCustomFunction();
    });
});

async function toggleCustomFunction() {
    if (customFunctionActivated) {
        // Si la funci�n est� activada, desact�vala
        deactivateCustomFunction();
    } else {
        // Si la funci�n no est� activada, act�vala
        await activateCustomFunction();
    }
}

async function activateCustomFunction() {
    // Activa la funci�n personalizada
    const scene = viewer.scene;

    viewer.camera.flyTo({
        duration: 0,
        destination: new Cesium.Cartesian3(
            762079.3157173397,
            -28363749.882652905,
            19814354.842565004
        ),
        orientation: {
            direction: new Cesium.Cartesian3(
                -0.022007098944236157,
                0.819079900508189,
                -0.5732571885110153
            ),
            up: new Cesium.Cartesian3(
                -0.015396759850986286,
                0.5730503851893346,
                0.8193754913471885
            ),
        },
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });

    try {
        tileset = await Cesium.Cesium3DTileset.fromIonAssetId(691510, {
            maximumScreenSpaceError: 4,
        });
        scene.primitives.add(tileset);
    } catch (error) {
        console.log(`Error loading tileset: ${error}`);
    }

    // --- Custom Shader ---

    const customShader = new Cesium.CustomShader({
        uniforms: {
            u_time: {
                type: Cesium.UniformType.FLOAT,
                value: 0,
            },
        },
        fragmentShaderText: `
              void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
              {
                  int featureId = fsInput.featureIds.featureId_0;
                  vec3 positionWC = fsInput.attributes.positionWC / 6.3e6;
                  if (featureId == 60)
                  {
                      float wave = sin(14.0 * positionWC.z - u_time);
                      wave = 0.5 + 0.5 * sin(10.0 * wave * positionWC.z - u_time);
                      material.diffuse = mix(material.diffuse, material.diffuse * 3.0, wave);
                  }
              }
          `,
    });

    const startTime = performance.now();
    const customShaderUpdate = function () {
        const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
        customShader.setUniform("u_time", elapsedTimeSeconds);
    };

    viewer.scene.postUpdate.addEventListener(function () {
        customShaderUpdate();
    });

    // --- Picking ---

    let enablePicking = true;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    const metadataOverlay = document.createElement("div");
    viewer.container.appendChild(metadataOverlay);
    metadataOverlay.className = "backdrop";
    metadataOverlay.style.display = "none";
    metadataOverlay.style.position = "absolute";
    metadataOverlay.style.bottom = "0";
    metadataOverlay.style.left = "0";
    metadataOverlay.style["pointer-events"] = "none";
    metadataOverlay.style.padding = "4px";
    metadataOverlay.style.backgroundColor = " #FFFFFF";
    metadataOverlay.style.whiteSpace = "pre-line";
    metadataOverlay.style.fontSize = "16px";
    metadataOverlay.style.borderRadius = "4px";

    let tableHtmlScratch;
    let i;

    handler.setInputAction(function (movement) {
        if (enablePicking) {
            const feature = scene.pick(movement.endPosition);
            if (feature instanceof Cesium.Cesium3DTileFeature) {
                metadataOverlay.style.display = "block";
                metadataOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.endPosition.y}px`;
                metadataOverlay.style.left = `${movement.endPosition.x}px`;

                tableHtmlScratch =
                    "<table><thead><tr><th><tt>Property</tt></th><th><tt>Value</tt></th></tr></thead><tbody>";

                const propertyIds = feature.getPropertyIds();
                const length = propertyIds.length;
                for (let i = 0; i < length; ++i) {
                    const propertyId = propertyIds[i];
                    const propertyValue = feature.getProperty(propertyId);
                    tableHtmlScratch += `<tr><td><tt>${propertyId}</tt></td><td><tt>${propertyValue}</tt></td></tr>`;
                }
                tableHtmlScratch += "</tbody></table>";
                metadataOverlay.innerHTML = tableHtmlScratch;
            } else {
                metadataOverlay.style.display = "none";
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Apply Custom Shader
    tileset.customShader = customShader;
    tileset.debugShowBoundingVolume = false;
    tileset.style = undefined;

    // Disable picking
    enablePicking = false;

    customFunctionActivated = true;
}

function deactivateCustomFunction() {
    // Desactiva la funci�n personalizada
    if (tileset) {
        viewer.scene.primitives.remove(tileset);
    }

    // Resto del c�digo de desactivaci�n

    customFunctionActivated = false;
}

  //----------------------------------------------------------
$(document).ready(function () {
    $("#toggleButton").on("click", function () {
        toggleSlider();
    });
});


function toggleSlider() {

    const layers = viewer.imageryLayers;

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
        viewer.scene.splitPosition = splitPosition;
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







    //------------------------------------------------------
    const sliderStyle = slider.style;
    if (sliderStyle.display === "none") {
        sliderStyle.display = "block";
    } else {
        sliderStyle.display = "none";
    }





}



//---------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    $("#openmodal1").on("click", function () {
        toggleModal1();
    });
});

function toggleModal1() {
    var modal = document.getElementById("myModal1");
    var button = document.getElementById("openmodal1");

    // Si el modal est� abierto, ci�rralo; de lo contrario, �brelo
    if (modal.style.display === "block") {
        closeModal1();
    } else {
        openModal1(button);
    }
}

function openModal1(button) {
    var modal = document.getElementById("myModal1");

    // Ajusta la posici�n horizontal y vertical del modal
    var leftPosition = button.offsetLeft + (button.offsetWidth - modal.offsetWidth) / 2 + 130; // Ajusta seg�n sea necesario
    var topPosition = button.offsetTop + button.offsetHeight + 30; // Ajusta seg�n sea necesario

    modal.style.left = leftPosition + "px";
    modal.style.top = topPosition + "px";

    modal.style.display = "block";
}

$(document).ready(function () {
    $("#closew").on("click", function () {
        closeModal1();
    });
});

function closeModal1() {
    var modal = document.getElementById("myModal1");

    modal.style.display = "none";
}


//----------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    // Utilizamos el evento de clic en el bot�n y en el icono de carpeta
    $("#openmodal2, #openmodal2 i.fa-layer-group").on("click", function (event) {
        event.stopPropagation(); // Evita que el evento de clic se propague al contenedor padre
        toggleModal2();
    });

    $(document).on("click", function (event) {
        var modal = $("#myModal2");
        // Cerrar el modal si se hace clic en cualquier parte de la p�gina, excepto en el modal y en el bot�n de apertura
        if (!$(event.target).closest(modal).length && !$(event.target).is("#openmodal2, #openmodal2 i.fa-layer-group")) {
            modal.hide();
        }
    });
});

function toggleModal2() {
    var modal = $("#myModal2");
    var button = document.getElementById("openmodal1"); // Puedes ajustar esto seg�n tu estructura

    // Ajusta la posici�n horizontal y vertical del modal
    var leftPosition = button.offsetLeft + (button.offsetWidth - modal.width()) / 2 + 250; // Ajusta seg�n sea necesario
    var topPosition = button.offsetTop + button.offsetHeight + 30; // Ajusta seg�n sea necesario

    modal.css({
        left: leftPosition + "px",
        top: topPosition + "px"
    });

    modal.toggle();
}



 //--------------------------------------------------------------------------------------------


let coordinateFunctionActivated = false;
let tileCoordinatesLayerInstance;
let gridLayerInstance;

$(document).ready(function () {
    $("#cord").on("click", function () {
        toggleCoordinateFunction();
    });
});

function toggleCoordinateFunction() {
    if (coordinateFunctionActivated) {
        // Si la funci�n est� activada, desact�vala
        deactivateCoordinateFunction();
    } else {
        // Si la funci�n no est� activada, act�vala
        activateCoordinateFunction();
    }
}

function activateCoordinateFunction() {
    const gridLayer = new Cesium.GridImageryProvider({
        color: Cesium.Color.WHITE,
        alpha: 0.1,
    });

    const tileCoordinatesLayer = new Cesium.TileCoordinatesImageryProvider({
        color: Cesium.Color.RED,
    });

    gridLayerInstance = new Cesium.ImageryLayer(gridLayer);
    tileCoordinatesLayerInstance = new Cesium.ImageryLayer(tileCoordinatesLayer);

    // Agregar las capas de im�genes al globo terr�queo
    imageryLayers.add(tileCoordinatesLayerInstance);
    imageryLayers.add(gridLayerInstance);

    coordinateFunctionActivated = true;
}

function deactivateCoordinateFunction() {
    // Remover solo las capas relacionadas con la funci�n de coordenadas
    imageryLayers.remove(tileCoordinatesLayerInstance);
    imageryLayers.remove(gridLayerInstance);

    coordinateFunctionActivated = false;
}


    //----------------------------------------------------------

let fpsFunctionActivated = false;
let fpsEventListener;
const scene = viewer.scene;
const viewModel = {
    requestRenderMode: true,
    showTimeOptions: false,
    timeChangeEnabled: false,
    maximumRenderTimeChange: 0.0,
    lastRenderTime: "",
    fps: 0,
};

$(document).ready(function () {
    $("#fps").on("click", function () {
        toggleFpsFunction(scene, viewModel);  // Pasa 'scene' y 'viewModel' como par�metros
    });
});

function toggleFpsFunction(scene, viewModel) {
    if (fpsFunctionActivated) {
        // Si la funci�n est� activada, desact�vala
        deactivateFpsFunction(scene, viewModel);
    } else {
        // Si la funci�n no est� activada, act�vala
        activateFpsFunction(scene, viewModel);
    }
}

function activateFpsFunction(scene, viewModel) {
    scene.debugShowFramesPerSecond = true;

    viewModel.requestRenderMode = true;
    viewModel.showTimeOptions = false;
    viewModel.timeChangeEnabled = false;
    viewModel.maximumRenderTimeChange = 0.0;
    viewModel.lastRenderTime = "";
    viewModel.fps = 0;

    fpsEventListener = scene.postRender.addEventListener(function () {
        const currentTime = Cesium.JulianDate.now();
        const fps = scene.framerate;
        viewModel.lastRenderTime = Cesium.JulianDate.toDate(currentTime).toLocaleTimeString();
        viewModel.fps = fps;
    });

    fpsFunctionActivated = true;
}

function deactivateFpsFunction(scene, viewModel) {
    scene.debugShowFramesPerSecond = false;

    viewModel.requestRenderMode = false;

    if (fpsEventListener) {
        fpsEventListener();
    }

    fpsFunctionActivated = false;
}







