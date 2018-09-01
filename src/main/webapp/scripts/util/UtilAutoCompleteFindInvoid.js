var UtilFindInvoid = {};
var arrUtilFindInvoid = [];
UtilFindInvoid.onChange = function () {
    console.log('UtilFindInvoid.change');
}
UtilFindInvoid.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrUtilFindInvoid,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilFindInvoid.checkDemoRevison(ui.item.label);
        },
        change: function( event, ui ) {
            UtilFindInvoid.onChange();
        }
    }).focus(function () {
        $(this).autocomplete('search', '')
    });
    $("#" + idForSelect).focus();
}

UtilFindInvoid.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilFindInvoid.checkDemoRevison($(id).val());
}

UtilFindInvoid.checkDemoRevison = function (label) {
    var index = arrUtilFindInvoid.findIndex(arrUtilFindInvoid => arrUtilFindInvoid.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilFindInvoid[index].invoiceNumber);
        $("#" + idForSelect).attr("data-customerCode", arrUtilFindInvoid[index].customerCode);
        $("#" + idForSelect).attr("data-invoiceNumber", arrUtilFindInvoid[index].invoiceNumber);
        $("#" + idForSelect).attr("data-transportationNumber", arrUtilFindInvoid[index].transportationNumber);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
        $("#" + idForSelect).attr("data-customerCode", "");
        $("#" + idForSelect).attr("data-invoiceNumber", "");
        $("#" + idForSelect).attr("data-transportationNumber", "");
    }
}

UtilFindInvoid.customerCode = "";

UtilFindInvoid.queryData = function () {

    arrUtilFindInvoid = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/invoiceMapCustomer/listInvoiceNamelikeAndmaxSizeAndOrderby',
        data: {
            customerCode: UtilFindInvoid.customerCode,
            orderBy: 'invoiceNumber',
            sortBy: 'asc',
            name: $("#" + idForSelect).val(),
            size: 15
        },
        headers: {
            Accept: "application/json",
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false
    }).responseJSON;

    if (json != null) {
        console.log(json);
        $.each(json, function (index, item) {
            console.log(item);
            var name = item.invoiceNumber
            var data = {
                label: name,
                invoiceNumber: item.invoiceNumber,
                transportationNumber: item.transportationNumber,
                customerCode: item.customerCode,
            };
            arrUtilFindInvoid.push(data);
        })
    }
    UtilFindInvoid.sortByArr();
};
var idForSelect = {};
UtilFindInvoid.setId = function (id_input) {
    console.log('id')
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        if (arrUtilFindInvoid.length == 0) {
            UtilFindInvoid.queryData();
        }
    } else {
        $("#" + idForSelect).focus();
    }
};

UtilFindInvoid.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilFindInvoid.focus = function (btn) {
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

