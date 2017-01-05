//  ------------------------------------------------------------------------------------- //
var content;        
var applicationid;
var applicationfolder;
var vsiteurl;
var vNamespace;

//push config to content
$.ajax({
    url: "./json/qdc_config.json", type: "GET", dataType: "json",
    success: function (data) {;
        content = data;
        applicationid = content.config.hana.appid;
        applicationfolder = content.config.general.folder;
        vsiteurl = content.config.general.connect;
        vNamespace = content.config.hana.namespace;
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
        //Varibales
        var vDataConnection = '';                       //Contains Data Connection string
        var vDataconnection_transfer = '';              //Contains Name of Data Connection
        var vScriptArray = [];                          //Contains Script
        var vSelectedTableProp = [];                    //Contains Table definition
        var vcycle = -1;                                //Count cycles 
        var vfinalscript = '';                          //Contains final script to push into app
        var reloaded = null;                            //Reloadstatus
        var gettypeobject = '';                         //Holds GenericObject for Type
        var vDDCheck = 'off';                           //Direct Discovery Check

        //Bootstrap Switch
        $('input[name="DDCheck"]').bootstrapSwitch();

        //App Object Connection
        var app = qlik.openApp(applicationid, config);
        app.clearAll();

        //get objects -- inserted here --
        app.getObject('CurrentSelections', 'CurrentSelections');
        app.getObject('QV00', 'gJYtXd');
        app.getObject('QV01', 'VNvEQYZ');
        app.getObject('QV02', 'YWwjda');
        app.getObject('QV03', 'yTDdAJ');
        app.getObject('QV04', 'PbWqLs');
        app.getObject('QV05', 'bdjLf');

        //UI Functions
        $("#seldatacon").on('click', function () {
            $('#myTab a[href="#Datacon"]').tab('show');
            $('.progress-bar').css('width', '0%');
        });

        $("#seltable").on('click', function () {
            $('#myTab a[href="#Table"]').tab('show');
            $('.progress-bar').css('width', '35%');
        });

        $("#createscript").on('click', function () {
            $('#myTab a[href="#Script"]').tab('show');
            $('.progress-bar').css('width', '65%');
        });

        $("#reloaddata").on('click', function () {
            $('#myTab a[href="#Reload"]').tab('show');
            $('.progress-bar').css('width', '100%');
        });

        //Get DataConnections @ start
        $(document).ready(function () {
            var vConnection = [];
            const qsocks = require(applicationfolder + "/js/qsocks.bundle");
            var global = qsocks.Connect(config);
            global.then(function (global) {
                return qsocks.ConnectOpenApp({
                    host: window.location.hostname,
                    prefix: "/",
                    port: window.location.port,
                    isSecure: window.location.protocol === "https:",
                    rejectUnauthorized: false,
                    appname: applicationid,
                    debug: true
                });
            })
            .then(function (reply) {
                return (reply[1].getConnections());
            }).then(function (connection) {
                $.each(connection, function () {
                    vConnection.push(this.qName);
                    $('#dataconnection').append('<option>' + this.qName + '</option>');
                });
            }).then(function () {
                $('.selectpickerdatacon').selectpicker({
                    style: 'btn-default',
                    size: 10
                });
            });

        });

        //Activate Button "Apply Data Connection"
        $('#dataconnection').on('changed.bs.select', function () {
            $('#PickDataCon').removeClass('disabled');
            $('#PickDataCon').addClass('active');
            $('#PickDataCon').prop('disabled', false);
        });

        //Apply Data Connection
        $('#PickDataCon').on('click', function () {
            $('#DDcontainer').hide();
            //Get Selection from Type
            app.createGenericObject({
                TYPE: {
                    qStringExpression: "=Getfieldselections(OBJECT_TYPE)"
                }
            }, gettype);

            function gettype(reply) {
                if (reply.TYPE == 'CUBE') {
                    $('#QV03container').hide();
                    $('#QV04container').show();
                    $('#DDcontainer').hide();
                    var vTimeout5 = setTimeout(myTimer5, 100);
                    function myTimer5() {
                        qlik.resize();
                    };
                } else {
                    if (reply.TYPE == 'TABLE') {

                        $('#QV04container').hide();
                        $('#DDcontainer').show();
                        var vTimeout5 = setTimeout(myTimer5, 100);
                        function myTimer5() {
                            qlik.resize();
                        }
                    } else {
                        $('#QV03container').show();
                        $('#QV04container').hide();
                        var vTimeout5 = setTimeout(myTimer5, 100);
                        function myTimer5() {
                            qlik.resize();
                        }
                    }

                };

                gettypeobject = reply.qInfo.qId;
            };


            $('#myTab a[href="#Table"]').tab('show');
            $('.progress-bar').css('width', '35%');
            var vTimeout5 = setTimeout(myTimer5, 100);
            function myTimer5() {
                qlik.resize();
            };
        });

        //Pick Data Connection
        $('#dataconnection').on('changed.bs.select', function (e) {
            $('[data-id="dataconnection"]').next("div").find("li.selected > a > span.text").each(function () {
                vDataconnection_transfer = $(this).context.innerText;
            });
            vDataConnection = "LIB CONNECT TO '" + vDataconnection_transfer + "';";
        });

        //DDCheck Switch
        $('input[name="DDCheck"]').on('switchChange.bootstrapSwitch', function (event, state) {
            if (state == true) {
                vDDCheck = 'on';
                console.log('switched to on');
            } else {
                vDDCheck = 'off';
                console.log('switched to off');
            }
        });

        //Apply Selected Table
        $('#ApplySelectedTable').on('click', function () {
            console.log(vDDCheck);
            //Check DDListbox


            app.createGenericObject({
                Load: {
                    qStringExpression: "=$(vLoadComplete)"
                },

                LoadDD: {
                    qStringExpression: "=$(vLoadDD)"
                },
                Schema: {
                    qStringExpression: "=concat(if(GetFieldSelections(SCHEMA_NAME)<> null(),GetFieldSelections(SCHEMA_NAME),''),',')"
                },
                Table: {
                    qStringExpression: "=concat(if(GetFieldSelections(OBJECT_NAME)<> null(),GetFieldSelections(OBJECT_NAME),''),',')"
                },
                Column: {
                    qStringExpression: "=concat( distinct COLUMN_NAME,', ')"
                    //qStringExpression: "=concat(if(GetFieldSelections(COLUMN_NAME)<> null(),GetFieldSelections(COLUMN_NAME),''),',')"
                },
                Measure: {
                    qStringExpression: "=concat(if(GetFieldSelections(MEASURE_NAME)<> null(),GetFieldSelections(MEASURE_NAME),''),',')"
                },
                Dimension: {
                    qStringExpression: "=concat(DIMENSION_NAME,', ')"
                }
            }, pushScript);

            function pushScript(reply) {
                if (vDDCheck == 'on') {
                    vScriptArray.push(reply.LoadDD);
                } else {
                    vScriptArray.push(reply.Load);
                }
                vSelectedTableProp.push([
                    vcycle, {
                        'SCHEMA': reply.Schema,
                        'TABLE': reply.Table,
                        'COLUMN': reply.Column,
                        'DIMENSION': reply.Dimension,
                        'MEASURE': reply.Measure
                    }
                ]);
                console.log('vScriptArray:');
                console.log(vScriptArray);
                console.log('vcycle:');
                console.log(vcycle);
                console.log('vSelectedTableProp:');
                console.log(vSelectedTableProp);
                vcycle++;
                app.destroySessionObject(reply.qInfo.qId);

                $('#myTab a[href="#Script"]').tab('show');
                $('.progress-bar').css('width', '65%');
                CreateScriptTable();
            }
        });

        //Create Table in Script Section
        function CreateScriptTable() {
            var schema = vSelectedTableProp[vcycle][1].SCHEMA;
            var table = vSelectedTableProp[vcycle][1].TABLE;
            var column = vSelectedTableProp[vcycle][1].COLUMN;
            var dim = vSelectedTableProp[vcycle][1].DIMENSION;
            var mes = vSelectedTableProp[vcycle][1].MEASURE;
            var script = vScriptArray[vcycle];

            if (dim != '') {
                $('#Scripttable').append('<table style="table-layout: fixed;"><tbody><tr><td class="selcoltable selrowtable">' + schema + '</td><td class="selcoltable selrowtable">' + table + '</td><td class="selcoltable selrowtable">' + dim + ', ' + mes + '</td></tr></tbody></table><table><tbody><tr><td><pre id="LoadScript' + vcycle + '"class="scriptcode hiddenscript">' + script + '<a href="#" id="hidescript' + vcycle + '"><span style="float: right;" class="glyphicon glyphicon-minus"></span></a></pre><pre class="scriptcode" id="Placeholderscript' + vcycle + '">Show Script<a href="#" id="showscript' + vcycle + '"><span style="float: right;" class="glyphicon glyphicon-plus"></span></a></pre></td></tr></tbody></table>');

            } else {
                $('#Scripttable').append('<table style="table-layout: fixed;"><tbody><tr><td class="selcoltable selrowtable">' + schema + '</td><td class="selcoltable selrowtable">' + table + '</td><td class="selcoltable selrowtable">' + column + '</td></tr></tbody></table><table><tbody><tr><td><pre id="LoadScript' + vcycle + '"class="scriptcode hiddenscript">' + script + '<a href="#" id="hidescript' + vcycle + '"><span style="float: right;" class="glyphicon glyphicon-minus"></span></a></pre><pre class="scriptcode" id="Placeholderscript' + vcycle + '">Show Script<a href="#" id="showscript' + vcycle + '"><span style="float: right;" class="glyphicon glyphicon-plus"></span></a></pre></td></tr></tbody></table>');

            };
            scripttableshow();
            scripttablehide();
        };

        //show or hide script
        function scripttableshow() {
            $('[id^=showscript]').on('click', function () {
                $('#Placeholderscript' + this.id.slice(-1)).hide();
                $('#LoadScript' + this.id.slice(-1)).show();

            });
        };

        function scripttablehide() {
            $('[id^=hidescript]').on('click', function () {
                $('#LoadScript' + this.id.slice(-1)).hide();
                $('#Placeholderscript' + this.id.slice(-1)).show();

            });
        };

        $('#addtables').on('click', function () {
            vDDCheck = 'off';
            $('input[name="DDCheck"]').bootstrapSwitch('state', false);
            app.clearAll();
            $('#myTab a[href="#Table"]').tab('show');
            $('.progress-bar').css('width', '35%');
            var vTimeout5 = setTimeout(myTimer5, 100);
            function myTimer5() {
                qlik.resize();
            };
        });

        //Apply selected Tables
        $('#applyseltables').on('click', function () {

            $('#infodatacon').empty();
            $('#infodatasource').empty();
            $('#infotables').empty();
            $('#infoav').empty();
            $('#infoc').empty();

            $('#myTab a[href="#Reload"]').tab('show');
            $('.progress-bar').css('width', '100%');

            //Create final Script
            vfinalscript += vDataConnection + '\n\n';
            for (var i = 0; i < vScriptArray.length; i++) {
                var table = vSelectedTableProp[i][1].TABLE;
                vfinalscript += '///$tab "' + table + '"\r\n';
                vfinalscript += vScriptArray[i];
                vfinalscript += '\n\n';
            };

            vfinalscript += 'disconnect;';
            console.log(vfinalscript);

            //Display Overview

            //Fill Variables
            //vSelectedTableProp
            var vinfosource = [];
            var vinfotable = [];
            var vinfoav = [];
            var vinfoc = [];
            var vtablecol = [];
            var avmes = [];
            var avdim = [];

            for (var i = 0; i < vSelectedTableProp.length; i++) {
                vinfosource.push(vSelectedTableProp[i][1].TABLE);

                if (vSelectedTableProp[i][1].DIMENSION != "") {
                    vinfoav.push(vSelectedTableProp[i][1].TABLE);
                    var a = vSelectedTableProp[i][1].DIMENSION;
                    var str1 = a.split(', ');
                    vinfoc = vinfoc.concat(str1);
                    avdim = avdim.concat(str1);

                    var b = vSelectedTableProp[i][1].MEASURE;
                    var str2 = b.split(', ');
                    vinfoc = vinfoc.concat(str2);
                    avmes = avmes.concat(str2);
                } else {
                    vinfotable.push(vSelectedTableProp[i][1].TABLE);
                    var c = vSelectedTableProp[i][1].COLUMN;
                    var str3 = c.split(', ');
                    vinfoc = vinfoc.concat(str3);
                    vtablecol = vtablecol.concat(str3);
                }
            }

            //Append content to table
            $('#infodatacon').append(vDataconnection_transfer);

            $.each(vinfosource, function (index, value) {
                $('#infodatasource').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
            });

            $.each(vinfotable, function (index, value) {
                $('#infotables').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
            });

            $.each(vinfoav, function (index, value) {
                $('#infoav').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
            });
            console.log(vinfoc);
            $.each(vinfoc, function (index, value) {
                $('#infoc').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
            });

            //Infochart
            var a = vinfosource.length;
            var b = vinfotable.length;
            var c = vtablecol.length;
            var d = vinfoav.length;
            var e = avdim.length;
            var f = avmes.length;

            app.visualization.create('barchart',
            [
                {
                    qDef: {
                        qFieldDefs: ["=ValueList('Data-Sources','Tables','Columns','Analytic Views','Dimensions','Measures')"],
                        "qFieldLabels": ["Selection"]
                    },
                },
                {
                    qDef: {
                        qDef: "=pick(rowno()," + a + "," + b + "," + c + "," + d + "," + e + "," + f + ")",
                        qLabel: "Amount"
                    }
                }
            ],
            {
                "showTitles": false,
                "dimensionAxis": {
                    "show": "labels",
                    "dock": "far"
                },
                "measureAxis": {
                    "show": "labels"
                },
                "orientation": "horizontal",
                "dataPoint": { "showLabels": true },
                "color": {
                    "auto": false,
                    "mode": "byExpression"
                }
            }
            ).then(function (barchart) {
                barchart.show('QVINFO');
                qlik.resize();
            });



        });

        //Create App
        $('#createapp').on('click', function () {
            var vApp = "";
            var vAppID = "";
            var vTimestamp = timeStamp();
            var notify = "";

            /* Create APP */
            var qsocks = require(applicationfolder + "/js/qsocks.bundle");

            qsocks.Connect(config).then(function (global) {
                global.productVersion().then(function (version) {
                    $.notify({ icon: 'glyphicon glyphicon-ok', message: 'Connection to Qlik Sense Server establised.' }, { type: 'success', placement: { from: 'bottom', align: 'right' } });
                    vApp = vNamespace + '_' + vTimestamp;
                    return global.createApp(vNamespace + '_' + vTimestamp);
                })

                .then(function (reply) {
                    $.notify({ icon: 'glyphicon glyphicon-ok', message: 'APP: <b>' + vApp + '</b> created successfully. ID: ' + '<b>' + reply.qAppId + '</b>' }, { type: 'success', placement: { from: 'bottom', align: 'right' } }, { newest_on_top: true });
                    // Establish a new connection so we don't pollute the current engine session.
                    vAppID = reply.qAppId;
                    return qsocks.ConnectOpenApp({
                        host: window.location.hostname,
                        prefix: "/",
                        port: window.location.port,
                        isSecure: window.location.protocol === "https:",
                        rejectUnauthorized: false,
                        appname: reply.qAppId,
                        debug: true
                    });
                })
                .then(function (conns) {
                    var app = conns[1];
                    //console.log(conns);
                    var myscript = vfinalscript;
                    return app.getEmptyScript('Main').then(function (script) {
                        var localsettings = "";
                        localsettings += "///$tab Main\r\n";
                        localsettings += "SET ThousandSep=',';\n";
                        localsettings += "SET DecimalSep='.';\n";
                        localsettings += "SET MoneyThousandSep=',';\n";
                        localsettings += "SET MoneyDecimalSep='.';\n";
                        localsettings += "SET MoneyFormat='#.##0,00 €;-#.##0,00 €';\n";
                        localsettings += "SET TimeFormat='hh:mm:ss';\n";
                        localsettings += "SET DateFormat='DD.MM.YYYY';\n";
                        localsettings += "SET TimestampFormat='DD.MM.YYYY hh:mm:ss[.fff]';\n";
                        localsettings += "SET MonthNames='Jan;Feb;Mrz;Apr;Mai;Jun;Jul;Aug;Sep;Okt;Nov;Dez';\n";
                        localsettings += "SET DayNames='Mo;Di;Mi;Do;Fr;Sa;So';\n";
                        localsettings += "SET LongMonthNames='Januar;Februar;März;April;Mai;Juni;Juli;August;September;Oktober;November;Dezember';\n";
                        localsettings += "SET LongDayNames='Montag;Dienstag;Mittwoch;Donnerstag;Freitag;Samstag;Sonntag';\n";
                        localsettings += "SET FirstWeekDay=0;\n";
                        localsettings += "SET BrokenWeeks=0;\n";
                        localsettings += "SET ReferenceDay=4;\n";
                        localsettings += "SET FirstMonthOfYear=1;\n";
                        localsettings += "SET CollationLocale='de-DE';\n";
                        localsettings += "\n";

                        return app.setScript(localsettings + myscript)
                    })
                    // Reload
                    .then(function () {
                        $.notify({ icon: 'glyphicon glyphicon-ok', message: 'LoadScript appended successfully.' }, { type: 'success', placement: { from: 'bottom', align: 'right' } });
                        notify = $.notify({ icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate', message: 'Indexing application...<br><div id="progress"></div><div id="progressstatus"></div>' }, { type: 'info', timer: '1000000', placement: { from: 'bottom', align: 'right' } });
                        console.log('Reload:');
                        app.doReload().then(function () {
                            reloaded = true;
                        })
                    // Save
                    .then(function () {
                        notify.close();
                        $.notify({ icon: 'glyphicon glyphicon-ok', message: 'Application created successfully.' }, { type: 'success', placement: { from: 'bottom', align: 'right' } })
                        notify = $.notify({ icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate', message: 'Saving application...' }, { type: 'info', timer: '1000000', placement: { from: 'bottom', align: 'right' } });
                        console.log('Save:');
                        console.log(app);
                        return app.doSave()
                    })
                    .then(function () {
                        notify.close();
                        $.notify({ icon: 'glyphicon glyphicon-ok', message: 'App saved successfully.' }, { type: 'success', placement: { from: 'bottom', align: 'right' } });
                        console.log('Done')
                        var vurl = vsiteurl + vAppID;
                        $.notify({ icon: 'glyphicon glyphicon-log-in', message: 'Click to open App', url: vurl }, { type: 'info', timer: '100000000', placement: { from: 'bottom', align: 'right' } });
                        return app.connection.close()
                    })

                        reloaded = null;
                        var progress = setInterval(function () {
                            if (reloaded != true) {
                                conns[0].getProgress(5).then(function (msg) {
                                    if (msg.qPersistentProgress) {
                                        persistentProgress = msg.qPersistentProgress;
                                        var text = msg.qPersistentProgress;
                                        $('#progress').css('margin-top', '15px');
                                        $('#progress').append('<p>' + text + '</p>');
                                    } else {
                                        if (msg.qTransientProgress) {
                                            var text2 = persistentProgress + ' <-- ' + msg.qTransientProgress;
                                            $('#progressstatus').empty();
                                            $('#progressstatus').append('<p>' + text2 + '</p>');
                                        }
                                    }
                                })
                            } else {
                                clearInterval(progress)
                            }
                        }, 500);

                    })
                .then(function () {
                    console.log(global);
                    return global.connection.close();
                })
            .catch(function (err) {
                $.notify({ icon: 'glyphicon glyphicon-warning-sign', message: 'Error ' + err.code + ': ' + err.message }, { type: 'danger', timer: '10000', placement: { from: 'bottom', align: 'right' } });
                console.log(err) // Handle errors
            })
                })
            });
        });

        //Building Timestamps
        function timeStamp() {
            // Create a date object with the current time
            var now = new Date();

            // Create an array with the current month, day and time
            var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

            // Create an array with the current hour, minute and second
            var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

            // Determine AM or PM suffix based on the hour
            var suffix = (time[0] < 12) ? "AM" : "PM";

            // Convert hour from military time
            //time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

            // If hour is 0, set it to 12
            time[0] = time[0] || 12;

            // If seconds and minutes are less than 10, add a zero
            for (var i = 1; i < 3; i++) {
                if (time[i] < 10) {
                    time[i] = "0" + time[i];
                }
            }

            // Return the formatted string
            var tmp = date.join() + "_" + time.join();
            return tmp.replace(/,/g, "");

        }

        //RERUN Button
        $("#rerun").on('click', function () {
            location.reload();
        });

    });
});
