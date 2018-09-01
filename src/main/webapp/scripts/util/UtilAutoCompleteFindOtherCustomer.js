var UtilOtherCustomer = {};
var timerSearch = 0;
UtilOtherCustomer.onChange = function () {
    console.log('UtilOtherCustomer.onChange');
}
UtilOtherCustomer.onSelect = function (e) {
    console.log('UtilOtherCustomer.onSelect');
}
UtilOtherCustomer.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        // console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: UtilOtherCustomer.array,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.label);
            UtilOtherCustomer.checkDemoRevison(ui.item.label);
            UtilOtherCustomer.onSelect(event);

        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
                $("#" + idForSelect).attr("data-customerCode", "");
                $("#" + idForSelect).attr("data-label", "");
            }
            UtilOtherCustomer.onChange();
        }
    })
}

UtilOtherCustomer.checkData = function (btn) {
    var id = "#" + btn.id;
    if ($(id).val() != "") {
        if(UtilOtherCustomer.array && UtilOtherCustomer.array.length>0) {
            UtilOtherCustomer.checkDemoRevison($(id).val());
        }else{
            idForSelect=btn.id;
            UtilOtherCustomer.queryData(true);
            UtilOtherCustomer.checkDemoRevison($(id).val());
        }
    }
}

UtilOtherCustomer.checkDemoRevison = function (label) {
    // console.log(UtilOtherCustomer.array)
    var arrDemo=UtilOtherCustomer.array;
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


UtilOtherCustomer.queryData = function (param) {
    var find = $("#" + idForSelect).val();

    if (param == "research") {
        find = ""
        if (UtilOtherCustomer.tempEmptyData == undefined) {
            UtilOtherCustomer.tempEmptyData = UtilOtherCustomer.ajaxQueryData(find);
        } else {
            UtilOtherCustomer.array = UtilOtherCustomer.tempEmptyData;
        }
    } else {
        UtilOtherCustomer.ajaxQueryData(find);
    }
    UtilOtherCustomer.sortByArr();
    var idFocus = $(':focus').attr('id');
    if (idFocus == idForSelect) {
        $("#" + idForSelect).autocomplete('search', '');
    }

}
UtilOtherCustomer.ajaxQueryData = function (find) {
    UtilOtherCustomer.array = [];
    var data = {
        orderBy: 'customerCode',
        sortBy: 'asc',
        code: find,
        name: find,
        size: 15
    }
    AjaxUtil.get('/centrals/listOtherCustomerNamelikeAndmaxSizeAndOrderby', data, false).complete(function (xhr) {
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
                        UtilOtherCustomer.array.push(data);
                    });
                }
            } else {
                console.log(xhr.getResponseHeader('errorMsg'));
            }
        }
    });
    return UtilOtherCustomer.array;

};

var idForSelect = {};
UtilOtherCustomer.setId = function (id_input) {
    // console.log(idForSelect +" "+id_input.id)
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        // if (UtilOtherCustomer.array.length == 0) {
        UtilOtherCustomer.queryData("research");
        $("#" + idForSelect).focus();
        // }
    }
    else {
        UtilOtherCustomer.queryData("research");
        $("#" + idForSelect).focus();
    }
};


UtilOtherCustomer.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilOtherCustomer.queryData();
        }, 1000);
}

UtilOtherCustomer.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilOtherCustomer.focus = function (btn) {
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

