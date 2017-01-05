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
        applicationid = content.config.bex.appid;
        applicationfolder = content.config.general.folder;
        vsiteurl = content.config.general.connect;
        vNamespace = content.config.bex.namespace;
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

        // Create Variables for Application
        var vInfoprovider = "";
        var vBexQueryDes = "";
        var vBexQuery = "";
        var vLoad = "";
        var vDimensions = "";
        var vDimensionsS = "";
        var vMeasures = "";
        var vMeasuresS = "";
        var vSapsystemS = "";
        var vUnit = "";
        var vBexVariable = "";
        var vVariable = "";
        var vVarNAM = "";
        var table = "";
        var arr = [];
        var arrr = [];
        var vvariabletype = "";
        var vselecttype = "";
        var namearr = [];
        var vVarLOWValue = "";
        var LOW = "";
        var HIGH = "";
        var vVariableCounter = "";
        var num = "";
        var vVarNAMCounter1 = 0;
        var vVarNAMCounter2 = 0;
        var vVarNAMCounter3 = 0;
        var vScript = "";
        var vDataConnection = "";
        var targetapp = "";
        var vSwitch = 0;
        var vAppMeasures = [];
        var vAppDimensions = [];
        var vSELDEFLOW = [];
        var vSELDEFHIGH = [];
        var appmod = "";

        var CheckDim = 0;
        var CheckMes = 0;
        var CheckInfo = 0;
        var CheckQuery = 0;
        var CheckConn = 0;
        var CheckMod = 0;

        var vNoCuUn = getCookie("NoCuUn");
        var vDimuMes = getCookie("DimuMes");
        console.log(vNoCuUn);
        console.log(vDimuMes);
        console.log('done');

        var vVarDisplay = [];
        var reloaded = null;

        // AKQ INjection
        // var to select Variables
        var akqSelVariables = [];
        var akqSelVariablesControler = [];
        var akqSelHighVariablesControler = [];
        var akqAssistMultiCheckBool = [];   // Assist array to check if the Multi Selection button is checked
        var akqAssistVaueWhichLowPopOverSelected = '' // givs information which Low Variable Popover is opend
        var akqAssistVaueWhichLowPopOverSelectedHigh = '';
        var akqListObjectVariable;  // create a Object to store the List object in it
        var akqListObject;  // create a Object to store the List object in it
        var akqPivotObject;     // creates a Object to store the Pivot Cube in it
        var enigma;     // create the enigma Object
        var objectList = [];

        // DIALOG SELECT QUERY

        $("#selquery").on('click', function () {
            $('#myTab a[href="#Query"]').tab('show');
            $('.progress-bar').css('width', '15%');
            var vTimeout5 = setTimeout(myTimer5, 100);
            function myTimer5() {
                qlik.resize();
            };
        });

        $("#QuerySelection1").on('click', function () {
            if (CheckInfo == 0 || CheckQuery == 0) {
                $('#ErrorCreateApp').modal('show');
                if (CheckInfo == 0) {
                    $('#CheckInfo').show();
                }
                if (CheckQuery == 0) {
                    $('#CheckQuery').show();
                }
            } else {
                $('#todo1').hide();
                $('#explanation1').hide();
                $('#explanation2').show();
                $('#todo2').fadeIn();
                var vTimeout5 = setTimeout(myTimer5, 100);
                function myTimer5() {
                    qlik.resize();
                };
                $('.progress-bar').css('width', '15%');
            }
        });

        $('#QueryBack').on('click', function () {
            $('#todo2').hide();
            $('#explanation2').hide();
            $('#explanation1').show();
            $('#todo1').show();
            var vTimeout5 = setTimeout(myTimer5, 100);
            function myTimer5() {
                qlik.resize();
            };
            $('.progress-bar').css('width', '1%');
        });

        $("#QuerySelection2").on('click', function () {
            if (CheckInfo == 0 || CheckDim == 0 || CheckQuery == 0 || CheckMes == 0) {
                $('#ErrorCreateApp').modal('show');
                if (CheckInfo == 0) {
                    $('#CheckInfo').show();
                }
                if (CheckQuery == 0) {
                    $('#CheckQuery').show();
                }
                if (CheckDim == 0) {
                    $('#CheckDim').show();
                }
                if (CheckMes == 0) {
                    $('#CheckMes').show();
                }
            } else {
                $('#myTab a[href="#Vars"]').tab('show');
                $('.progress-bar').css('width', '35%');
            }
        });

        $("#rerun").on('click', function () {
            location.reload();
        });

        $("#VarBack").on('click', function () {
            $('#myTab a[href="#Query"]').tab('show');
            var vTimeout5 = setTimeout(myTimer5, 100);
            function myTimer5() {
                qlik.resize();
            };
            $('.progress-bar').css('width', '15%');

        });

        $("#DataConBack").on('click', function () {
            $('#myTab a[href="#Vars"]').tab('show');
            $('.progress-bar').css('width', '35%');
        });

        $('#reloaddata, #PickDataCon').on('click', function () {
            if (CheckDim == 0 || CheckInfo == 0 || CheckMes == 0 || CheckQuery == 0 || CheckConn == 0) {
                $('#ErrorCreateApp').modal('show');
                if (CheckInfo == 0) {
                    $('#CheckInfo').show();
                }
                if (CheckQuery == 0) {
                    $('#CheckQuery').show();
                }
                if (CheckDim == 0) {
                    $('#CheckDim').show();
                }
                if (CheckMes == 0) {
                    $('#CheckMes').show();
                }
                if (CheckConn == 0) {
                    $('#CheckConn').show();
                }
            } else {

                $('#myTab a[href="#Reload"]').tab('show');
                $('.progress-bar').css('width', '100%');
                $('#sapsysteminfo').empty();
                $('#queryinfo').empty();
                $('#diminfo').empty();
                $('#mesinfo').empty();
                $('#varinfo').empty();

                var vDimarr = vDimensionsS.split(', ');
                var vMesarr = vMeasuresS.split(', ');
                var vDimCount = vDimarr.length;
                var vMesCount = vMesarr.length;
                var vParametersCount = 0;
                var vVarCount = 0;

                akqSelVariablesControler.forEach(function (entry) {
                    vParametersCount = entry.length + vParametersCount;
                    vVarCount++;
                });

                $('#sapsyteminfo').append(vSapsystemS);
                $('#queryinfo').append(vBexQueryDes);

                $.each(vDimarr, function (index, value) {
                    $('#diminfo').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
                });
                $.each(vMesarr, function (index, value) {
                    $('#mesinfo').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
                });
                if (vVarDisplay.length < 1) {
                    $('#varrow').hide();
                } else {
                    $.each(vVarDisplay, function (index, value) {
                        $('#varinfo').append('<li class="listicon" style="list-style: none; left: 2em; position: relative;">' + value + '</li>');
                    });
                }

                //Infochart
                app.visualization.create('barchart',
                [
                    {
                        qDef: {
                            qFieldDefs: ["=ValueList('SAP Systems','Queries','Dimensions','Measures','Variables','Parameters')"],
                            "qFieldLabels": ["Selection"]
                        },
                    },
                    {
                        qDef: {
                            qDef: "=pick(rowno(),1,1," + vDimCount + "," + vMesCount + "," + vVarCount + "," + vParametersCount + ")",
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
            }

        });

        // APP UI functions

        function AppUi(app) {
            var me = this;
            this.app = app;
            app.global.isPersonalMode(function (reply) {
                me.isPersonalMode = reply.qReturn;
            });
            app.getList("BookmarkList", function (reply) {
                var str = "";
                reply.qBookmarkList.qItems.forEach(function (value) {
                    if (value.qData.title) {
                        str += '<li><a class="linkstyle" href="#" data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
                    }
                });
                str += '<li role="separator" class="divider"></li><li><a href="#" data-cmd="create"><b>Create Bookmark</b></a></li>';
                $('#qbmlist').html(str).find('a').on('click', function () {
                    var id = $(this).data('id');
                    if (id) {
                        app.bookmark.apply(id);
                    } else {
                        var cmd = $(this).data('cmd');
                        if (cmd === "create") {
                            $('#createBmModal').modal();
                        }
                    }
                });
            });
        }
        $("[data-qcmd]").on('click', function () {
            var $element = $(this);
            switch ($element.data('qcmd')) {
                //app level commands
                case 'createBm':
                    var title = $("#bmtitle").val(), desc = $("#bmdesc").val();
                    app.bookmark.create(title, desc);
                    $('#createBmModal').modal('hide');
                    break;
            }
        });

        // Infoprovider to Variable
        function showDataInfo(reply, app) {
            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (typeof value[0].qText !== 'undefined' && value[0].qState == 'S') {
                    vInfoprovider = value[0].qText
                } else {
                    if (typeof value[0].qText !== 'undefined' && value[0].qState == 'O') {
                        vInfoprovider = value[0].qText
                    }
                }
            });
        }

        // BexQuery to Variable
        function showDataBex(reply, app) {
            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (typeof value[0].qText !== 'undefined' && value[0].qState == 'S') {
                    vBexQuery = value[0].qText
                } else {
                    if (typeof value[0].qText !== 'undefined' && value[0].qState == 'O') {
                        vBexQuery = value[0].qText
                    }
                }
            });
        }

        // BexQueryDes to Variable
        function showDataBexDes(reply, app) {
            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (typeof value[0].qText !== 'undefined' && value[0].qState == 'S') {
                    vBexQueryDes = value[0].qText
                } else {
                    if (typeof value[0].qText !== 'undefined' && value[0].qState == 'O') {
                        vBexQueryDes = value[0].qText
                    }
                }
            });
        }

        // Get Variables from APP
        function showVariables(reply) {
            vLoad = reply.Load;
            vDimensions = reply.Dimensions;
            vMeasures = reply.Measures;
            vUnit = reply.Unit;
        };

        //GET BexVariables from APP
        function showBexVariables(reply, app) {
            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (typeof value[0].qText !== 'undefined' && value[0].qState == 'O') {
                    vBexVariable = value[0].qText;
                }
            });
        }

        //GET VAR_NAM from APP
        function getVar_NAM(reply, app) {
            namearr = [];
            var vVarNAMCounter1 = 0;
            var vVarNAMCounter2 = 0;
            var vVarNAMCounter3 = 0;
            $('#SetVariables').empty();
            table += '<table id="Variabletable" border=0><thead style="text-align: center;vertical-align: middle;"><tr><th style="width:50px;">I/O</th><th>Name</th><th>Sign</th><th>Option</th><th>Low</th><th>High</th><th style="display:none;">Technical Name</th><th>Multi-Select</th></tr></thead><tbody>';

            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (value[0].qText !== 'undefined' && value[0].qState == 'O') {
                    vVarNAM = value[0].qText;
                    vVarNAMCounter1++;

                    table += '<tr id="ROW' + vVarNAMCounter1 + '" title = ' + value[0].qText + '>';
                    table += '<td  style="text-align: center;vertical-align: middle;"><input id="Check' + vVarNAMCounter1 + '"type="checkbox" value="" style="margin:5px;"></td>'
                    table += '<td><span class="input-group" id="Name' + vVarNAMCounter1 + '"></span></td>';
                    table += '<td><select id="Sign' + vVarNAMCounter1 + '" class="selectpicker show-menu-arrow" data-size="10" title="nothing selected" data-style="btn-default" style="display: none;"><option>Include</option><option>Exclude</option></td>'
                    table += '<td><select id="Option' + vVarNAMCounter1 + '" class=" akqOption selectpicker show-menu-arrow" data-size="10" title="nothing selected" data-style="btn-default" style="display: none;"><option value="=">=</option><option value="<>"><></option><option value="<"><</option><option value=">">></option><option value="<="><=</option><option value=">=">>=</option><option value="Between">Between</option></td>'

                    // AKQ INJECTION
                    table += '<td><button id="LOWSEL' + vVarNAMCounter1 + '" class="LOWSELCLICK" style="heigth: 20px;" >nothing selected<span class="bs-caret"><span class="caret"></span></span></button></td>'

                    // AKQ Injection
                    table += '<td><button id="HIGHSEL' + vVarNAMCounter1 + '" class="HIGHSELCLICK" data-style="btn-default" style="heigth: 20px;"> nothing selected <span class="bs-caret"><span class="caret"></span></span></button></td>'
                    table += '<td style="display:none;"><span id="Tname' + vVarNAMCounter1 + '" class="input-group" id="basic-addon1" style="display:none;"></span></td>';

                    // AKQ INJECTION
                    table += '<td  style="text-align: center;vertical-align: middle;"><input class="CheckMultiSelect" id="CheckMultiSelect' + vVarNAMCounter1 + '"type="checkbox" value="" style="margin:5px;"></td>'

                    app.createGenericObject({
                        COUNTER: { qStringExpression: "=count(distinct{<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>}MEM_CAP)" },
                        TECHNAMEVAR: { qStringExpression: "=concat(distinct{<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>}VAR_NAM_FINAL)" },
                        MANDATORY: { qStringExpression: "=concat(distinct{<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>}VAR_ENTRY_TYPE)" },
                        SELECTTYPE: { qStringExpression: "=concat(distinct{<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>}VAR_SELC_TYPE)" },
                        DEFAULT_LOW: { qStringExpression: "=concat(distinct{<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>}DEFAULT_LOW)" },
                        DEFAULT_HIGH: { qStringExpression: "=concat(distinct{<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>}DEFAULT_HIGH)" },
                        NAME: { qStringExpression: "=concat(distinct {<[DESCRIPTION_VARIABLE] = {" + "'" + vVarNAM + "'" + "}>} [DESCRIPTION_VARIABLE],'~')" },
                    }, Stringtoli);

                    function Stringtoli(reply) {
                        vVarNAMCounter2++;
                        vVarNAMCounter3++;
                        arrr = reply.TECHNAMEVAR;
                        vvariabletype = reply.MANDATORY;
                        vselecttype = reply.SELECTTYPE;
                        $('#ROW' + vVarNAMCounter3).addClass('vartype' + vvariabletype);
                        if (vvariabletype == 1 || vvariabletype == 2) {
                            $('#Check' + vVarNAMCounter3).addClass('MANDATORY');
                        }

                        switch (vselecttype) {
                            case '1':
                                $('#Option' + vVarNAMCounter3 + " option[value='Between']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<>']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='>']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<=']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='>=']").remove();
                                $('#HIGHSEL' + vVarNAMCounter3).prop('disabled', true);
                                break;

                            case '2':
                                $('#Option' + vVarNAMCounter3 + " option[value='<>']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='>']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<=']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='>=']").remove();
                                break;

                            case '3':
                                break;

                            case '4':
                                $('#Option' + vVarNAMCounter3 + " option[value='Between']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<>']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='>']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='<=']").remove();
                                $('#Option' + vVarNAMCounter3 + " option[value='>=']").remove();
                                $('#HIGHSEL' + vVarNAMCounter3).prop('disabled', true);
                                break;
                        }
                        vSELDEFLOW.push(vVarNAMCounter3);
                        vSELDEFLOW.push(reply.DEFAULT_LOW);
                        vSELDEFLOW.push(reply.SELECTTYPE);
                        vSELDEFHIGH.push(vVarNAMCounter3);
                        vSELDEFHIGH.push(reply.DEFAULT_HIGH);
                        vSELDEFHIGH.push(reply.SELECTTYPE);
                        namearr.push(reply.NAME.split('~'));
                        $('#Tname' + vVarNAMCounter3).append(arrr);
                        $('#Name' + vVarNAMCounter3).append(namearr[vVarNAMCounter3 - 1]);
                    };
                };
                table += '</tr>';
            });
            $('#SetVariables').append(table);
            table = "";

            var vTimeout1 = setTimeout(myTimer1, 2000);
            function myTimer1() {
                $('.selectpicker').selectpicker();
                //console.log(vSELDEFLOW);
                //console.log(vSELDEFLOW.length);
                for (var i = 0; i < vSELDEFLOW.length; i = i + 3) {
                    var n = i + 1;
                    var m = i + 2;
                    $('#LOWSEL' + vSELDEFLOW[i]).selectpicker('val', vSELDEFLOW[n]);
                    $('#Sign' + vSELDEFLOW[i]).selectpicker('val', 'Include');

                    switch (vSELDEFLOW[m]) {
                        case '1':
                            $('#Option' + vSELDEFLOW[i]).selectpicker('val', '=');
                            break;

                        case '2':
                            $('#Option' + vSELDEFLOW[i]).selectpicker('val', 'Between');
                            break;

                        case '3':
                            $('#Option' + vSELDEFLOW[i]).selectpicker('val', '=');
                            break;

                        case '4':
                            $('#Option' + vSELDEFLOW[i]).selectpicker('val', '=');
                            break;
                    }
                    //console.log(vSELDEFLOW[i]);
                    //console.log(vSELDEFLOW[n]);
                }
                for (var i = 0; i < vSELDEFHIGH.length; i = i + 2) {
                    var n = i + 1;
                    $('#HIGHSEL' + vSELDEFHIGH[i]).selectpicker('val', vSELDEFHIGH[n]);
                    //console.log(vSELDEFHIGH[i]);
                    //console.log(vSELDEFHIGH[n]);
                }
            }
            app.destroySessionObject(reply.qInfo.qId);
        }

        //open apps -- inserted here --
        var app = qlik.openApp(applicationid, config);
        app.clearAll();

        //get objects -- inserted here --
        app.getObject('CurrentSelections', 'CurrentSelections');
        app.getObject('QV01', 'mBUArP');
        app.getObject('QV02', 'pnAUuj');
        app.getObject('QV03', 'aKkvJ');
        app.getObject('QV04', 'CKhWABg');
        app.getObject('QV05', 'qyJyLCx');
        app.getObject('QV06', 'mAX');


        //create cubes and lists -- inserted here --
        app.createList({
            "qFrequencyMode": "V",
            "qDef": {
                "qFieldDefs": [
                        "QUERY_CAT"
                ]
            },
            "qExpressions": [],
            "qInitialDataFetch": [
                    {
                        "qHeight": 10000,
                        "qWidth": 1
                    }
            ],
            "qLibraryId": null
        }, showDataInfo);
        app.createList({
            "qFrequencyMode": "V",
            "qDef": {
                "qFieldDefs": [
                        "QUERY_NAME"
                ]
            },
            "qExpressions": [],
            "qInitialDataFetch": [
                    {
                        "qHeight": 10000,
                        "qWidth": 1
                    }
            ],
            "qLibraryId": null
        }, showDataBex);
        app.createList({
            "qFrequencyMode": "V",
            "qDef": {
                "qFieldDefs": [
                        "DESCRIPTION_QUERY"
                ]
            },
            "qExpressions": [],
            "qInitialDataFetch": [
                    {
                        "qHeight": 10000,
                        "qWidth": 1
                    }
            ],
            "qLibraryId": null
        }, showDataBexDes);

        //app.createGenericObject({

        //})

        app.createGenericObject({
            Load: {
                qStringExpression: "=$(SenseVLoad)"
            },
            Dimensions: {
                qStringExpression: "=$(SenseVDimensions)"
            },
            Measures: {
                qStringExpression: "=$(SenseVMeasures)"
            },
            Unit: {
                qStringExpression: "=$(SenseVUnit)"
            }
        }, showVariables);
        app.createGenericObject({
            Selected: {
                qStringExpression: "=if(GetSelectedCount(QUERY_CAT) < 1 and GetSelectedCount(QUERY_NAME) < 1 and GetSelectedCount(DIM_NAM) < 1 and GetSelectedCount(MES_NAM) < 1 ,if(GetSelectedCount(DIM_NAM) <> 0 and GetSelectedCount(MES_NAM) <> 0 and GetSelectedCount(DESCRIPTION_QUERY) <> 0,1,0),1)"
            },
            SelectedDimensions: {
                qStringExpression: "=if(GetFieldSelections(DIM_CAP)<> null(), Concat(DISTINCT DIM_NAM , ',' ) & ',')"
                //qStringExpression: "=if(GetFieldSelections(DIM_NAM)<> null(), Concat(DISTINCT DIM_NAM , ',' ) & ',')"
            },
            SelectedDimensionsDESC: {
                qStringExpression: "=if(GetFieldSelections(DIM_CAP)<> null(), Concat(DISTINCT DIM_CAP , ', ' ))"
            },
            SelectedMeasures: {
                qStringExpression: "=if(GetFieldSelections(MES_CAP)<> null(), Concat(DISTINCT MES_NAM , ',' ) & ',')"
                //qStringExpression: "=if(GetFieldSelections(MES_NAM)<> null(), Concat(DISTINCT MES_NAM , ',' ) & ',')"
            },
            SelectedMeasuresDESC: {
                qStringExpression: "=if(GetFieldSelections(MES_CAP)<> null(), Concat(DISTINCT MES_CAP , ', ' ))"
            },
            SelectInfoprovider: {
                qStringExpression: "=if(GetFieldSelections(QUERY_CAT)<> null(), Concat(DISTINCT QUERY_CAT , ',' ) & ',')"
            },
            SelectQuery: {
                qStringExpression: "=if(GetFieldSelections(QUERY_NAME)<> null(), Concat(DISTINCT QUERY_NAME , ',' ) & ',')"
            },
            SelectedSAPSystem: {
                qStringExpression: "=if(GetFieldSelections(SAP_SYSTEM)<> null(), Concat(DISTINCT SAP_SYSTEM , ', ' ))"
            }

        }, function (status) {
            vAppDimensions = status.SelectedDimensions;
            //console.log(vAppDimensions);
            vAppMeasures = status.SelectedMeasures;
            //console.log(vAppMeasures);
            vDimensionsS = status.SelectedDimensionsDESC;
            //console.log(vDimensionsS);
            vMeasuresS = status.SelectedMeasuresDESC;
            //console.log(vMeasuresS);
            vSapsystemS = status.SelectedSAPSystem;
            //console.log(vSapsystemS);

            if (status.SelectedDimensions != '-') {
                CheckDim = 1;
            } else {
                CheckDim = 0;
            }

            if (status.SelectedMeasures != '-') {
                CheckMes = 1;
            } else {
                CheckMes = 0;
            }

            if (status.SelectInfoprovider != '-') {
                CheckInfo = 1;
            } else {
                CheckInfo = 0;
            }

            if (status.SelectQuery != '-') {
                CheckQuery = 1;
            } else {
                CheckQuery = 0;
            }

            //console.log('CheckQuery: ' + CheckQuery);
            //console.log('CheckInfo: ' + CheckInfo);
            //console.log('CheckDim: ' + CheckDim);
            //console.log('CheckMes: ' + CheckMes);

            var status = status.Selected;
        });

        //SetVariables
        $('#createvariables').on('click', function () {
            vSwitch = 0;
        });
        $('#createvariables, #QuerySelection2').on('click', function () {

            var akqSelVariables = [];
            var akqSelVariablesControler = [];
            var akqSelHighVariablesControler = [];
            var akqAssistMultiCheckBool = [];   // Assist array to check if the Multi Selection button is checked
            var akqAssistVaueWhichLowPopOverSelected = '' // givs information which Low Variable Popover is opend
            var akqAssistVaueWhichLowPopOverSelectedHigh = '';
            var akqListObjectVariable;  // create a Object to store the List object in it
            var akqListObject;  // create a Object to store the List object in it
            var akqPivotObject;     // creates a Object to store the Pivot Cube in it
            var enigma;     // create the enigma Object
            var objectList = [];


            if (CheckInfo == 0 || CheckDim == 0 || CheckQuery == 0 || CheckMes == 0) {
                $('#ErrorCreateApp').modal('show');
                if (CheckInfo == 0) {
                    $('#CheckInfo').show();
                }
                if (CheckQuery == 0) {
                    $('#CheckQuery').show();
                }
                if (CheckDim == 0) {
                    $('#CheckDim').show();
                }
                if (CheckMes == 0) {
                    $('#CheckMes').show();
                }
            } else {

                var vVarNAMCounter1 = 0;
                var vVarNAMCounter2 = 0;
                var vVarNAMCounter3 = 0;
                $('#SetVariables').empty();
                app.createList({
                    "qDef": {
                        "qFieldDefs": [
                                "DESCRIPTION_VARIABLE"
                        ]
                    },
                    "qExpressions": [],
                    "qInitialDataFetch": [
                            {
                                "qHeight": 10000,
                                "qWidth": 1
                            }
                    ],
                    "qLibraryId": null
                }, getVar_NAM);
                $('#myTab a[href="#Vars"]').tab('show');
                $('.progress-bar').css('width', '35%');
            }
        });

        //Select Query Button
        $('#step1dot').on('click', function () {
            $('#Queryselector').fadeIn(500);
            $('#Fieldselector').fadeIn(500);
            $('#Loadscript').hide();

            $('#step4').removeClass('active');
            $('#step4').removeClass('complete');

            $('#step3').removeClass('active');
            $('#step3').removeClass('complete');

            $('#step2').removeClass('active');
            $('#step2').removeClass('complete');

            $('#step1').removeClass('complete');
            $('#step1').addClass('active');

            app.clearAll();
            CheckConn = 0;
        });

        //Append Script Step(1)
        $('#createscript').on('click', function () {
            if (CheckDim == 0 || CheckInfo == 0 || CheckMes == 0 || CheckQuery == 0) {
                $('#ErrorCreateApp').modal('show');
                if (CheckInfo == 0) {
                    $('#CheckInfo').show();
                }
                if (CheckQuery == 0) {
                    $('#CheckQuery').show();
                }
                if (CheckDim == 0) {
                    $('#CheckDim').show();
                }
                if (CheckMes == 0) {
                    $('#CheckMes').show();
                }
            } else {
                $('.selectpickerdatacon').selectpicker({
                    style: 'btn-default',
                    size: 10
                });
                $('.selectpickerdatacon').selectpicker('deselectAll');

                $('code').empty();
                $('#script').fadeOut();
                $('#minscript').hide();
                $('#maxscript').hide();

                $('#myTab a[href="#DataCon"]').tab('show');
                $('.progress-bar').css('width', '65%');


            }
        });

        //Append Script Step(2)
        $('#dataconnection').on('changed.bs.select', function (e) {
            var vLoad2 = vLoad.split(',');
            var search_term = '[CURRENCY';
            var search_term2 = '[UNIT';

            for (var i = vLoad2.length - 1; i >= 0; i--) {
                if (vLoad2[i].slice(1, 10) == search_term) {
                    vLoad2.splice(i, 1);
                } else {
                    if (vLoad2[i].slice(1, 6) == search_term2) {
                        vLoad2.splice(i, 1);
                    }
                }
            }

            var vDataconnection_transfer = '';
            console.log($('[data-id="dataconnection"]').next("div").find("li.selected > a > span.text"));
            $('[data-id="dataconnection"]').next("div").find("li.selected > a > span.text").each(function () {
                vDataconnection_transfer = $(this).context.innerText;
            });

            var vLoad3 = vLoad2.join() + ';';
            vDataConnection = "LIB CONNECT TO '" + vDataconnection_transfer + "';";
            $('code').empty();
            $('#Loadscript2').show();
            if ($('#minscript').css('display') == 'none') {
                $('#maxscript').show();
            }

            $('code').append('\n');

            // akq Injection
            for (var i = 0; i < akqSelVariablesControler.length; i++) {

                if (typeof akqSelVariablesControler[i] != "undefined") {
                    $('code').append('\n');
                    $('code').append('Set vAssistVar' + i + "=[");
                    for (var j = 0; j < akqSelVariablesControler[i].length; j++) {
                        console.log('Parameters: j = ' + j + ' length = ' + akqSelVariablesControler[i].length);
                        $('code').append("'" + akqSelVariablesControler[i][j].title + "'");
                        if (j != akqSelVariablesControler[i].length - 1) {
                            $('code').append(', ');
                        }
                    }
                    $('code').append('];');
                    $('code').append('\n');
                }
            }

            $('code').append('');

            for (var i = 0; i < akqSelVariablesControler.length; i++) {
                if (typeof akqSelVariablesControler[i] != "undefined") {
                    $('code').append('\n');
                    $('code').append('for each var' + i + ' in $(vAssistVar' + i + ')');
                }
            }

            $('code').append('\n');
            $('code').append('\n');
            $('code').append(vDataConnection);
            $('code').append('\n');
            $('code').append('\n');
            $('code').append('[' + vBexQuery + ']: \n');
            $('code').append('<b>LOAD</b> \n');
            if (vNoCuUn == 'false') {
                $('code').append(vLoad);
            } else {
                $('code').append(vLoad3);
            }
            $('code').append('\n<b>SELECT</b> ' + '[' + vBexQuery + ']');
            $('code').append('\n<b>DIMENSIONS</b> (\n');
            $('code').append(vDimensions);
            $('code').append('\n)\n');
            $('code').append('<b>MEASURES</b> (\n');
            $('code').append(vMeasures);
            $('code').append('\n)\n');
            if (vNoCuUn == 'false') {
                $('code').append('<b>UNITS</b> (\n');
                $('code').append(vUnit);
                $('code').append('\n)\n');
            } else {
                $('code').append('<b>UNITS</b> (\n');
                $('code').append('\n)\n');
            }
            $('code').append('<b>VARIABLES</b> (\n');
            $('code').append(vVariable);
            $('code').append(')\n');
            $('code').append('<b>FROM</b> [' + vInfoprovider + '];');


            $('code').append('\n');
            $('code').append('\n');
            $('code').append('<b>disconnect;</b>');

            for (var i = akqSelVariablesControler.length; i >= 0; i--) {

                if (typeof akqSelVariablesControler[i] != "undefined") {
                    $('code').append('\n');
                    $('code').append('next var' + i + ';');
                }
            }

            $('code').append('\n');
            vScript = $('code').text();

            console.log('***** Qlik Code *****', akqSelVariablesControler);
            console.log('***** Qlik Code *****', vScript);

            CheckConn = 1;
            //console.log(vScript);

            //$('#script').hide();

            $('#PickDataCon').removeClass('disabled');
            $('#PickDataCon').addClass('active');
            $('#PickDataCon').prop('disabled', false);
        });

        //Apply Variables
        $('#applyvariable').on('click', function () {


            console.log('**** IN CLICK EVENT ****');
            console.log('**** akqSelVariablesControler ****', akqSelVariablesControler);
            console.log('**** akqSelHighVariablesControler ****', akqSelHighVariablesControler);


            var numberOfChecked = $('input:checkbox:checked.MANDATORY').length;
            var numberOfMANDATORY = $('.MANDATORY').length;
            var vcheckmandatorybox = 0;

            console.log(numberOfChecked);
            console.log(numberOfMANDATORY);

            if (numberOfChecked == numberOfMANDATORY) {
                vVariable = [];
                var array = [];
                var curIndex = 0;
                var curIndex2 = 0;
                var Ende = 0;

                $(':checkbox:checked').each(function () {
                    var id = $(this).attr('id');

                    //console.log('$(this)', $(this));
                    //console.log('$(this).attr(id)', $(this).attr('id'));
                    if (id.length == 6 && $(this).attr('id').substr(0, 16) != 'CheckMultiSelect') {
                        console.log('1', $(this).attr('id').substr(0, 16));
                        num = id.substr(id.length - 1);
                        array.push(num);
                        Ende = array.length;
                    } else if ($(this).attr('id').substr(0, 16) != 'CheckMultiSelect') {
                        console.log('2', $(this).attr('id').substr(0, 16));
                        num = id.substr(id.length - 2);
                        array.push(num);
                        Ende = array.length;
                    }
                });

                function nextVar(num) {

                    console.log('num', num)
                    LOW = 'LOW=$(var' + num + ')';
                    var b = $('[data-id="HIGHSEL' + num + '"] > span').text();

                    console.log('******* asdgf *******', $('.akqOption'));

                    //console.log('akqSelHighVariablesControler', akqSelHighVariablesControler);
                    //console.log('akqSelHighVariablesControler', akqSelHighVariablesControler[num][0].title);

                    if ($('.akqOption')[num * 2 - 1].value == 'Between') {
                        if (akqSelHighVariablesControler[num] != 'undefined') {
                            HIGH = ', HIGH=' + akqSelHighVariablesControler[num][0].title;
                        } else {
                            HIGH = '';
                        }
                    } else {
                        HIGH = '';
                    }



                    TNAME = $('#Tname' + num).text();
                    TNAME = TNAME.replace('[', '');
                    TNAME = TNAME.replace(']', '');
                    vVarDisplay.push(TNAME);
                    TNAME = 'NAME=' + TNAME + ',';
                    SIGN = $('[data-id="Sign' + num + '"] > span').text();
                    switch (SIGN) {
                        case 'Include':
                            SIGN = "SIGN=I,";
                            break;
                        case 'Exclude':
                            SIGN = "SIGN=E,";
                            break;
                        case 'nothing selected':
                            SIGN = "SIGN=NOTHING_SELECTED,";
                            break;
                    }
                    OPTION = $('[data-id="Option' + num + '"] > span').text();
                    switch (OPTION) {
                        case '=':
                            OPTION = "OPTION=EQ,";
                            break;
                        case '<>':
                            OPTION = "OPTION=NE,";
                            break;
                        case '<':
                            OPTION = "OPTION=LT,";
                            break;
                        case '>':
                            OPTION = "OPTION=GT,";
                            break;
                        case '<=':
                            OPTION = "OPTION=LE,";
                            break;
                        case '>=':
                            OPTION = "OPTION=GE,";
                            break;
                        case 'Between':
                            OPTION = "OPTION=BT,";
                            break;
                        case 'nothing selected':
                            OPTION = "OPTION=NOTHING_SELECTED,";
                            break;
                    }
                    vVariable += '[' + TNAME + ' ' + SIGN + ' ' + OPTION + ' ' + LOW + HIGH + '],\n'
                    console.log('vVariable', vVariable);
                }


                for (curIndex = 0; curIndex < array.length; curIndex++) {
                    console.log('array', array);
                    nextVar(array[curIndex]);
                }
                $('.selectpickerdatacon').selectpicker({
                    style: 'btn-default',
                    size: 10
                });
                $('.selectpickerdatacon').selectpicker('deselectAll');

                $('code').empty();
                $('#script').fadeOut();
                $('#minscript').hide();
                $('#maxscript').hide();
                $('#myTab a[href="#DataCon"]').tab('show');
                $('.progress-bar').css('width', '65%');

            } else {
                $('#ErrorVariable').modal('show');
            }
        });

        //Create App
        $('#createapp').on('click', function () {

            var vApp = "";
            var vAppID = "";
            var vTimestamp = timeStamp();
            var notify = "";

            if (CheckDim == 0 || CheckInfo == 0 || CheckMes == 0 || CheckQuery == 0 || CheckConn == 0) {
                $('#ErrorCreateApp').modal('show');
                if (CheckInfo == 0) {
                    $('#CheckInfo').show();
                }
                if (CheckQuery == 0) {
                    $('#CheckQuery').show();
                }
                if (CheckDim == 0) {
                    $('#CheckDim').show();
                }
                if (CheckMes == 0) {
                    $('#CheckMes').show();
                }
                if (CheckConn == 0) {
                    $('#CheckConn').show();
                }
            } else {
                /* Create APP */
                //const qsocks = require(applicationfolder + "/js/qsocks.bundle");
                var qsocks = require(applicationfolder + "/js/qsocks.bundle");

                qsocks.Connect(config).then(function (global) {
                    global.productVersion().then(function (version) {
                        $.notify({ icon: 'glyphicon glyphicon-ok', message: 'Connection to Qlik Sense Server establised.' }, { type: 'success', placement: { from: 'bottom', align: 'right' } });
                        vApp = vNamespace + vBexQuery + '_' + vTimestamp;
                        return global.createApp('Query_' + vBexQuery + '_' + vTimestamp);
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
                        var myscript = vScript;
                        myscript += '\n//SAPSCRIPT';
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
                            localsettings += "///$tab SAP\r\n";
                            // localsettings += "///$autogenerated\r\n"
                            localsettings += '\n//SAPSCRIPT'


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
                                //Create Master Dimensions
                                .then(function () {
                                    if (vDimuMes == 'true') {

                                        var appdefault = qlik.openApp(applicationid, config);
                                        var appresult = qlik.openApp(vAppID, config)
                                        var i = '';
                                        var y = '';
                                        var vDimensionString = vDimensions.split(',');

                                        for (var i = vDimensionString.length - 1; i >= 0; i--) {
                                            var CurrDim = vDimensionString[i - 1];
                                            CurrDim = CurrDim.replace(/(\r\n|\n|\r)/gm, "");
                                            CurrDim = CurrDim.replace(/[\][]/g, '');

                                            function AskDimensionName(Dimension) {
                                                appdefault.createGenericObject({
                                                    Dimensionname: { qStringExpression: "=concat(distinct {<[DIM_NAM] = {" + "'" + Dimension + "'" + "}>} [DIM_CAP])" }
                                                }, function (DIM) {
                                                    CreateDimension(DIM.Dimensionname)
                                                    appdefault.destroySessionObject(DIM.qInfo.qId);
                                                });
                                            };

                                            function CreateDimension(DimNam) {
                                                app.createDimension({
                                                    qInfo: {
                                                        qId: '',
                                                        qType: 'dimension'
                                                    },
                                                    qDim: {
                                                        qGrouping: 'N',
                                                        qFieldDefs: [DimNam],
                                                        qFieldLabels: [DimNam],
                                                        title: DimNam
                                                    },
                                                    qMetaDef: {
                                                        title: DimNam,
                                                        tags: [DimNam],
                                                        description: DimNam
                                                    }
                                                });

                                            };

                                            AskDimensionName(CurrDim);

                                            if (i == 1) {

                                                return;
                                            }
                                        }

                                    } else {
                                        return;
                                    }
                                })

                                //Create Master Measures
                                .then(function () {
                                    if (vDimuMes == 'true') {

                                        var appdefault = qlik.openApp(applicationid, config);
                                        var appresult = qlik.openApp(vAppID, config)
                                        var i = '';
                                        var y = '';
                                        var vMeasuresString = vMeasures.split(',');

                                        for (var i = vMeasuresString.length - 1; i >= 0; i--) {
                                            var CurrMes = vMeasuresString[i - 1];
                                            CurrMes = CurrMes.replace(/(\r\n|\n|\r)/gm, "");
                                            CurrMes = CurrMes.replace(/[\][]/g, '');

                                            function AskMeasureName(Measure) {
                                                appdefault.createGenericObject({
                                                    Measurename: { qStringExpression: "=concat(distinct {<[MES_NAM] = {" + "'" + Measure + "'" + "}>} [MES_CAP])" }
                                                }, function (MES) {
                                                    CreateMeasure(MES.Measurename)
                                                    appdefault.destroySessionObject(MES.qInfo.qId);
                                                });
                                            };

                                            function CreateMeasure(MesNam) {
                                                app.createMeasure({
                                                    qInfo: {
                                                        qId: '',
                                                        qType: 'measure'
                                                    },
                                                    qMeasure: {
                                                        qLabel: MesNam,
                                                        qDef: '=Sum([' + MesNam + '])'
                                                    },
                                                    qMetaDef: {
                                                        title: 'Total ' + MesNam,
                                                        description: 'Total ' + MesNam
                                                    }
                                                })

                                            };

                                            AskMeasureName(CurrMes);

                                            if (i == 1) {
                                                return;
                                            }
                                        }

                                    } else {
                                        return;
                                    }
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

                                    ////insert Variables
                                    var appresult = qlik.openApp(vAppID, config);
                                    appresult.variable.create({
                                        qName: 'cInfoprovider',
                                        qDefinition: vInfoprovider
                                    });
                                    appresult.variable.create({
                                        qName: 'cBExQuery',
                                        qDefinition: vBexQuery
                                    });
                                    appresult.variable.create({
                                        qName: 'cBExQueryDes',
                                        qDefinition: vBexQueryDes
                                    });
                                    appresult.variable.create({
                                        qName: 'cDataCon',
                                        qDefinition: vDataConnection
                                    });
                                    appresult.variable.create({
                                        qName: 'cDimensions',
                                        qDefinition: vAppDimensions
                                    });
                                    appresult.variable.create({
                                        qName: 'cMeasures',
                                        qDefinition: vAppMeasures
                                    });
                                    return app.connection.close()
                                })

                            reloaded = null;
                            var progress = setInterval(function () {
                                if (reloaded != true) {
                                    conns[0].getProgress(5).then(function (msg) {
                                        if (msg.qPersistentProgress) {
                                            persistentProgress = msg.qPersistentProgress;
                                            var text = msg.qPersistentProgress;
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
                })
            }
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
        if (app) {
            new AppUi(app);
        }

        //Select all Measures Button
        $('#selallbuttonmea, #selallbuttonmea2').on('click', function () {
            app.field('MES_CAP').selectAll();
        });

        //Select all Dimensions Button
        $('#selallbuttondim, #selallbuttondim2').on('click', function () {
            app.field('DIM_CAP').selectAll();
        });

        //Enable Tooltips
        $('i').tooltip();

        //Get DataConnections from API @ start
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
                    console.log(this);
                    vConnection.push(this.qName);
                    $('#dataconnection').append('<option>' + this.qName + '</option>');
                });
            });

        });

        //Modals
        $(document).ready(function () {
            if ($.cookie("no_thanks") == null) {
                $('#startModal').appendTo("body");
                function show_modal() {
                    $('#startModal').modal();
                }
                window.setTimeout(show_modal, 1000);
            }
            $(".nothanks").click(function () {
                document.cookie = "no_thanks=true; expires=Fri, 31 Dec 9999 23:59:59 UTC";
            });
        });

        //Config Dialog

        //GetCookie
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        $('#configbutton').on('click', function () {
            var vcoockieNoCuUn = getCookie("NoCuUn");
            //console.log(vcoockieNoCuUn);
            var vcoockieDimuMes = getCookie("DimuMes");
            //console.log(vcoockieDimuMes);

            $('#config').modal('show');

            if (vcoockieNoCuUn == 'true') {
                $("[name='NoCuUn']").bootstrapSwitch('state', true);
            } else {
                $("[name='NoCuUn']").bootstrapSwitch('state', false);
            }
            $('input[name="NoCuUn"]').on('switchChange.bootstrapSwitch', function (event, state) {
                if (state == true) {
                    document.cookie = "NoCuUn=true; expires=Fri, 31 Dec 9999 23:59:59 UTC";
                    vNoCuUn = 'true';
                } else {
                    document.cookie = "NoCuUn=false; expires=Fri, 31 Dec 9999 23:59:59 UTC";
                    vNoCuUn = 'false';
                }
            });
            if (vcoockieDimuMes == 'true') {
                $("[name='DimuMes']").bootstrapSwitch('state', true);
            } else {
                $("[name='DimuMes']").bootstrapSwitch('state', false);
            }
            $("[name='DimuMes']").bootstrapSwitch();
            $('input[name="DimuMes"]').on('switchChange.bootstrapSwitch', function (event, state) {
                if (state == true) {
                    document.cookie = "DimuMes=true; expires=Fri, 31 Dec 9999 23:59:59 UTC";
                    vDimuMes = 'true';
                } else {
                    document.cookie = "DimuMes=false; expires=Fri, 31 Dec 9999 23:59:59 UTC";
                    vDimuMes = 'false';
                }
            });
        });

        //minimize  and maximize section Measures & Dimensions
        $('#minvalue').on('click', function () {
            $('#selvalues').fadeOut();
            $('#minvalue').hide();
            $('#maxvalue').show();
        });
        $('#maxvalue').on('click', function () {
            $('#selvalues').fadeIn();
            $('#maxvalue').hide();
            $('#minvalue').show();
            qlik.resize();
        });

        //minimize  and maximize section Script
        $('#minscript').on('click', function () {
            $('#script').fadeOut();
            $('#minscript').hide();
            $('#maxscript').show();
        });
        $('#maxscript').on('click', function () {
            $('#script').fadeIn();
            $('#maxscript').hide();
            $('#minscript').show();
        });

        //Clear Error Dialog
        $('#ErrorCloseMod').on('click', function () {
            $('#CheckInfo').hide();
            $('#CheckQuery').hide();
            $('#CheckDim').hide();
            $('#CheckMes').hide();
            $('#CheckConn').hide();
            $('#CheckMod').hide();
        });

        //----------- END QLIK-----------//

        //----------- START AKQUINET FUNCTIONS -----------//

        var vSelDOMObject = ''; //Save selected DOM Object

        $(document).on('click', '.LOWSELCLICK', function (event) {
            console.log('event', '#LOWSEL2', event);
            vSelDOMObject = event.target.id;
            console.log(vSelDOMObject);
            console.log('navigator.appName', navigator.userAgent.substr(0, 3));

            objectList = [];

            var variableValue = event.currentTarget.parentElement.parentElement.children[1].textContent;

            enigma = app.model.enigmaModel;
            console.log(enigma);
            var idCounter = event.target.id.substr(6);
            akqAssistVaueWhichLowPopOverSelected = event.target.id.substr(6);
            var vListObject = {
                "qListObjectDef": {
                    "qDef": {
                        "qFieldDefs": ["DESCRIPTION_VARIABLE"]
                    }
                , "qExpressions": []
                , "qInitialDataFetch": [
                    {
                        "qHeight": 10, "qWidth": 1
                    }
                ]
                , "qLibraryId": null
                }
                ,
                "qInfo": {
                    "qType": "mashup",
                    "qId": "AKQMUJsrArv"
                }
            }

            var vListObjectMES_NAM = {
                "qListObjectDef": {
                    "qDef": {
                        "qFieldDefs": ["MEM_NAM"]
                    }
                , "qExpressions": []
                , "qInitialDataFetch": [
                    {
                        "qHeight": 10000, "qWidth": 1
                    }
                ]
                , "qShowAlternatives": false
                , "qLibraryId": null
                }
                ,
                "qInfo": {
                    "qType": "mashup",
                    "qId": "AKQMUJsrMem"
                }
            }

            var objPivotList = {
                "qInfo": {
                    "qId": "CB01",
                    "qType": "Chart",
                },
                "qExtendsId": "",
                "qHyperCubeDef": {
                    "qDimensions": [{
                        "qDef": {
                            "qFieldDefs": [
                                'MEM_NAM'
                            ]
                        }
                    }],
                    qMeasures: [
                      {
                          "qDef": {
                              "qGrouping": "N",
                              "qDef": "Count(1)"
                          }
                      },
                    ],
                    "qMode": "EQ_DATA_MODE_PIVOT",
                    "qAlwaysFullyExpanded": false,
                    "qInitialDataFetch": [
                        {
                            "qTop": 0, "qLeft": 0, "qHeight": 100, "qWidth": 100
                        }
                    ]
                }
            };


            //        console.log('**** ENIGMA ****', enigma);
            // create List Object to make selection on
            enigma.createSessionObject(vListObject).then(function (res) {
                // begin Selection 
                akqListObject = res;
                //            console.log('**** Res ****', res);
                //            res.getLayout().then(function(objLayoutNorm){console.log('objLayoutNorm', objLayoutNorm)});
                res.beginSelections(["/qListObjectDef"]).then(function () {
                    // search in the List objekt for the selected Variable name
                    res.searchListObjectFor("/qListObjectDef", variableValue).then(function (result) {
                        // get layout to check value
                        res.getLayout().then(function (resultGetLayout) {
                            //                        console.log('resultGetLayout', resultGetLayout);
                            //                    });
                            // accept the search of the list object
                            res.acceptListObjectSearch("/qListObjectDef", true).then(function (resultAcceptListObjectSearch) {
                                //                        console.log('resultAcceptListObjectSearch', resultAcceptListObjectSearch);
                                // gets the result of the selection
                                res.getLayout().then(function (resultGetLayout) {
                                    //                            console.log('resultGetLayout2', resultGetLayout);
                                    // create the new session Object with only the selected values
                                    res.endSelections(true).then(function () {
                                        enigma.createSessionObject(objPivotList).then(function (resCreSesMemNam) {

                                            akqPivotObject = resCreSesMemNam;


                                            enigma.createSessionObject(vListObjectMES_NAM).then(function (listResult) {
                                                akqListObjectVariable = listResult;
                                                //                                        console.log('listResult', listResult);
                                                //                                        listResult.getLayout().then(function(listLayout){console.log('listLayout', listLayout)});
                                                //                                        listResult.searchListObjectFor("/qListObjectDef", '*01*').then(function(){
                                                //                                            listResult.getLayout().then(function(listLayout){console.log('listLayout2', listLayout)});
                                                //                                        })
                                            }).catch(function (error) {
                                                console.error(error);
                                            })

                                            objectList.push({
                                                "qTop": 0,
                                                "qLeft": 0,
                                                "qHeight": 20,
                                                "qWidth": 20
                                            })



                                            resCreSesMemNam.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {
                                                console.log('res', res);
                                                var targetId = '#' + event.target.id;
                                                var listContainer = '';
                                                listContainer += '<div class="overlappingContainer">';
                                                listContainer += '<input id="inputBoxSearchName" type="text" name="searchName">';
                                                listContainer += '<button id="searchValue"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button><hr class="section">';
                                                listContainer += '<ul id="listOfPossibleVariables">'
                                                for (var i = 0; i < res[0].qLeft.length; i++) {
                                                    //                                            listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i].qText + '</li>';
                                                    listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i].qText + '</li>';
                                                }
                                                listContainer += '</ul><hr class="section">';

                                                listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop % 20 + ' </div>';
                                                listContainer += '<button class="akqButtonList" id="closeVarSelection" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                                                listContainer += '<button class="akqButtonList" id="prevPage" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                                                listContainer += '<button class="akqButtonList" id="nextPage" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                                                listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';

                                                listContainer += '<div>';
                                                $(targetId).after(listContainer);
                                                akqAssistMultiCheckBool[parseInt(idCounter)] = $('#CheckMultiSelect' + idCounter).prop("checked");
                                                if (akqSelVariablesControler[parseInt(idCounter)]) {
                                                    for (var k = 0; k < akqSelVariablesControler[parseInt(idCounter)].length; k++) {
                                                        $('#' + akqSelVariablesControler[parseInt(idCounter)][k].id).css("background-color", "rgb(82,204,82)");
                                                    }

                                                }
                                            });


                                        })
                                    })

                                });
                            })
                        })
                    })


                })
            });
        });

        $(document).on('click', '.HIGHSELCLICK', function (event) {

            vSelDOMObject = event.target.id;
            console.log(vSelDOMObject);

            objectList = [];

            console.log('Highsel Selected')

            var variableValue = event.currentTarget.parentElement.parentElement.children[1].textContent;

            enigma = app.model.enigmaModel;
            var idCounter = event.target.id.substr(7);
            akqAssistVaueWhichLowPopOverSelectedHigh = event.target.id.substr(7);
            var vListObject = {
                "qListObjectDef": {
                    "qDef": {
                        "qFieldDefs": ["DESCRIPTION_VARIABLE"]
                    }
                , "qExpressions": []
                , "qInitialDataFetch": [
                    {
                        "qHeight": 10, "qWidth": 1
                    }
                ]
                , "qLibraryId": null
                }
                ,
                "qInfo": {
                    "qType": "mashup",
                    "qId": "AKQMUJsrArv"
                }
            }

            var vListObjectMES_NAM = {
                "qListObjectDef": {
                    "qDef": {
                        "qFieldDefs": ["MEM_NAM"]
                    }
                , "qExpressions": []
                , "qInitialDataFetch": [
                    {
                        "qHeight": 10000, "qWidth": 1
                    }
                ]
                , "qShowAlternatives": false
                , "qLibraryId": null
                }
                ,
                "qInfo": {
                    "qType": "mashup",
                    "qId": "AKQMUJsrMem"
                }
            }

            var objPivotList = {
                "qInfo": {
                    "qId": "CB01",
                    "qType": "Chart",
                },
                "qExtendsId": "",
                "qHyperCubeDef": {
                    "qDimensions": [{
                        "qDef": {
                            "qFieldDefs": [
                                'MEM_NAM'
                            ]
                        }
                    }],
                    qMeasures: [
                      {
                          "qDef": {
                              "qGrouping": "N",
                              "qDef": "Count(1)"
                          }
                      },
                    ],
                    "qMode": "EQ_DATA_MODE_PIVOT",
                    "qAlwaysFullyExpanded": false,
                    "qInitialDataFetch": [
                        {
                            "qTop": 0, "qLeft": 0, "qHeight": 100, "qWidth": 100
                        }
                    ]
                }
            };

            // create List Object to make selection on
            enigma.createSessionObject(vListObject).then(function (res) {
                // begin Selection 
                akqListObject = res;
                //            res.getLayout().then(function(objLayoutNorm){console.log('objLayoutNorm', objLayoutNorm)});
                res.beginSelections(["/qListObjectDef"]).then(function () {
                    // search in the List objekt for the selected Variable name
                    res.searchListObjectFor("/qListObjectDef", variableValue).then(function (result) {
                        // get layout to check value
                        res.getLayout().then(function (resultGetLayout) {
                            //                        console.log('resultGetLayout', resultGetLayout);

                            // accept the search of the list object
                            res.acceptListObjectSearch("/qListObjectDef", true).then(function (resultAcceptListObjectSearch) {
                                //                        console.log('resultAcceptListObjectSearch', resultAcceptListObjectSearch);
                                // gets the result of the selection
                                res.getLayout().then(function (resultGetLayout) {
                                    //                            console.log('resultGetLayout2', resultGetLayout);
                                    // create the new session Object with only the selected values
                                    res.endSelections(true).then(function () {
                                        enigma.createSessionObject(objPivotList).then(function (resCreSesMemNam) {

                                            akqPivotObject = resCreSesMemNam;


                                            enigma.createSessionObject(vListObjectMES_NAM).then(function (listResult) {
                                                akqListObjectVariable = listResult;
                                                //                                        console.log('listResult', listResult);
                                                //                                        listResult.getLayout().then(function(listLayout){console.log('listLayout', listLayout)});
                                                //                                        listResult.searchListObjectFor("/qListObjectDef", '*01*').then(function(){
                                                //                                            listResult.getLayout().then(function(listLayout){console.log('listLayout2', listLayout)});
                                                //                                        })
                                            }).catch(function (error) {
                                                console.error(error);
                                            })

                                            objectList.push({
                                                "qTop": 0,
                                                "qLeft": 0,
                                                "qHeight": 20,
                                                "qWidth": 20
                                            })

                                            resCreSesMemNam.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {
                                                var targetId = '#' + event.target.id;
                                                var listContainer = '';
                                                listContainer += '<div class="overlappingContainer">';
                                                listContainer += '<input id="inputBoxSearchName" type="text" name="searchName">';
                                                listContainer += '<button id="searchValueHigh"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button><hr class="section">';

                                                listContainer += '<ul id="listOfPossibleVariables">'
                                                for (var i = 0; i < res[0].qLeft.length; i++) {
                                                    //                                            listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i].qText + '</li>';
                                                    listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClassHigh">' + res[0].qLeft[i].qText + '</li>';
                                                }
                                                listContainer += '</ul><hr class="section">';
                                                listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop % 20 + ' </div>';

                                                listContainer += '<button class="akqButtonList" id="closeVarSelectionHigh" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                                                listContainer += '<button class="akqButtonList" id="prevPageHigh" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                                                listContainer += '<button class="akqButtonList" id="nextPageHigh" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                                                listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
                                                listContainer += '<div>';
                                                $(targetId).after(listContainer);
                                                akqAssistMultiCheckBool[parseInt(idCounter)] = $('#CheckMultiSelect' + idCounter).prop("checked");
                                                if (akqSelHighVariablesControler[parseInt(idCounter)]) {
                                                    for (var k = 0; k < akqSelHighVariablesControler[parseInt(idCounter)].length; k++) {
                                                        $('#' + akqSelHighVariablesControler[parseInt(idCounter)][k].id).css("background-color", "rgb(82,204,82)");
                                                    }

                                                }
                                            });


                                        })
                                    })

                                });
                            })
                        });
                    })
                })


            })

        });

        $(document).on('click', '.akqselectVariableClass', function (event) {
            var assistBool = false;
            var varObject = {};
            varObject.title = event.target.innerText;
            varObject.id = event.target.id;
            var assistNr = event.target.id.split('-')[event.target.id.split('-').length - 1];
            //        varObject.nr = event.target.id.substr(-1,1);
            varObject.nr = assistNr;

            console.log('varObject', varObject);
            console.log('akqAssistMultiCheckBool', akqAssistMultiCheckBool);

            if (akqAssistMultiCheckBool[parseInt(akqAssistVaueWhichLowPopOverSelected)]) {
                // MULTI SELECTION            
                if (typeof akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)] == 'undefined') {
                    akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)] = [];
                }
                if (akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].length > 0) {
                    for (var i = 0; i < akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].length; i++) {
                        if (akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)][i].id == event.target.id) {


                            $('#' + varObject.id).css("background-color", "white");
                            assistBool = true;
                            akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].splice(i, 1);
                        }
                    }



                }

                if (!assistBool) {
                    $('#' + varObject.id).css("background-color", "rgb(82,204,82)");
                    akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].push(varObject);
                }

            } else {
                // SINGLE SELECTION

                $('.akqselectVariableClass').css("background-color", "white");
                akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)] = [];
                $('#' + varObject.id).css("background-color", "rgb(82,204,82)");
                akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].push(varObject);
            };
        });

        $(document).on('click', '.akqselectVariableClassHigh', function (event) {
            var assistBool = false;
            var varObject = {};
            varObject.title = event.target.innerText;
            varObject.id = event.target.id;
            var assistNr = event.target.id.split('-')[event.target.id.split('-').length - 1];
            //        varObject.nr = event.target.id.substr(-1,1);
            varObject.nr = assistNr;

            console.log('varObject', varObject);

            // SINGLE SELECTION

            $('.akqselectVariableClassHigh').css("background-color", "white");
            akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)] = [];
            $('#' + varObject.id).css("background-color", "rgb(82,204,82)");
            akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)].push(varObject);

        });

        $(document).on('click', '#closeVarSelection', function (event) {
            $('.overlappingContainer').remove();
            akqListObject.endSelections(false).then(function () {
                akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)] = [];
                enigma.getField('MEM_NAM').then(function (fieldMemNam) {
                    fieldMemNam.clear().then(function () {
                        enigma.getField('DESCRIPTION_VARIABLE').then(function (fieldVar) {
                            fieldVar.clear().then(function () {
                                enigma.destroySessionObject('AKQMUJsrArv').then(function () {
                                    //                                console.log('destroy session object akq List Object');
                                    enigma.destroySessionObject('CB01').then(function () {
                                        //                                    console.log('destroy session object akq Pivot Object');
                                    });
                                });

                            });
                        });
                    });
                });
            }).catch(function (error) {
                console.error(error);
            })
        });

        $(document).on('click', '#closeVarSelectionHigh', function (event) {
            $('.overlappingContainer').remove();
            akqListObject.endSelections(false).then(function () {
                akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)] = [];
                enigma.getField('MEM_NAM').then(function (fieldMemNam) {
                    fieldMemNam.clear().then(function () {
                        enigma.getField('DESCRIPTION_VARIABLE').then(function (fieldVar) {
                            fieldVar.clear().then(function () {
                                enigma.destroySessionObject('AKQMUJsrArv').then(function () {
                                    //                                console.log('destroy session object akq List Object');
                                    enigma.destroySessionObject('CB01').then(function () {
                                        //                                    console.log('destroy session object akq Pivot Object');
                                    });
                                });

                            });
                        });
                    });
                });
            }).catch(function (error) {
                console.error(error);
            })
        });

        $(document).on('click', '#applVarSelection', function (event) {
            $('.overlappingContainer').remove();
            akqListObject.endSelections(false).then(function () {
                enigma.getField('MEM_NAM').then(function (fieldMemNam) {
                    fieldMemNam.clear().then(function () {
                        enigma.getField('DESCRIPTION_VARIABLE').then(function (fieldVar) {
                            fieldVar.clear().then(function () {
                                enigma.destroySessionObject('AKQMUJsrArv').then(function () {
                                    //                                console.log('destroy session object akq List Object');
                                    enigma.destroySessionObject('CB01').then(function () {
                                        //                                    console.log('destroy session object akq Pivot Object');
                                    });
                                });
                            });
                        });
                    });
                });
            }).catch(function (error) {
                console.error(error);
            });

            // Change Text of Button
            if (vSelDOMObject.substring(0, 1) == 'L') {
                $('#' + vSelDOMObject).text(akqSelVariablesControler[akqSelVariablesControler.length - 1].length + ' selection(s)');
                $('#' + vSelDOMObject).append('<span class="bs-caret"><span class="caret"></span></span>');
            } else {
                $('#' + vSelDOMObject).text(akqSelHighVariablesControler[akqSelHighVariablesControler.length - 1].length + ' selection(s)');
                $('#' + vSelDOMObject).append('<span class="bs-caret"><span class="caret"></span></span>');
            }
        });

        $(document).on('click', '#nextPage', function (event) {
            // set the next 20 Values
            objectList[0].qTop += 20;
            // gets the 20 next selected values
            akqPivotObject.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {
                var listContainer = '';
                $('#listOfPossibleVariables').remove();
                $('#closeVarSelection').remove();
                $('#applVarSelection').remove();
                $('#nextPage').remove();
                $('#prevPage').remove();
                $('#PagePosition').remove();
                $('.section').remove();

                listContainer += '<hr class="section">';
                listContainer += '<ul id="listOfPossibleVariables">'
                for (var i = objectList[0].qTop; i < res[0].qLeft.length + objectList[0].qTop; i++) {
                    //                listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i-objectList[0].qTop].qText + '</li>';
                    listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i - objectList[0].qTop].qText + '</li>';
                }
                listContainer += '</ul><hr class="section">';
                listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop / 20 + ' </div>';
                listContainer += '<button class="akqButtonList" id="closeVarSelection" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="prevPage" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="nextPage" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';

                $('.overlappingContainer').append(listContainer);

                if (akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)]) {
                    for (var k = 0; k < akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].length; k++) {
                        $('#' + akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)][k].id).css("background-color", "rgb(82,204,82)");
                    }

                }

            })
        });

        $(document).on('click', '#nextPageHigh', function (event) {
            // set the next 20 Values
            objectList[0].qTop += 20;
            // gets the 20 next selected values
            akqPivotObject.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {
                var listContainer = '';
                $('#listOfPossibleVariables').remove();
                $('#closeVarSelectionHigh').remove();
                $('#applVarSelection').remove();
                $('#nextPageHigh').remove();
                $('#prevPageHigh').remove();
                $('#PagePosition').remove();
                $('.section').remove();

                listContainer += '<hr class="section">';
                listContainer += '<ul id="listOfPossibleVariables">'
                for (var i = objectList[0].qTop; i < res[0].qLeft.length + objectList[0].qTop; i++) {
                    //                listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i-objectList[0].qTop].qText + '</li>';
                    listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i - objectList[0].qTop].qText + '</li>';
                }
                listContainer += '</ul><hr class="section">';
                listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop / 20 + ' </div>';
                listContainer += '<button class="akqButtonList" id="closeVarSelectionHigh" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="prevPageHigh" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="nextPageHigh" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';

                $('.overlappingContainer').append(listContainer);

                if (akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)]) {
                    for (var k = 0; k < akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)].length; k++) {
                        $('#' + akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)][k].id).css("background-color", "rgb(82,204,82)");
                    }

                }

            })
        });

        // FINISHED
        $(document).on('click', '#prevPage', function (event) {
            // selects the prev 20 values
            objectList[0].qTop -= 20;
            // gets the 20 previous selected values
            akqPivotObject.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {
                var listContainer = '';
                $('#listOfPossibleVariables').remove();
                $('#closeVarSelection').remove();
                $('#applVarSelection').remove();
                $('#nextPage').remove();
                $('#prevPage').remove();
                $('#PagePosition').remove();
                $('.section').remove();

                listContainer += '<hr class="section">';

                listContainer += '<ul id="listOfPossibleVariables">'
                for (var i = objectList[0].qTop; i < res[0].qLeft.length + objectList[0].qTop; i++) {
                    //                listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i-objectList[0].qTop].qText + '</li>'
                    listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i - objectList[0].qTop].qText + '</li>'
                }
                listContainer += '</ul><hr class="section">';
                listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop / 20 + ' </div>';
                listContainer += '<button class="akqButtonList" id="closeVarSelection" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="prevPage" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="nextPage" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
                $('.overlappingContainer').append(listContainer);

                if (akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)]) {
                    for (var k = 0; k < akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].length; k++) {
                        $('#' + akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)][k].id).css("background-color", "rgb(82,204,82)");
                    }

                }

            });
        });

        $(document).on('click', '#prevPageHigh', function (event) {
            // selects the prev 20 values
            objectList[0].qTop -= 20;
            // gets the 20 previous selected values
            akqPivotObject.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {
                var listContainer = '';
                $('#listOfPossibleVariables').remove();
                $('#closeVarSelectionHigh').remove();
                $('#applVarSelection').remove();
                $('#nextPageHigh').remove();
                $('#prevPageHigh').remove();
                $('#PagePosition').remove();
                $('.section').remove();

                listContainer += '<hr class="section">';
                listContainer += '<ul id="listOfPossibleVariables">'
                for (var i = objectList[0].qTop; i < res[0].qLeft.length + objectList[0].qTop; i++) {
                    //                listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i-objectList[0].qTop].qText + '</li>'
                    listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i - objectList[0].qTop].qText + '</li>'
                }
                listContainer += '</ul><hr class="section">';
                listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop / 20 + ' </div>';
                listContainer += '<button class="akqButtonList" id="closeVarSelectionHigh" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="prevPageHigh" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="nextPageHigh" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
                $('.overlappingContainer').append(listContainer);

                if (akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)]) {
                    for (var k = 0; k < akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)].length; k++) {
                        $('#' + akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)][k].id).css("background-color", "rgb(82,204,82)");
                    }

                }

            });
        });

        // FINISHED
        $(document).on('click', '#searchValue', function (event) {
            // Begin selection
            akqListObjectVariable.beginSelections(["/qListObjectDef"]).then(function () {
                // Make Text Search
                akqListObjectVariable.searchListObjectFor("/qListObjectDef", "*" + $('#inputBoxSearchName').val() + "*").then(function () {
                    // get Layout
                    akqListObjectVariable.getLayout().then(function () {
                        // accept the list object search
                        akqListObjectVariable.acceptListObjectSearch("/qListObjectDef", true).then(function () {
                            // end the Selection with the accept the selection
                            akqListObjectVariable.endSelections(true).then(function () {
                                // get the new Selected date for the Pivot cube to be displaed
                                akqPivotObject.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {

                                    console.log('res[0].qLeft[i-objectList[0].qTop]', res[0]);

                                    var listContainer = '';
                                    $('#listOfPossibleVariables').remove();
                                    $('#closeVarSelection').remove();
                                    $('#applVarSelection').remove();
                                    $('#nextPage').remove();
                                    $('#prevPage').remove();
                                    $('#PagePosition').remove();
                                    $('.section').remove();

                                    listContainer += '<hr class="section">';

                                    listContainer += '<ul id="listOfPossibleVariables">'
                                    for (var i = objectList[0].qTop; i < res[0].qLeft.length + objectList[0].qTop; i++) {
                                        //                                    listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i-objectList[0].qTop].qText + '</li>'
                                        listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i - objectList[0].qTop].qText + '</li>'
                                    }
                                    listContainer += '</ul><hr class="section">';
                                    listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop / 20 + ' </div>';
                                    listContainer += '<button class="akqButtonList" id="closeVarSelection" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                                    listContainer += '<button class="akqButtonList" id="prevPage" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                                    listContainer += '<button class="akqButtonList" id="nextPage" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                                    listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
                                    $('.overlappingContainer').append(listContainer);

                                    if (akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)]) {
                                        for (var k = 0; k < akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)].length; k++) {
                                            $('#' + akqSelVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelected)][k].id).css("background-color", "rgb(82,204,82)");
                                        }

                                    }

                                });
                            });
                        });
                    });
                });
            });
        });

        $(document).on('click', '#searchValueHigh', function (event) {
            // Begin selection
            akqListObjectVariable.beginSelections(["/qListObjectDef"]).then(function () {
                // Make Text Search
                akqListObjectVariable.searchListObjectFor("/qListObjectDef", "*" + $('#inputBoxSearchName').val() + "*").then(function () {
                    // get Layout
                    akqListObjectVariable.getLayout().then(function () {
                        // accept the list object search
                        akqListObjectVariable.acceptListObjectSearch("/qListObjectDef", true).then(function () {
                            // end the Selection with the accept the selection
                            akqListObjectVariable.endSelections(true).then(function () {
                                // get the new Selected date for the Pivot cube to be displaed
                                akqPivotObject.getHyperCubePivotData("/qHyperCubeDef", objectList).then(function (res) {

                                    console.log('res[0].qLeft[i-objectList[0].qTop]', res[0]);

                                    var listContainer = '';
                                    $('#listOfPossibleVariables').remove();
                                    $('#closeVarSelectionHigh').remove();
                                    $('#applVarSelection').remove();
                                    $('#nextPageHigh').remove();
                                    $('#prevPageHigh').remove();
                                    $('#PagePosition').remove();
                                    $('.section').remove();

                                    listContainer += '<hr class="section">';

                                    listContainer += '<ul id="listOfPossibleVariables">'
                                    for (var i = objectList[0].qTop; i < res[0].qLeft.length + objectList[0].qTop; i++) {
                                        //                                    listContainer += '<li id="akqSelectVariables'+i+'" class="akqselectVariableClass">' + res[0].qLeft[i-objectList[0].qTop].qText + '</li>'
                                        listContainer += '<li id="akqSelectVariables-' + res[0].qLeft[i - objectList[0].qTop].qElemNo + '" class="akqselectVariableClass">' + res[0].qLeft[i - objectList[0].qTop].qText + '</li>'
                                    }
                                    listContainer += '</ul><hr class="section">';
                                    listContainer += '<div id="PagePosition"> Page: ' + objectList[0].qTop / 20 + ' </div>';
                                    listContainer += '<button class="akqButtonList" id="closeVarSelectionHigh" title=" Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                                    listContainer += '<button class="akqButtonList" id="prevPageHigh" title="previous page"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></button>';
                                    listContainer += '<button class="akqButtonList" id="nextPageHigh" title="next page"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>';
                                    listContainer += '<button class="akqButtonList" id="applVarSelection" title="apply selection"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
                                    $('.overlappingContainer').append(listContainer);

                                    if (akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)]) {
                                        for (var k = 0; k < akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)].length; k++) {
                                            $('#' + akqSelHighVariablesControler[parseInt(akqAssistVaueWhichLowPopOverSelectedHigh)][k].id).css("background-color", "rgb(82,204,82)");
                                        }

                                    }

                                });
                            });
                        });
                    });
                });
            });
        });

    });
});