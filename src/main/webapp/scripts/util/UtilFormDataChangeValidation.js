var mapForFormDataChangeValidation = {};
var arrayIdForFormDataChangeValidation = [];

var mapCheckForFormDataChangeValidation = {};
var arrayCheckIdForFormDataChangeValidation = [];

var statusEvent = "";

var typeSelect = "select";
var typeSelectized = "selectized";
var typeTypecombobox = "typecombobox";
var typeDiv = "div";
//var typeJsTree = ":jstree";
var typeInput = "input";
var typeCheckBox = "checkbox";
var typeTextArea = "textarea";
var typeRadio = "radio";
var typeNumber = "number";
var typeText = "text";
var typeImg = "img";
var typeEmployeeLov = "employee-lov";
var typeEmployeeLovFrom = "employee-lov-from";
var typeEmployeeLovTo = "employee-lov-to";
var typeDepartmentLov = "department-lov";
var typeDepartmentLovFrom = "department-lov-from";
var typeDepartmentLovTo = "department-lov-to";
var typePositionLov = "position-lov";
var typePositionLovFrom = "position-lov-from";
var typePositionLovTo = "position-lov-to";

// scan and get data
function getIdFromComponentAndSetDataForFormDataChangeValidate() {
    arrayIdForFormDataChangeValidation = getIdFromComponentForFormDataChangeValidation();
    mapForFormDataChangeValidation = setDataForFormDataChangeValidation(arrayIdForFormDataChangeValidation);
}

// function start submit and back event
function startSubmitEventForFormDataChangeValidation() {
    arrayCheckIdForFormDataChangeValidation = getIdFromComponentForFormDataChangeValidation();
    mapCheckForFormDataChangeValidation = setDataForFormDataChangeValidation(arrayCheckIdForFormDataChangeValidation);
    if (arrayCheckIdForFormDataChangeValidation.length != arrayIdForFormDataChangeValidation.length) {
        return 'pass';
    }
    statusEvent = sumbitEventForFormDataChangeValidate(mapForFormDataChangeValidation, mapCheckForFormDataChangeValidation, null);

    return statusEvent;
};

function startBackEventForFormDataChangeValidation(link) {
    arrayCheckIdForFormDataChangeValidation = getIdFromComponentForFormDataChangeValidation();
    mapCheckForFormDataChangeValidation = setDataForFormDataChangeValidation(arrayCheckIdForFormDataChangeValidation);
    statusEvent = backEventForFormDataChangeValidate(mapForFormDataChangeValidation, mapCheckForFormDataChangeValidation, link);
    return statusEvent;
};

// process of submit and back event
function sumbitEventForFormDataChangeValidate(map, mapCheck, link) {
    try {
        var status = "pass";
        var mapCheckSize = Object.keys(mapCheck).length;
        var mapSize = Object.keys(map).length;

        console.log(mapCheckSize + " " + mapSize)
        if (mapCheckSize != mapSize) {
            if (link != null) {
                console.log(status)
                window.location.href = session['context'] + link;
            }
        } else if (mapCheckSize == mapSize) {
            console.log(status)
            var count = 0;
            for (var i = 0; i < mapSize; i++) {
                var _id = Object.keys(mapCheck)[i];
                var mapCheckValue = (mapCheck[_id] == undefined ? "" : mapCheck[_id].toString());
                var mapValue = (map[_id] == undefined ? "" : map[_id].toString());
                console.log(mapCheckValue + " " + mapValue)
                if (mapCheckValue == mapValue) {
                    count++;
                }
                if (mapCheckValue != mapValue) {
                    if (link != null) {
                        window.location.href = session['context'] + link;
                    }
                    console.log(status)
                    break;
                }
            }
            if (count == mapCheckSize) {
                // bootBoxForSubmitEventForFormDataChangeValidation(textMS0080, link);
                status = "false";
            }
        }
        console.log(status)
        return status;
    } catch (Error) {
        console.debug(Error);
    }
}

function backEventForFormDataChangeValidate(map, mapCheck, link) {
    try {
        var status = "pass";
        var mapCheckSize = Object.keys(mapCheck).length;
        var mapSize = Object.keys(map).length;
        if (mapCheckSize != Object.keys(map).length) {
            bootBoxForBackEventForFormDataChangeValidation(link);
        } else if (mapCheckSize == mapSize) {
            var count = 0;
            for (var i = 0; i < mapSize; i++) {
                var _id = Object.keys(mapCheck)[i];
                if (mapCheck[_id] != map[_id]) {
                    bootBoxForBackEventForFormDataChangeValidation(link);
                    status = "false";
                    break;
                } else if (mapCheck[_id] == map[_id]) {
                    count++;
                }
            }
            if (count == mapCheckSize) {
                if (link != null) {
                    window.location.href = session['context'] + link;
                }
            }
        }
        console.log(status)
        return status;

    } catch (Error) {
        console.debug(Error);
    }
}


// bootbox for submit and back event
function bootBoxForSubmitEventForFormDataChangeValidation(message, link) {
    bootbox.dialog({
        closeButton: false,
        message: " ",
        title: "<div class='page-header'><h4><center>" + message + "</center></h4></div>",
        buttons: {
            cancel: {
                label: "<div>" + buttonApprove + "</div>",
                className: "btn-primary",
                callback: function () {
                    if (link != null) {
                        window.location.href = session['context'] + link;
                    }
                }
            }
        },
        className: "modal25"
    });
}

function bootBoxForBackEventForFormDataChangeValidation(link) {
    var text = "(" + initialMessage.MS_OK_FOR_BACK + " " + initialMessage.MS_CANCEL_FOR_EDIT + ")";
    MessageUtil.OkYesNoAndText(initialMessage.MS_DATA_CHANGE,text, 'warning', function () {
        window.location.href = session['context'] + link;
    })
}


// scan component
function getIdFromComponentForFormDataChangeValidation() {
    try {
        var array = [];
        var typeInputSize = $(typeInput).length;
        var typeSelectSize = $(typeSelect).length;
        var typeTextAreaSize = $(typeTextArea).length;
        var typeImgSize = $(typeImg).length;
        /*var typeJsTreeSize = $(typeJsTree).length;*/
        var size = (typeInputSize + typeSelectSize + typeTextAreaSize + typeImgSize/* + typeJsTreeSize*/);
        var count = 0;
        for (var i = 0; i < size; i++) {
            if (i < typeInputSize) {
                var param = $(typeInput)[i].id;
                if ($("#" + param).attr("type") != "hidden" && param != "" && param != undefined) {
                    array[count] = param;
                    count++;
                }
            } else if ((i - typeInputSize) < typeSelectSize) {
                var param = $(typeSelect)[(i - typeInputSize)].id;
                if ($("#" + param).attr("type") != "hidden" && param != "" && param != undefined) {
                    array[count] = param;
                    count++;
                }
            } else if ((i - (typeInputSize + typeSelectSize)) < typeTextAreaSize) {
                var param = $(typeTextArea)[i - (typeInputSize + typeSelectSize)].id;
                if ($("#" + param).attr("type") != "hidden" && param != "" && param != undefined) {
                    array[count] = param;
                    count++;
                }
            }
            else if ((i - (typeInputSize + typeSelectSize + typeTextAreaSize)) < typeImgSize) {
                var param = $(typeImg)[i - (typeInputSize + typeSelectSize + typeTextAreaSize)].id;
                if ($("#" + param).attr("type") != "hidden" && param != "" && param != undefined) {
                    array[count] = param;
                    count++;
                }
            }
            /*else if ((i - (typeInputSize + typeSelectSize + typeTextAreaSize)) < typeJsTreeSize) {
             try{
             var param = $(typeJsTree)[i - (typeInputSize + typeSelectSize + typeTextAreaSize)].id;
             if ($("#" + param).attr("type") != "hidden" && param != "" && param != undefined) {
             array[count] = param;
             count++;
             }
             }catch(ex){
             console.debug("Please check jsTree validate form")
             }
             }*/
        }
        return array;
    } catch (Error) {
        console.debug(Error);
    }
}

// get data
function setDataForFormDataChangeValidation(array) {
    try {
        var map = {};
        for (var a = 0; a < array.length; a++) {
            var Id = array[a];
            var _Id = "#" + array[a];
            if ($(_Id).size() >= 1) {
                map[Id] = $(_Id).prop("tagName").toLowerCase();
            }
            console.log(map[Id]);
            if (map[Id] == typeSelect) {
                var _class = $(_Id).attr("class").split(" ");
                for (var i = 0; i < _class.length; i++) {
                    if (_class[i] == typeSelectized) {
                        map[Id] = $(_Id).getComboBoxValue();
                        break;
                    } else {
                        map[Id] = $(_Id).val();
                    }
                }
            } else if (map[Id] == typeDiv) {
                /*try {
                 var _class = $(_Id).attr("class").split(" ");
                 for (var i = 0; i < _class.length; i++) {
                 if (":" + _class[i] == typeJsTree) {
                 map[Id] = $(_Id).jstree().get_selected();
                 break;
                 }
                 }
                 } catch (ex) {
                 console.debug("Please check jsTree validate form")
                 }*/
            } else if (map[Id] == typeInput) {
                if ($(_Id).attr("type") != undefined) {
                    var _class = $(_Id).attr("type").split(" ");
                    for (var i = 0; i < _class.length; i++) {
                        if (_class[i] == typeNumber) {
                            map[Id] = $(_Id).val();
                            break;
                        } else if (_class[i] == typeText) {
                            map[Id] = $(_Id).val();
                            break;
                        }
                        else if (_class[i] == typeRadio) {
                            map[Id] = $("input[name=" + $(_Id).attr("name") + "]:checked").val()
                            break;
                        } else if (_class[i] == typeEmployeeLov) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typeEmployeeLovFrom) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typeEmployeeLovTo) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typeDepartmentLov) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typeDepartmentLovFrom) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typeDepartmentLovTo) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typePositionLov) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typePositionLovFrom) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typePositionLovTo) {
                            map[Id] = $(_Id).data("data-code");
                            break;
                        } else if (_class[i] == typeCheckBox) {
                            map[Id] = $(_Id)[0].checked;
                            break;
                        } else {
                            map[Id] = $(_Id).val();
                        }
                    }
                } else {
                    map[Id] = $(_Id).val();
                }
            } else if (map[Id] == typeTextArea) {
                map[Id] = $(_Id).val();
            }
            else if (map[Id] == typeImg) {
                map[Id] = $(_Id).attr('src').filename();
                // console.log($(_Id).attr('src'));
                break;
            }
        }
        return map;
    } catch (Error) {
        console.debug(Error);
    }
};

String.prototype.filename = function (extension) {
    var s = this.replace(/\\/g, '/');
    s = s.substring(s.lastIndexOf('/') + 1);
    return extension ? s.replace(/[?#].+$/, '') : s.split('.')[0];
}
// start scan component
// $(document).ready(function () {
//getIdFromComponentAndSetDataForFormDataChangeValidate
// });