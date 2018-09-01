var UtilSubCustomer = {};
var arrFindSubCustomer = [];
var timerSearch = 0;
UtilSubCustomer.onChange = function (e) {
    console.log('UtilDemo.onChange');
}
UtilSubCustomer.onSelect = function (e) {
    console.log('UtilDemo.onSelect');
}
UtilSubCustomer.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete("destroy");
        // console.log("destroy")

    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord();
    $("#" + idForSelect).autocomplete({
        source: arrFindSubCustomer,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilSubCustomer.checkDemoRevison(ui.item.label);
            UtilSubCustomer.onSelect(event);
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
            }
            UtilSubCustomer.onChange(event);
        }
    });
}

UtilSubCustomer.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilSubCustomer.checkDemoRevison($(id).val());
}

UtilSubCustomer.checkDemoRevison = function (label) {
    var index = arrFindSubCustomer.findIndex(arrFindSubCustomer => arrFindSubCustomer.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrFindSubCustomer[index].id);
        $("#" + idForSelect).attr("data-label", arrFindSubCustomer[index].subCustomerName);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
    }
}

UtilSubCustomer.queryData = function () {

    arrFindSubCustomer = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/customers/findSubCustomersByCustomerCode?customerCode=' + $("#" + idForSelect).attr("customerCode"),
        headers: {
            Accept: "application/json",
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false
    }).responseJSON;

    if (json != null) {

        $.each(json, function (index, item) {
            // console.log(item);
            var name = item.subCustomerCode + " " + item.subCustomerName;
            var data = {
                label: name,
                id: item.subCustomerCode,
                subCustomerName: item.subCustomerName,
            };
            arrFindSubCustomer.push(data);
        })
    }
    UtilSubCustomer.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};
var idForSelect;
UtilSubCustomer.setId = function (id_input) {
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        UtilSubCustomer.queryData();
        $("#" + idForSelect).focus();
    }
    else {
        $("#" + idForSelect).focus();
        $("#" + idForSelect).autocomplete('search', '');
    }

};

UtilSubCustomer.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilSubCustomer.queryData();
        }, 1000);
}

UtilSubCustomer.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilSubCustomer.focus = function (btn) {
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

