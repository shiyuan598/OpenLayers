define([
    "ol", "jquery"
], function (ol, $) {
    'use strict';
    var selectApp = {
        init: init
    }
    return selectApp;

    function init(map){
        var select = new ol.interaction.Select({
            condition: ol.events.condition.singleClick
        });
        map.addInteraction(select);
    }
});