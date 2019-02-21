define([
    'ol'
], function (ol) {
    'use strict';
    var OSM = new ol.layer.Tile({
        title: "Open Street Map",
        source: new ol.source.OSM()
    });

    var tiandituSatellite = new ol.layer.Tile({
        title: "天地图卫星影像",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=45c78b2bc2ecfa2b35a3e4e454ada5ce'
        }),
        //http://t0.tianditu.gov.cn/cia_w/wmts
        // projection: 'EPSG:4326'
    });
    var tiandituSatelliteLabel = new ol.layer.Tile({
        title: "天地图卫星影像标注",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=45c78b2bc2ecfa2b35a3e4e454ada5ce'
        }),
        // projection: 'EPSG:3857'
    });

    var tiandituRoad = new ol.layer.Tile({
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=45c78b2bc2ecfa2b35a3e4e454ada5ce"
        })
    });
    var tiandituAnnotation = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=45c78b2bc2ecfa2b35a3e4e454ada5ce'
        })
    });

    // 自定义分辨率和瓦片坐标系
    var resolutions = [];
    var maxZoom = 18;
    // 计算百度使用的分辨率
    for (var i = 0; i <= maxZoom + 1; i++) {
        resolutions[i] = Math.pow(2, maxZoom - i);
    }
    var tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0], // 设置原点坐标
        resolutions: resolutions // 设置分辨率
    });
    // 创建百度行政区划
    var baiduSource = new ol.source.TileImage({
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord, pixelRatio, proj) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
                x = 'M' + (-x);
            }
            if (y < 0) {
                y = 'M' + (-y);
            }

            // return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20170115&scaler=1&p=1";
            //street
            return 'http://online' + parseInt(Math.random() * 10) + '.map.bdimg.com/onlinelabel/?qt=tile&x=' + x + '&y=' + y + '&z=' + z + '&styles=pl&udt=20170620&scaler=1&p=1';
        }
    });
    // 百度影像
    var baiduSourceRaster = new ol.source.TileImage({
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord, pixelRatio, proj) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
                x = 'M' + (-x);
            }
            if (y < 0) {
                y = 'M' + (-y);
            }
            return 'http://shangetu' + parseInt(Math.random() * 10) + '.map.bdimg.com/it/u=x=' + x + ';y=' + y + ';z=' + z + ';v=009;type=sate&fm=46&udt=20170606';
        }
    });
    // 百度标注
    var baiduSourceLabel = new ol.source.TileImage({
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord, pixelRatio, proj) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
                x = 'M' + (-x);
            }
            if (y < 0) {
                y = 'M' + (-y);
            }
            return 'http://online' + parseInt(Math.random() * 10) + '.map.bdimg.com/onlinelabel/?qt=tile&x=' +
                x + '&y=' + y + '&z=' + z + '&styles=sl&udt=20170620&scaler=1&p=1';
        }
    });
    // 百度行政区划
    var baiduMap = new ol.layer.Tile({
        source: baiduSource
    });

    // 百度地图标注
    var baiduMapLabel = new ol.layer.Tile({
        source: baiduSourceLabel
    });
    //百度地图影像
    var baiduRaster = new ol.layer.Tile({
        source: baiduSourceRaster
    });
    //谷歌地图
    var googleMap = new ol.layer.Tile({
        source: new ol.source.XYZ({
            attributions: ["谷歌地图"],
            url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
        })
    });
    //谷歌影像
    var googleRaster = new ol.layer.Tile({
        source: new ol.source.TileImage({
            attributions: ["谷歌影像"],
            url: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
        })
    });

    //谷歌离线瓦片
    var offlineGoogleMapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({            
            // url: '../resource/offlineMapTile/googleImg/{z}/{x}/{y}.png'
            url: '../resource/offlineMapTile/googleMap/{z}/{x}/{y}.png'
        })
    });
   
    var layers = {
        OSM: OSM, //Open Street Map
        tiandituSatellite: tiandituSatellite, //天地图卫星影像（无标注）
        tiandituSatelliteLabel: tiandituSatelliteLabel, //天地图卫星影像标注
        tiandituRoad: tiandituRoad, //天地图路网（无标注）
        tiandituAnnotation: tiandituAnnotation, //天地图标注
        baiduMap: baiduMap, //百度地图        
        baiduRaster: baiduRaster, //百度地图影像（无标注）
        baiduMapLabel: baiduMapLabel, //百度地图无标注
        googleMap: googleMap, //谷歌地图
        googleRaster: googleRaster, //谷歌影像
        offlineGoogleMapLayer: offlineGoogleMapLayer//离线谷歌地图
    };
    return layers;
});