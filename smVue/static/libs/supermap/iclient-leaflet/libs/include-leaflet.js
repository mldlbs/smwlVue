/* eslint-disable */
(function () {
    var r = new RegExp("(^|(.*?\\/))(include-leaflet\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    function supportES6() {
        var code = "'use strict'; class Foo {}; class Bar extends Foo {};";
        try {
            (new Function(code))();
        } catch (err) {
            return false;
        }
        if (!Array.from) {
            return false;
        }
        return true;
    }

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        var excludes = (targetScript.getAttribute('exclude') || "").split(",");
        if (!inArray(excludes, 'leaflet')) {
            inputCSS("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css");
            inputScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet-src.js");
        }

        if (!inArray(excludes, 'iclient9-leaflet')) {
            //if (supportES6()) {
                //inputScript("/libs/supermap/iclient-leaflet/libs/iclient9-leaflet-es6.min.js");
            //} else {
                inputScript("/libs/supermap/iclient-leaflet/libs/iclient9-leaflet.js");
            //}
        }
        if (inArray(includes, 'iclient9-leaflet-css')) {
            inputCSS("/libs/supermap/iclient-leaflet/libs/iclient9-leaflet.min.css");
        }
    }


    load();
    window.isLocal = false;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : document.location.protocol + "//" + document.location.host;
})();
