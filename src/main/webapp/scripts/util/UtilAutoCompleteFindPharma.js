var UtilPharma = {};
UtilPharma.arrDemo = [];
UtilPharma.arrDemo = 0;

UtilPharma.sortByArr = function () {

    UtilPharma.highlightWord();
    $("#" + UtilPharma.idForSelect).autocomplete({
        source: UtilPharma.arrDemo,
        minLength: 0,
        select: function (event, ui) {
            // $("#" + UtilPharma.idForSelect).val(ui.item.id);
            UtilPharma.checkDemoRevison(ui.item.label);
        }
    })
}
UtilPharma.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilPharma.checkDemoRevison($(id).val());
}
UtilPharma.checkDemoRevison = function (label) {
    var arrDemo = UtilPharma.arrDemo;
    var index = arrDemo.findIndex(arrDemo => arrDemo.label == label
)
    ;
    if (index != -1) {
        $("#" + UtilPharma.idForSelect).attr("data-code", UtilPharma.arrDemo[index].pharmacyCode);
        $("#" + UtilPharma.idForSelect).attr("data-name", UtilPharma.arrDemo[index].pharmacyName);
    } else {
        $("#" + UtilPharma.idForSelect).val("");
        $("#" + UtilPharma.idForSelect).attr("data-code", "");
    }
}
UtilPharma.queryData = function (param) {

    UtilPharma.arrDemo = [];

    var find = $("#" + UtilPharma.idForSelect).val();
    if (param == "research") {
        find = ""
        if (UtilPharma.tempEmptyData == undefined) {
            UtilPharma.tempEmptyData = UtilPharma.ajaxQueryData(find);
        } else {
            UtilPharma.arrDemo = UtilPharma.tempEmptyData;
        }
        UtilPharma.arrDemo = UtilPharma.tempEmptyData;
    } else {
        UtilPharma.arrDemo = UtilPharma.ajaxQueryData(find);
    }


    UtilPharma.sortByArr();
    if (param == undefined || param == false || param == "research") {
        console.log('UtilPharma.idForSelect');
        var idFocus=$(':focus').attr('id');
        if(idFocus==UtilPharma.idForSelect) {
            $("#" + UtilPharma.idForSelect).autocomplete('search', '');
        }
    }

};

UtilPharma.ajaxQueryData = function (find) {
    arrDemo = [];
    var data = {
        orderBy: 'pharmacyCode',
        sortBy: 'asc',
        name: find,
        size: 15,
        customerCode: $("#" + UtilPharma.idForSelect).attr("customerCode"),
        subCustomerCode: $("#" + UtilPharma.idForSelect).attr("subCustomerCode")
    }

    AjaxUtil.get('/centrals/listPharmaNamelikeAndmaxSizeAndOrderby', data, false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var json = xhr.responseJSON;
                if (json != null) {
                    $.each(json, function (index, item) {
                        // console.log(item);
                        var name = item.pharmacyCode + " : " + item.pharmacyName;
                        var data = {
                            label: name,
                            id: item.pharmacyCode,
                            pharmacyName: item.pharmacyName
                        };
                        arrDemo.push(data);
                    })
                }
            }
        }
    });
    return arrDemo;
};


UtilPharma.idForSelect;
UtilPharma.setId = function (id_input) {

    if (UtilPharma.idForSelect != id_input.id || !(UtilPharma.idForSelect)) {
        UtilPharma.idForSelect = id_input.id;
        UtilPharma.queryData("research");
        $("#" + UtilPharma.idForSelect).focus();
        // }
    }
    else {
        UtilPharma.queryData("research");
        $("#" + UtilPharma.idForSelect).focus();
    }

};
UtilPharma.research = function () {

    if (UtilPharma.arrDemo != 0) {
        clearTimeout(UtilPharma.arrDemo);
    }
    UtilPharma.arrDemo = setTimeout(
        function () {
            UtilPharma.queryData();
        }, 1000);
}
UtilPharma.focusInput = function (id_input) {
    UtilPharma.idForSelect = id_input.id;
};
UtilPharma.focus = function (btn) {
    var id = "#" + btn.id;
    var idInput = "#" + $(id).attr('data-target');
    $(idInput).click();
};
UtilPharma.highlightWord = function () {

    var oldFn = $.ui.autocomplete.prototype._renderItem;

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {

        var t = item.label.replace(this.term, "<span style='font-weight:bold;background-color:#B2FF59;'>" + this.term + "</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + t + "</a>")
            .appendTo(ul);
    };
}

