var UtilTransportationNumber  = {};
var arrUtilTransportationNumber  = [];
UtilTransportationNumber .onChange = function () {
    console.log('UtilTransportationNumber .change');
}
UtilTransportationNumber .sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrUtilTransportationNumber ,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilTransportationNumber .checkDemoRevison(ui.item.label);
        },
        change: function( event, ui ) {
            UtilTransportationNumber .onChange();
        }
    }).focus(function () {
        $(this).autocomplete('search', '')
    });
    $("#" + idForSelect).focus();
}

UtilTransportationNumber .checkData = function (btn) {
    var id = "#" + btn.id;
    UtilTransportationNumber .checkDemoRevison($(id).val());
}

UtilTransportationNumber .checkDemoRevison = function (label) {
    var index = arrUtilTransportationNumber .findIndex(arrUtilTransportationNumber  => arrUtilTransportationNumber .label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilTransportationNumber [index].invoiceNumber);
        $("#" + idForSelect).attr("data-customerCode", arrUtilTransportationNumber [index].customerCode);
        $("#" + idForSelect).attr("data-invoiceNumber", arrUtilTransportationNumber [index].invoiceNumber);
        $("#" + idForSelect).attr("data-transportationNumber", arrUtilTransportationNumber [index].transportationNumber);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
        $("#" + idForSelect).attr("data-customerCode", "");
        $("#" + idForSelect).attr("data-invoiceNumber", "");
        $("#" + idForSelect).attr("data-transportationNumber", "");
    }
}

UtilTransportationNumber .customerCode = "";

UtilTransportationNumber .queryData = function () {

    arrUtilTransportationNumber  = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/invoiceMapCustomer/listInvoiceNamelikeAndmaxSizeAndOrderby',
        data: {
            customerCode: UtilTransportationNumber .customerCode,
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
            arrUtilTransportationNumber .push(data);
        })
    }
    UtilTransportationNumber .sortByArr();
};
var idForSelect = {};
UtilTransportationNumber .setId = function (id_input) {
    console.log('id')
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        if (arrUtilTransportationNumber .length == 0) {
            UtilTransportationNumber .queryData();
        }
    } else {
        $("#" + idForSelect).focus();
    }
};

UtilTransportationNumber .focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilTransportationNumber .focus = function (btn) {
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

