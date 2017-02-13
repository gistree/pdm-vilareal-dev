(function () {
    function download(filename, text) {
        var blob = new Blob([text], {
            type: "application/json;charset=utf-8"
        });
        saveAs(blob, filename);
    }
    window.app = {};
    var app = window.app;

    /**
     * @constructor
     * @extends {ol.control.Control}
     * @param {Object=} opt_options Control options.
     */
    app.generateGeoJSONControl = function (opt_options) {
        var options = opt_options || {};
        var anchor = document.createElement('a');
        anchor.href = '#export-geojson';
        anchor.innerHTML = 'G';
        var this_ = this;
        var getGeoJSON = function (e) {
            // prevent #export-geojson anchor from getting appended to the url
            e.preventDefault();
            var source = options.source;
            var format = new ol.format.GeoJSON();
            var features = source.getFeatures();
            var featuresGeoJSON = format.writeFeatures(features);
            download('export.geojson', JSON.stringify(featuresGeoJSON));
        };
        anchor.addEventListener('click', getGeoJSON, false);
        anchor.addEventListener('touchstart', getGeoJSON, false);
        var element = document.createElement('div');
        element.className = 'export-geojson ol-unselectable';
        element.appendChild(anchor);
        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };
    ol.inherits(app.generateGeoJSONControl, ol.control.Control);
    var raster = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'terrain'
        })
    });
    var source = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: '/features.geojson'
    });
    var vector = new ol.layer.Vector({
        id: 'vector',
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    var map = new ol.Map({
        layers: [raster, vector],
        controls: ol.control.defaults().extend([
            new app.generateGeoJSONControl({
                source: source
            })
        ]),
        target: 'map',
        view: new ol.View({
            center: [-11000000, 4600000],
            zoom: 4
        })
    });

    var typeSelect = document.getElementById('type');
    var draw;
    function addInteraction() {
        draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value
        });
        map.addInteraction(draw);
    }
    typeSelect.onchange = function (e) {
        map.removeInteraction(draw);
        addInteraction();
    };
    addInteraction();

})();