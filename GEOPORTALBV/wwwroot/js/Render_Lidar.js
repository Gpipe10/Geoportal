// Sección 1: Configuración de la escena de Cesium
window.cesiumViewer = new Cesium.Viewer('cesiumContainer', {
    useDefaultRenderLoop: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    navigationHelpButton: false,
});

// Sección 2: Configuración de la escena de Potree
window.potreeViewer = new Potree.Viewer(document.getElementById("potree_render_area"), {
    useDefaultRenderLoop: false
});

potreeViewer.setEDLEnabled(true);
potreeViewer.setFOV(60);
potreeViewer.setPointBudget(30_000_000);
potreeViewer.setMinNodeSize(50);
potreeViewer.useHQ = true;

potreeViewer.loadGUI(() => {
    potreeViewer.setLanguage('en');
    potreeViewer.toggleSidebar();
    potreeViewer.setBackground("black");
   
    $("#menu_clipping").next().show();
  
});

function render(id, datapoint, utmX, utmY, zona) {
    console.log("entro a render ");

    $(document).ready(function () {
        $(":checkbox").change(function () {
            if ($(this).is(":checked")) {
                // Habilitar todos los checkboxes
                $(":checkbox").prop("disabled", true);

                if ($(this).attr("id") === id) {
                    var metadataPath = `./Content/datacloud/Output/${datapoint}/metadata.json`;
                    window.potreeViewer.scene.pointclouds.forEach(function (layer) {
                        window.potreeViewer.scene.scenePointCloud.remove(layer);
                    });
                    window.potreeViewer.scene.pointclouds = [];

                    Potree.loadPointCloud(metadataPath, datapoint, function (e) {
                        let scene = potreeViewer.scene;

                        scene.addPointCloud(e.pointcloud);

                        //verificacion del valor de la variable zone
                        console.log("DATA ZONA:", zona);

                        e.pointcloud.position.set(utmX, utmY, 0);
                        e.pointcloud.rotation.set(0, 0, -0.035);

                        // Configuración de la vista en Potree
                        scene.view.position.set(utmX, utmY, 1659.311);
                        scene.view.lookAt(utmX, utmY, 30.009);

                        // Transformación de coordenadas para Cesium
                        let pointcloudProjection = `+proj=utm +zone=${zona} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
                        let mapProjection = proj4.defs("WGS84");
                        window.toMap = proj4(pointcloudProjection, mapProjection);
                        window.toScene = proj4(mapProjection, pointcloudProjection);
                        console.log(mapProjection);

                        let bb = potreeViewer.getBoundingBox();
                    });
                    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                }
            } else {
                // Si desmarcas el switch, habilitar todos los checkboxes
                $(":checkbox").prop("disabled", false);
                window.potreeViewer.scene.pointclouds.forEach(function (layer) {
                    window.potreeViewer.scene.scenePointCloud.remove(layer);
                });
            }
        });
    });

    //------------------------------------------------------------------------------

    function loop(timestamp) {
        requestAnimationFrame(loop);

        potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);
        potreeViewer.render();

        if (window.toMap !== undefined) {
            // Transformación de Coordenadas para Cesium
            let camera = potreeViewer.scene.getActiveCamera();

            let pPos = new THREE.Vector3(0, 0, 0).applyMatrix4(camera.matrixWorld);
            let pUp = new THREE.Vector3(0, 600, 0).applyMatrix4(camera.matrixWorld);
            let pTarget = potreeViewer.scene.view.getPivot();

            let toCes = (pos) => {
                let xy = [pos.x, pos.y];
                let height = pos.z;
                let deg = toMap.forward(xy);
                let cPos = Cesium.Cartesian3.fromDegrees(...deg, height);

                return cPos;
            };

            let cPos = toCes(pPos);
            let cUpTarget = toCes(pUp);
            let cTarget = toCes(pTarget);

            let cDir = Cesium.Cartesian3.subtract(cTarget, cPos, new Cesium.Cartesian3());
            let cUp = Cesium.Cartesian3.subtract(cUpTarget, cPos, new Cesium.Cartesian3());

            cDir = Cesium.Cartesian3.normalize(cDir, new Cesium.Cartesian3());
            cUp = Cesium.Cartesian3.normalize(cUp, new Cesium.Cartesian3());

            cesiumViewer.camera.setView({
                destination: cPos,
                orientation: {
                    direction: cDir,
                    up: cUp
                }
            });
        }

        let aspect = potreeViewer.scene.getActiveCamera().aspect;
        if (aspect < 1) {
            let fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
            cesiumViewer.camera.frustum.fov = fovy;
        } else {
            let fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
            let fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2
            cesiumViewer.camera.frustum.fov = fovx;
        }

        cesiumViewer.render();
    }

    requestAnimationFrame(loop);
}
