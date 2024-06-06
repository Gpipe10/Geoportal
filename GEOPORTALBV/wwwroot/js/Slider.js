$(document).ready(function () {
    $("#toggleButton").on("click", function () {
        toggleSlider();
    });
});


//const layers = viewer.imageryLayers;

//const earthvector = Cesium.ImageryLayer.fromProviderAsync(
//    new Cesium.OpenStreetMapImageryProvider({
//        url: "https://a.tile.openstreetmap.org/",
//    })
//);

//earthvector.splitDirection = Cesium.SplitDirection.LEFT;
//layers.add(earthvector);

//const slider = document.getElementById("slider");
//const toggleButton = document.getElementById("toggleButton");

//let moveActive = false;

//function move(movement) {
//    if (!moveActive) {
//        return;
//    }

//    const relativeOffset = movement.endPosition.x;
//    const splitPosition =
//        (slider.offsetLeft + relativeOffset) /
//        slider.parentElement.offsetWidth;
//    slider.style.left = `${100.0 * splitPosition}%`;
//    viewer.scene.splitPosition = splitPosition;
//}

//const handler = new Cesium.ScreenSpaceEventHandler(slider);

//handler.setInputAction(() => {
//    moveActive = true;
//}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
//handler.setInputAction(() => {
//    moveActive = true;
//}, Cesium.ScreenSpaceEventType.PINCH_START);

//handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

//handler.setInputAction(() => {
//    moveActive = false;
//}, Cesium.ScreenSpaceEventType.LEFT_UP);
//handler.setInputAction(() => {
//    moveActive = false;
//}, Cesium.ScreenSpaceEventType.PINCH_END);


    // Función para cambiar la visibilidad del slider
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



