var UtilDemo = {};
var arrDemo = [];
var timerSearch = 0;

UtilDemo.onSelect = function (e) {
    console.log('onSelect');
}
UtilDemo.sortByArr = function () {

    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrDemo,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            checkDemoRevison(ui.item.label);
            UtilDemo.onSelect(event);
        }
    });
}

UtilDemo.checkData = function (btn) {
    var id = "#" + btn.id;
    checkDemoRevison($(id).val());
}

function checkDemoRevison(label) {
    var index = arrDemo.findIndex(arrDemo => arrDemo.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrDemo[index].id);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
    }
}

UtilDemo.queryData = function () {

    arrDemo = [];
    var data = {
        customer: customers,
        invoiceNumber: "",
        itemCode: "",
        status: "",
        orderBy: 'code',
        sortBy: 'asc',
        name: $("#" + idForSelect).val(),
        size: 15
    }
    AjaxUtil.get('/pendingDeliverys/listPendingDeliveryOrderByParam', data, false).complete(function (xhr) {
        var json=xhr.responseJSON;
        var map={};//map for check duplicate
        if (json != null) {
            $.each(json, function (index, item) {
                // console.log(item);
                if(map[item.invoiceNumber]==undefined) {
                    var name = item.invoiceNumber == null ? '' : item.invoiceNumber;
                    var data = {
                        label: name,
                        id: item.invoiceNumber
                    };
                    arrDemo.push(data);
                    map[item.invoiceNumber]=data;
                }
            })
        }
        UtilDemo.sortByArr();
        $("#" + idForSelect).autocomplete('search', '');
    });

};
var idForSelect;
UtilDemo.setId = function (id_input) {
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        UtilDemo.queryData();
    }
    else {
        $("#" + idForSelect).autocomplete('search', '');
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

