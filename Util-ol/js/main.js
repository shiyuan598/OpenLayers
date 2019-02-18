require.config({
  baseUrl: "../js",
  paths: {
    "jquery": "lib/jquery/jquery-3.3.1",
    "ol": "lib/ol",
    "henan": "henanGeoJson",
    "map": "map",
    "layers": "layers",
    "measure": "measure",
    "select": "select",
    "saveAs": "lib/saveas",
    "img2base64": "lib/img2base64",
  },
  shim: {
    "saveAs": {
      exports: "saveAs",
    }
  }
});

require(["jquery", "ol", "henan", "map", "measure", "select"], function($, ol, henan, map, measure, select){
  $(function(){
    var img = "../resource/img/project/2T_3.png";
    var olMap;

    function getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
      var dataURL = canvas.toDataURL("image/"+ext);
      return dataURL.split("base64,")[1];
    }

    function setBase64Img(img, layer){
      var image = new Image();
      image.src = img;
      image.onload = function(){
        var base64 = getBase64Image(image);
        console.log("base64:   " + base64);
      }
    }

    map.init();
    olMap = map.map;
    
    $("#startMeasure").click(function(){
        measure.init(olMap);
        $(this).attr("disabled", "disabled");
        $("#exitMeasure").attr("disabled", false);
    });
    $("#exitMeasure").click(function(){
        measure.exit();
        $("#startMeasure").attr("disabled", false);
        $(this).attr("disabled", "disabled");
        $(".tooltip-measure").attr("hidden", "hidden");
    });

    $("#click-select").click(function(){
        select.init(olMap);        
    });

    //start 添加行政区划
    (function () {
      var format = new ol.format.GeoJSON();
      var source = new ol.source.Vector();

      var multilPolygon = new ol.geom.MultiPolygon();
      multilPolygon = format.readGeometry(henan.data);
      // var featureAll = new ol.Feature({
      //   geometry: multilPolygon.transform("EPSG:4326", "EPSG:3857"),
      // });
      var geoArray = henan.data.geometries;
      for (var i = 0, length = geoArray.length; i < length; i++) {
          var polygon = new ol.geom.MultiPolygon();
          polygon = format.readGeometry(geoArray[i]);
          var feature = new ol.Feature({
              geometry: polygon.transform("EPSG:4326", "EPSG:3857"),
          });
          feature.setStyle(olMap.districtStyle);
          feature.setId(i);
          source.addFeature(feature);
      }
      //source.addFeature(feature);
      var districtLayer = new ol.layer.Vector({
          source: source
      });
      olMap.addLayer(districtLayer);
      olMap.districtSource = source;
  })();
  //end 添加行政区划

  //start 添加点数据
  (function () {
      var source = new ol.source.Vector();
      var styleIcon0 = new ol.style.Icon({
          src: "../resource/img/project/2T_3.png",
          opacity: 0.95,
          // scale: 0.12,
          // imgSize: [5, 5],
          snapToPixel: false,
      });
      var styleIcon1 = new ol.style.Icon({
          src: "../resource/img/project/2T_4.png",
          opacity: 0.95,
          // scale: 0.12,
          // imgSize: [5, 5],
          snapToPixel: false,
      });
      var styleIcon2 = new ol.style.Icon({
          src: "../resource/img/project/2T_5.png",
          opacity: 0.95,
          // scale: 0.12,
          // imgSize: [5, 5],
          snapToPixel: false,
      });

      for (var i = 0; i <= 25; i++) {
          var point = new ol.geom.Point();
          point.setCoordinates([111.5 + (115.5 - 111.5) * Math.random(), 32.5 + (34.5 - 32.5) * Math.random()]);
          var feature = new ol.Feature({
              geometry: point.transform("EPSG:4326", "EPSG:3857"),
          });
          feature.setId(i);
          feature.set("name", i + "wsy");

          if (i % 3 == 0) {
              feature.setStyle(new ol.style.Style({ image: styleIcon0 }));
          } else if (i % 3 == 1) {
              feature.setStyle(new ol.style.Style({ image: styleIcon1 }));
          } else if (i % 3 == 2) {
              feature.setStyle(new ol.style.Style({ image: styleIcon2 }));
          }
          source.addFeature(feature);
      }

      var styleCircle = new ol.style.Circle({
          radius: 7,
          snapToPixel: false,
          fill: new ol.style.Fill({
              color: 'black'
          }),
          stroke: new ol.style.Stroke({
              color: 'white',
              width: 2
          }),
      });

      var styleIcon = new ol.style.Icon({
          src: "../resource/img/05.png",
          opacity: 0.95,
          scale: 0.2,
          imgSize: [5, 5],
          snapToPixel: false,
      });

      var pointLayer = new ol.layer.Vector({
          source: source,
          // style: new ol.style.Style({
          //   image: styleIcon,
          // }),
          zIndex: 100,
      });
      olMap.addLayer(pointLayer);
      olMap.pointSource = source;
  })();
  //end 添加点数据

  });

});
