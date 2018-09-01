var UtilDemo = {};
var arrDemo = [];
var timerSearch = 0;
UtilDemo.onChange = function () {
    console.log('UtilDemo.onChange');
}
UtilDemo.onSelect = function (e) {
    console.log('UtilDemo.onSelect');
}
UtilDemo.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        // console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrDemo,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.label);
            UtilDemo.checkDemoRevison(ui.item.label);
            UtilDemo.onSelect(event);

        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
                $("#" + idForSelect).attr("data-customerCode", "");
                $("#" + idForSelect).attr("data-label", "");
            }
            UtilDemo.onChange();
        }
    })
}

UtilDemo.checkData = function (btn) {
    var id = "#" + btn.id;
    if ($(id).val() != "") {
        if(arrDemo.length>0) {
            UtilDemo.checkDemoRevison($(id).val());
        }else{
            idForSelect=btn.id;
            UtilDemo.queryData(true);
            UtilDemo.checkDemoRevison($(id).val());
        }
    }
}

UtilDemo.checkDemoRevison = function (label) {
    // console.log(arrDemo)
    var index = arrDemo.findIndex(arrDemo => arrDemo.label == label
)
    ;
    // console.log(index,label)
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrDemo[index].id);
        $("#" + idForSelect).attr("data-customerCode", arrDemo[index].customerCode);
        $("#" + idForSelect).attr("data-label", arrDemo[index].customerName);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
        $("#" + idForSelect).attr("data-customerCode", "");
        $("#" + idForSelect).attr("data-label", "");
    }
}


UtilDemo.queryData = function (param) {
    var find = $("#" + idForSelect).val();

    if (param == "research") {
        find = ""
        if (UtilDemo.tempEmptyData == undefined) {
            UtilDemo.tempEmptyData = UtilDemo.ajaxQueryData(find);
        } else {
            arrDemo = UtilDemo.tempEmptyData;
        }
    } else {
        UtilDemo.ajaxQueryData(find);
    }
    UtilDemo.sortByArr();
    var idFocus = $(':focus').attr('id');
    if (idFocus == idForSelect) {
        $("#" + idForSelect).autocomplete('search', '');
    }

}
UtilDemo.ajaxQueryData = function (find) {
    arrDemo = [];
    var data = {
        orderBy: 'customerCode',
        sortBy: 'asc',
        code: find,
        name: find,
        size: 15
    }
    AjaxUtil.get('/customers/listCustomerNamelikeAndmaxSizeAndOrderby', data, false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var json = xhr.responseJSON;
                if (json != null) {
                    $.each(json, function (index, item) {
                        //console.log(item);
                        var code = item.customerCode == null ? '' : item.customerCode;
                        var name = item.customerName == null ? '' :  item.mainAr  + " " + item.mainArName + " (" +item.customerCode+" "+item.customerName+ ") ";
                        var data = {
                            label: name,
                            id: code,
                            customerCode: item.customerCode,
                            customerName: item.customerName
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

var idForSelect = {};
UtilDemo.setId = function (id_input) {
    // console.log(idForSelect +" "+id_input.id)
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        // if (arrDemo.length == 0) {
        UtilDemo.queryData("research");
        $("#" + idForSelect).focus();
        // }
    }
    else {
        UtilDemo.queryData("research");
        $("#" + idForSelect).focus();
    }
};


UtilDemo.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilDemo.queryData();
        }, 1000);
}

UtilDemo.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilDemo.focus = function (btn) {
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

