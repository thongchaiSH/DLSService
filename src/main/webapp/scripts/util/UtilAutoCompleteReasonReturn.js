var UtilReasonReturn = {};
var arrUtilReasonReturn = [];

UtilReasonReturn.sortByArr = function () {

    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrUtilReasonReturn,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilReasonReturn.checkDemoRevison(ui.item.label);
        }
    }).focus(function () {
        $(this).autocomplete('search', '')
    });
    $("#" + idForSelect).focus();
}

UtilReasonReturn.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilReasonReturn.checkDemoRevison($(id).val());
}

UtilReasonReturn.checkDemoRevison = function (label) {
    var index = arrUtilReasonReturn.findIndex(arrUtilReasonReturn => arrUtilReasonReturn.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilReasonReturn[index].id);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
    }
}


UtilReasonReturn.queryData = function () {

    arrUtilReasonReturn = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/centrals/listReturnReasonNamelikeAndmaxSizeAndOrderby',
        data: {
            orderBy: 'reasonCode',
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
            // console.log(item);
            var name = item.reasonDesc == null ? '' : item.reasonDesc;
            var data = {
                label: name,
                id: item.reasonCode
            };
            arrUtilReasonReturn.push(data);
        })
    }
    UtilReasonReturn.sortByArr();
};
var idForSelect = {};
UtilReasonReturn.setId = function (id_input) {
    idForSelect = id_input.id;

    if (arrUtilReasonReturn.length == 0) {
        UtilReasonReturn.queryData();
    } else {
        UtilReasonReturn.sortByArr();
    }
};

UtilReasonReturn.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilReasonReturn.focus = function (btn) {
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

