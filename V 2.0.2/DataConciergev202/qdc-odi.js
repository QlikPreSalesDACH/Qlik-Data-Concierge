//  ------------------------------------------------------------------------------------- //
var content;        
var applicationid;
var applicationfolder;
var vsiteurl;

//push config to content
$.ajax({
    url: "./json/qdc_config.json", type: "GET", dataType: "json",
    success: function (data) {;
        content = data;
        applicationid = content.config.bex_odi.appid;
        applicationfolder = content.config.general.folder;
        vsiteurl = content.config.general.connect;
    }, error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
}).then(function () {
//  ------------------------------------------------------------------------------------- //

    var rootPath = window.location.hostname;
    var portUrl = "80";

    if (window.location.port == "") {
        if ("https:" == window.location.protocol)
            portUrl = "443";
        else {
            portUrl = "80";
        }
    }
    else
        portUrl = window.location.port;

    var pathRoot = "//localhost:4848/extensions/";
    if (portUrl != "4848")
        pathRoot = "//" + rootPath + ":" + portUrl + "/resources/";

    var config = {
        host: window.location.hostname,
        prefix: "/",
        port: window.location.port,
        isSecure: window.location.protocol === "https:"
    };

    require.config({
        baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
        paths: { app: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") }
    });

    require([
        "js/qlik",
        "jquery",
        applicationfolder + "/js/bootstrap.min",
        applicationfolder + "/js/bootstrap-select.min",
        applicationfolder + "/js/qsocks.bundle",
        applicationfolder + "/js/bootstrap-notify.min",
        applicationfolder + "/js/jquery.cookie",
        applicationfolder + "/js/bootstrap-switch.min",
    ],

    function (qlik, $, Selectpicker, qsocks) {

        var app = qlik.openApp(applicationid, config);
        app.clearAll();

        app.getObject('QV01', 'YjnJRJ');
        app.getObject('QV02', 'KGwPk');

        $("button[ng-click='openNewApp()']").on('click', function () {
            $("#header").slideUp();
        });

        $(document).ready(function () {
            var progress = setInterval(function () {
                if ($("button[ng-click='openNewApp()']").length) {
                    $("button[ng-click='openNewApp()']").on('click', function () {
                        $("#header").fadeOut();
                        $("#odiconfig").show();
                        $("#footer").fadeOut();
                    });
                }
            }, 1000);
        });


        $("#odiconfig").on('click', function () {
            $("#header").fadeIn();
            $("#footer").fadeIn();
            $("#odiconfig").hide();
            $('iframe').remove();
            qlik.resize();
        });
    });
});