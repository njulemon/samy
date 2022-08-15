/* global L */

var queue = require('d3-queue').queue;

var cacheBusterDate = +new Date();

// leaflet-image
module.exports = function leafletImage(map, callback) {

    var hasMapbox = !!L.mapbox;

    var dimensions = map.getSize(),
        layerQueue = new queue(1);

    var canvas = document.createElement('canvas');
    canvas.width = dimensions.x;
    canvas.height = dimensions.y;
    var ctx = canvas.getContext('2d');

    // dummy canvas image when loadTile get 404 error
    // and layer don't have errorTileUrl
    var dummycanvas = document.createElement('canvas');
    dummycanvas.width = 1;
    dummycanvas.height = 1;
    var dummyctx = dummycanvas.getContext('2d');
    dummyctx.fillStyle = 'rgba(0,0,0,0)';
    dummyctx.fillRect(0, 0, 1, 1);

    // layers are drawn in the same order as they are composed in the DOM:
    // tiles, paths, and then markers
    map.eachLayer(drawTileLayer);
    map.eachLayer(drawEsriDynamicLayer);

    if (map._pathRoot) {
        layerQueue.defer(handlePathRoot, map._pathRoot);
    } else if (map._panes) {
        var firstCanvas = map._panes.overlayPane.getElementsByTagName('canvas').item(0);
        if (firstCanvas) {
            layerQueue.defer(handlePathRoot, firstCanvas);
        }
    }
    map.eachLayer(drawMarkerLayer);
    map.eachLayer(drawPopupLayer);
    layerQueue.awaitAll(layersDone);

    function drawTileLayer(l) {
        if (l instanceof L.TileLayer) layerQueue.defer(handleTileLayer, l);
        else if (l._heat) layerQueue.defer(handlePathRoot, l._canvas);
    }

    function drawMarkerLayer(l) {
        if (l instanceof L.Marker && l.options.icon instanceof L.Icon) {
            layerQueue.defer(handleMarkerLayer, l);
        }
    }

    function drawPopupLayer(l) {
        if (l instanceof L.Popup) layerQueue.defer(handlePopupLayer, l);
    }

    function drawEsriDynamicLayer(l) {
        if (!L.esri) return;

        if (l instanceof L.esri.DynamicMapLayer) {
            layerQueue.defer(handleEsriDymamicLayer, l);
        }
    }

    function done() {
        callback(null, canvas);
    }

    function layersDone(err, layers) {
        if (err) throw err;
        layers.forEach(function (layer) {
            if (layer && layer.canvas) {
                ctx.drawImage(layer.canvas, 0, 0);
            }
        });
        done();
    }

    function handleTileLayer(layer, callback) {
        // `L.TileLayer.Canvas` was removed in leaflet 1.0
        var isCanvasLayer = (L.TileLayer.Canvas && layer instanceof L.TileLayer.Canvas),
            canvas = document.createElement('canvas');

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;

        var ctx = canvas.getContext('2d'),
            bounds = map.getPixelBounds(),
            zoom = map.getZoom(),
            tileSize = layer.options.tileSize;

        ctx.globalAlpha = (layer.options && layer.options.opacity) ? layer.options.opacity : 1;

        if (zoom > layer.options.maxZoom ||
            zoom < layer.options.minZoom ||
            // mapbox.tileLayer
            (hasMapbox &&
                layer instanceof L.mapbox.tileLayer && !layer.options.tiles)) {
            return callback();
        }

        var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor()),
            tiles = [],
            j, i,
            tileQueue = new queue(1);

        for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                tiles.push(new L.Point(i, j));
            }
        }

        tiles.forEach(function (tilePoint) {
            var originalTilePoint = tilePoint.clone();

            if (layer._adjustTilePoint) {
                layer._adjustTilePoint(tilePoint);
            }

            var tilePos = originalTilePoint
                .scaleBy(new L.Point(tileSize, tileSize))
                .subtract(bounds.min);

            if (tilePoint.y >= 0) {
                if (isCanvasLayer) {
                    var tile = layer._tiles[tilePoint.x + ':' + tilePoint.y];
                    tileQueue.defer(canvasTile, tile, tilePos, tileSize);
                } else {
                    var url = addCacheString(layer.getTileUrl(tilePoint));
                    tileQueue.defer(loadTile, url, tilePos, tileSize);
                }
            }
        });

        tileQueue.awaitAll(tileQueueFinish);

        function canvasTile(tile, tilePos, tileSize, callback) {
            callback(null, {
                img: tile,
                pos: tilePos,
                size: tileSize
            });
        }

        function loadTile(url, tilePos, tileSize, callback) {
            var im = new Image();
            im.crossOrigin = '';
            im.onload = function () {
                callback(null, {
                    img: this,
                    pos: tilePos,
                    size: tileSize
                });
            };
            im.onerror = function (e) {
                // use canvas instead of errorTileUrl if errorTileUrl get 404
                if (layer.options.errorTileUrl != '' && e.target.errorCheck === undefined) {
                    e.target.errorCheck = true;
                    e.target.src = layer.options.errorTileUrl;
                } else {
                    callback(null, {
                        img: dummycanvas,
                        pos: tilePos,
                        size: tileSize
                    });
                }
            };
            im.src = url;
        }

        function tileQueueFinish(err, data) {
            data.forEach(drawTile);
            callback(null, {canvas: canvas});
        }

        function drawTile(d) {
            ctx.drawImage(d.img, Math.floor(d.pos.x), Math.floor(d.pos.y),
                d.size, d.size);
        }
    }

    function handlePathRoot(root, callback) {
        var bounds = map.getPixelBounds(),
            origin = map.getPixelOrigin(),
            canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        var ctx = canvas.getContext('2d');
        var pos = L.DomUtil.getPosition(root).subtract(bounds.min).add(origin);
        try {
            ctx.drawImage(root, pos.x, pos.y, canvas.width - (pos.x * 2), canvas.height - (pos.y * 2));
            callback(null, {
                canvas: canvas
            });
        } catch (e) {
            console.error('Element could not be drawn on canvas', root); // eslint-disable-line no-console
        }
    }

    function handleMarkerLayer(marker, callback) {

        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            pixelBounds = map.getPixelBounds(),
            minPoint = new L.Point(pixelBounds.min.x, pixelBounds.min.y),
            pixelPoint = map.project(marker.getLatLng()),
            isBase64 = /^data\:/.test(marker._icon.src),
            url = isBase64 ? marker._icon.src : addCacheString(marker._icon.src),
            im = new Image(),
            options = marker.options.icon.options,
            size = options.iconSize,
            pos = pixelPoint.subtract(minPoint)

        if (size instanceof L.Point) size = [size.x, size.y];

        console.log(options)

        var x = pos.x - size[0] + (typeof options.iconAnchor == 'object' ? options.iconAnchor[0] : size[0] / 2),
            y = pos.y - (typeof options.iconAnchor == 'object' ? options.iconAnchor[1] : size[1] / 2);

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        im.crossOrigin = '';

        im.onload = function () {
            ctx.drawImage(this, x, y, size[0], size[1]);
            callback(null, {
                canvas: canvas
            });
        };

        im.src = url;

        if (isBase64) im.onload();
    }

    function handleEsriDymamicLayer(dynamicLayer, callback) {
        var canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;

        var ctx = canvas.getContext('2d');

        var im = new Image();
        im.crossOrigin = '';
        im.src = addCacheString(dynamicLayer._currentImage._image.src);

        im.onload = function () {
            ctx.drawImage(im, 0, 0);
            callback(null, {
                canvas: canvas
            });
        };
    }

    function handlePopupLayer(popup, callback) {

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        // If thie canvasContext class doesn't have  a fillRoundedRect, extend it now
        if (!ctx.constructor.prototype.fillRoundedRect) {

            ctx.constructor.prototype.fillRoundedRect =
                function (xx, yy, ww, hh, rad, fill, stroke) {
                    if (typeof (rad) == "undefined") rad = 5;
                    this.beginPath();
                    this.moveTo(xx + rad, yy);
                    this.arcTo(xx + ww, yy, xx + ww, yy + hh, rad);
                    this.arcTo(xx + ww, yy + hh, xx, yy + hh, rad);
                    this.arcTo(xx, yy + hh, xx, yy, rad);
                    this.arcTo(xx, yy, xx + ww, yy, rad);
                    if (stroke) this.stroke(); // Default to no stroke
                    if (fill || typeof (fill) == "undefined") this.fill(); // Default to fill
                };
        }

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        ctx.globalAlpha = 0.5;
        ctx.font = 'bold 84px Helvetica Neue';


        let pixelBounds = map.getPixelBounds();
        let minPoint = new L.Point(pixelBounds.min.x, pixelBounds.min.y);
        let pixelPoint = map.project(popup.getLatLng());
        let pos = pixelPoint.subtract(minPoint);

        let markerSize = [120, 120];
        let textSize = [ctx.measureText(popup._content).width, ctx.measureText(popup._content).emHeightAscent];
        let borderSize = [textSize[0] + (150 * 2), textSize[1] + (100 * 2)];

        let markerX = Math.round(pos.x - markerSize[0] / 2);
        let markerY = Math.round(pos.y - markerSize[1] / 2);
        let borderX = markerX - borderSize[0] / 2 + markerSize[0] / 2;
        let borderY = markerY - borderSize[1] - markerSize[1] / 2;
        let textX = borderX + borderSize[0] / 2 - textSize[0] / 2;
        let textY = borderY + borderSize[1] / 2 + textSize[1] / 2;

        // ctx.fillStyle = "rgb(0,0,255)";
        // ctx.fillRect(markerX,markerY,markerSize[0],markerSize[1]);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRoundedRect(borderX, borderY, borderSize[0], borderSize[1], 100);
        // ctx.fillStyle = "rgb(0,255,0)";
        // ctx.fillRect(textX,textY-textSize[1], textSize[0], textSize[1]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = 'bold 84px Helvetica Neue';
        ctx.fillText(popup._content, textX, textY);

        callback(null, {
            canvas: canvas
        });
    }

    function addCacheString(url) {
        // workaround for https://github.com/mapbox/leaflet-image/issues/84
        if (!url) return url;
        // If it's a data URL we don't want to touch this.
        if (isDataURL(url) || url.indexOf('mapbox.com/styles/v1') !== -1) {
            return url;
        }
        return url + ((url.match(/\?/)) ? '&' : '?') + 'cache=' + cacheBusterDate;
    }

    function isDataURL(url) {
        var dataURLRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return !!url.match(dataURLRegex);
    }

};
