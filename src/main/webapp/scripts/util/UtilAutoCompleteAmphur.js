var UtilAmphur = {};
var timerSearch = 0;
UtilAmphur.onChange = function () {
    console.log('UtilAmphur.onChange');
}
UtilAmphur.onSelect = function () {
    console.log('UtilDemo.onSelect');
}
UtilAmphur.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: UtilAmphur.arrUtilAmphur,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilAmphur.checkDemoRevison(ui.item.label);
            UtilAmphur.onSelect();
            
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
                // $("#" + idForSelect).attr('districtCode', '');
            }
            UtilAmphur.onChange();
        }
    })
}

UtilAmphur.checkData = function (btn) {
    var id = "#" + btn.id;
        if( $(id).val() !="" ) {
            UtilAmphur.checkDemoRevison($(id).val());
        }
}

UtilAmphur.checkDemoRevison = function (label) {
    var arrUtilAmphur = UtilAmphur.arrUtilAmphur;
    var index = arrUtilAmphur.findIndex(arrUtilAmphur => arrUtilAmphur.label == label
    );
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilAmphur[index].id);
        $("#" + idForSelect).attr("data-districtCode", arrUtilAmphur[index].districtCode);
        $("#" + idForSelect).attr("data-label", arrUtilAmphur[index].districtName);
    }
}

UtilAmphur.queryData = function (param) {
    var find = $("#" + idForSelect).val();
    UtilAmphur.arrUtilAmphur =  [];
    if (param == "research") {
        find="";
        if (UtilAmphur.tempEmptyData == undefined) {
            UtilAmphur.tempEmptyData = UtilAmphur.ajaxQueryData(find);
        }else{
            UtilAmphur.tempEmptyData = UtilAmphur.ajaxQueryData(find);
            UtilAmphur.arrUtilAmphur = UtilAmphur.tempEmptyData;
        }
    } else {
        UtilAmphur.arrUtilAmphur=UtilAmphur.ajaxQueryData(find);
    }
    UtilAmphur.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};

var idForSelect;
UtilAmphur.ajaxQueryData = function (find) {
    var arrDemo = [];
    var data= {
        orderBy: 'districtCode',
        sortBy: 'asc',
        name: find,
        provinceCode: $("#" + idForSelect).attr("provinceCode"),
        size: 15
    };
    AjaxUtil.get('/centrals/listDistrictNamelikeAndmaxSizeAndOrderby', data, false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var json = xhr.responseJSON;
                console.log(json)
                if (json != null) {
                    $.each(json, function (index, item) {
                        // console.log(item);
                        var code = item.districtCode == null ? '' : item.districtCode;
                        var name = item.districtName == null ? '' : item.districtName;
                        var data = {
                            label: name,
                            id: code,
                            districtCode: item.districtCode,
                            districtName : item.districtName
                        };
                        arrDemo.push(data);
                    });
                }
            } else {
                console.log(xhr.getResponseHeader('errorMsg'));
            }
        }
    });
    return arrDemo;
};

UtilAmphur.setId = function (id_input) {
    console.log(idForSelect +" "+id_input.dataset.target)
    if (idForSelect != id_input.dataset.target || !(idForSelect)) {
        idForSelect = id_input.dataset.target;
        if ($("#" + idForSelect).is(':disabled')) {
            return false;
        }
        UtilAmphur.queryData("research");
        $("#"+idForSelect).focus();
    }
    else {
        if ($("#" + idForSelect).is(':disabled')) {
            return false;
        }
        UtilAmphur.queryData("research");
        $("#"+idForSelect).focus();
    }
};


UtilAmphur.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilAmphur.queryData();
        }, 1000);
}

UtilAmphur.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilAmphur.focus = function (btn) {
    var id = "#" + btn.id;
    var idInput = "#" + $(id).attr('data-target');
    $(idInput).click();
};

function highlightWord() {

    var oldFn = $.ui.autocomplete.prototype._renderItem;

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {

        var t = item.label.replace(this.term, "<span style='font-weight:bold;background-color:#B2FF59;'>" + this.term + "</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + t + "</a>")
            .appendTo(ul);
    };
}

