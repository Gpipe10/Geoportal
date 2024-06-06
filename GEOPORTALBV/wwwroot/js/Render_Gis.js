const viewer = new Cesium.Viewer("cesiumContainer", {
    maximumRenderTimeChange: Infinity,
});

const options = {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
    screenOverlayContainer: viewer.container,
};



const imageryLayers = viewer.imageryLayers;



function render(id, datapoint) {
    console.log("entro a render ");

    $(document).ready(function () {
        $(":checkbox").change(function () {
            if ($(this).is(":checked")) {
                // Habilitar todos los checkboxes
                $(":checkbox").prop("disabled", false);

                if ($(this).attr("id2") === id) {
                    var metadataPath = `./Content/datagis/${datapoint}`;

                    // Obtener la extensión del archivo
                    var fileExtension = datapoint.split('.').pop().toLowerCase();

                    if (fileExtension === 'kml' || fileExtension === 'kmz') {
                        // Cargar KML o KMZ
                        const dataSourcePromise = viewer.dataSources.add(
                            Cesium.KmlDataSource.load(metadataPath, options)
                        );

                        dataSourcePromise.then(function (dataSource) {
                            // Hacer un vuelo suave (flyTo) a la extensión del KML
                            viewer.flyTo(dataSource, {
                                duration: 3.0, // Duración en segundos
                            });
                        });

                    } else if (fileExtension === 'czml') {
                        // Cargar CZML
                        viewer.dataSources.add(
                            Cesium.CzmlDataSource.load(metadataPath)
                        ).then(function (dataSource) {
                            // Hacer zoom a las entidades cargadas
                            viewer.zoomTo(dataSource.entities);

                            // Configurar el reloj para que inicie automáticamente
                            const clock = viewer.clock;
                            clock.shouldAnimate = true; // Inicia la animación automáticamente
                        });
                    }
                    else if (fileExtension === 'topojson' || fileExtension === 'geojson' || fileExtension === 'json') {

                        const dataSourcePromise = viewer.dataSources.add(
                            Cesium.GeoJsonDataSource.load(metadataPath, options)
                        );
                        dataSourcePromise.then(function (dataSource) {
                            // Hacer un vuelo suave (flyTo) a la extensión del KML
                            viewer.flyTo(dataSource, {
                                duration: 3.0, // Duración en segundos
                            });
                        });

                    } else if (fileExtension === 'gpx' ) {

                        viewer.dataSources.add(
                            Cesium.GpxDataSource.load(metadataPath, options,
                                    {
                                        clampToGround: true,
                                    }
                                )
                            )
                            .then(function (dataSource) {
                                viewer.zoomTo(dataSource.entities);

                                // Configurar el reloj para que inicie automáticamente
                                const clock = viewer.clock;
                                clock.shouldAnimate = true; // Inicia la animación automáticamente
                            });

                                                   



                    } else {

                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Este tipo de datos no pueden ser visualizados ",
                            showConfirmButton: false,
                            timer: 3000
                        });



                    }











                }
            } else {
                if (!$("#id2").prop("checked")) {
                    viewer.dataSources.removeAll();
                }
            }
        });
    });
}


