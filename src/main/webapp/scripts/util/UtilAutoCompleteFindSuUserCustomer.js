var UtilSuUser = {};
var timerSearch = 0;
UtilSuUser.onChange = function () {
    console.log('UtilSuUser.onChange');
}
UtilSuUser.onSelect = function () {
    console.log('UtilSuUser.onSelect');
}
// UtilSuUser.tempEmptyData = [];
UtilSuUser.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete("destroy");
        // console.log("destroy")

    } catch (err) {
        console.log("no autocomplete")
    }

    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: UtilSuUser.arrLov,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilSuUser.checkDemoRevison(ui.item.label);
            UtilSuUser.onSelect();
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
            }
            UtilSuUser.onChange();
        }
    });
}

UtilSuUser.checkData = function (btn) {
    var id = "#" + btn.id;
    if ($(id).val() != "") {
        UtilSuUser.checkDemoRevison($(id).val());
    }
}

UtilSuUser.checkDemoRevison = function (label) {
    var arrLov = UtilSuUser.arrLov;
    var index = arrLov.findIndex(arrLov => arrLov.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrLov[index].id);
        $("#" + idForSelect).attr("data-label", arrLov[index].customerName);
    }
}

UtilSuUser.queryData = function (param) {

    var find = $("#" + idForSelect).val();
    UtilSuUser.arrLov = [];
    if (param == "research") {
        find = ""
        if (UtilSuUser.tempEmptyData == undefined) {
            UtilSuUser.tempEmptyData = UtilSuUser.ajaxQueryData(find);
        }
            UtilSuUser.arrLov = UtilSuUser.tempEmptyData;
    } else {
        UtilSuUser.arrLov=UtilSuUser.ajaxQueryData(find);
    }
    UtilSuUser.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};

var idForSelect;
UtilSuUser.ajaxQueryData = function (find) {
    var arrDemo = [];
    var data= {
        orderBy: 'customerCode',
            sortBy: 'asc',
            name: find,
            size: 15
    };
    AjaxUtil.get('/customers/listSuUserCustomerNamelikeAndmaxSizeAndOrderby',data,false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var json = xhr.responseJSON;
                console.log(json)
                if (json != null) {
                    $.each(json, function (index, item) {
                        // console.log(item);
                        var name = item.customerCode + " " + item.userName;
                        var data = {
                            label: name,
                            id: item.customerCode,
                            customerName: item.userName
                        };
                        arrDemo.push(data);
                    });
                }
            }else{
                console.log(xhr.getResponseHeader('errorMsg'));
            }
        }
    });
    return arrDemo;
}
UtilSuUser.setId = function (id_input) {
    console.log('UtilSuUser.setId')
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        if ($("#" + idForSelect).is(':disabled')) {
            return false;
        }
        UtilSuUser.queryData("research");
        $("#" + idForSelect).focus();
    }
    else {
        // setTimeout(function () {
        if ($("#" + idForSelect).is(':disabled')) {
            return false;
        }
        UtilSuUser.queryData("research");
        $("#" + idForSelect).focus();
        // }, 1);

    }
};

UtilSuUser.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilSuUser.queryData();
        }, 1000);
}

UtilSuUser.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilSuUser.focus = function (btn) {
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

