var UtilProvince = {};
var timerSearch = 0;
UtilProvince.onChange = function (e) {
    console.log('UtilProvince.onChange');
}
UtilProvince.onSelect = function (e) {
    console.log('UtilProvince.onSelect');
}
UtilProvince.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: UtilProvince.arrUtilProvince,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilProvince.checkDemoRevison(ui.item.label);
            UtilProvince.onSelect();

        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
            }
            UtilProvince.onChange();
        }
    });
}

UtilProvince.checkData = function (btn) {
    var id = "#" + btn.id;
    if ($(id).val() != "") {
        UtilProvince.checkDemoRevison($(id).val());
    }
}

UtilProvince.checkDemoRevison = function (label) {
    var arrUtilProvince = UtilProvince.arrUtilProvince;
    var index = arrUtilProvince.findIndex(arrUtilProvince => arrUtilProvince.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilProvince[index].id);
        $("#" + idForSelect).attr("data-provinceCode", arrUtilProvince[index].provinceCode);
        $("#" + idForSelect).attr("data-label", arrUtilProvince[index].provinceName);
    } 
}


UtilProvince.queryData = function (param) {
    var find = $("#" + idForSelect).val();
    UtilProvince.arrUtilProvince =  [];
    if (param == "research") {
        find = ""
        if (UtilProvince.tempEmptyData == undefined) {
            UtilProvince.tempEmptyData = UtilProvince.ajaxQueryData(find);
        }
        UtilProvince.arrUtilProvince = UtilProvince.tempEmptyData;
    } else {
        UtilProvince.arrUtilProvince=UtilProvince.ajaxQueryData(find);
    }
    UtilProvince.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};

var idForSelect;
UtilProvince.ajaxQueryData = function (find) {

    var arrDemo = [];
    var data= {
        orderBy: 'provinceCode',
            sortBy: 'asc',
            name: find,
            size: 15
    };
    AjaxUtil.get('/centrals/listProvinceNamelikeAndmaxSizeAndOrderby', data, false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var json = xhr.responseJSON;
                console.log(json)
                if (json != null) {
                    $.each(json, function (index, item) {
                        // console.log(item);
                        var name = item.provinceName;
                        var data = {
                            label: name,
                            id: item.code,
                            provinceName: item.provinceName,
                            provinceCode: item.provinceCode
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


UtilProvince.setId = function (id_input) {
    console.log('UtilProvince.setId')
    if (idForSelect != id_input.dataset.target || !(idForSelect)) {
        idForSelect = id_input.dataset.target;
        if ($("#" + idForSelect).is(':disabled')) {
            return false;
        }
        UtilProvince.queryData("research");
        $("#"+idForSelect).focus();
    }
    else {
        if ($("#" + idForSelect).is(':disabled')) {
            return false;
        }
        UtilProvince.queryData("research");
        $("#"+idForSelect).focus();
    }
};


UtilProvince.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilProvince.queryData();
        }, 1000);
}

UtilProvince.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilProvince.focus = function (btn) {
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

