var UtilReasonAdjustPoint = {};
var arrUtilReasonAdjustPoint = [];

UtilReasonAdjustPoint.sortByArr = function () {

    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrUtilReasonAdjustPoint,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilReasonAdjustPoint.checkDemoRevison(ui.item.label);
        }
    }).focus(function () {
        $(this).autocomplete('search', '')
    });
    $("#" + idForSelect).focus();
}

UtilReasonAdjustPoint.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilReasonAdjustPoint.checkDemoRevison($(id).val());
}

UtilReasonAdjustPoint.checkDemoRevison = function (label) {
    var index = arrUtilReasonAdjustPoint.findIndex(arrUtilReasonAdjustPoint => arrUtilReasonAdjustPoint.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilReasonAdjustPoint[index].id);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
    }
}


UtilReasonAdjustPoint.queryData = function () {

    arrUtilReasonAdjustPoint = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/centrals/listDescriptionByParameterNolikeAndmaxSizeAndOrderby',
        data: {
            orderBy: 'code',
            headerNo: '303',//find data in parameter 303
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

        $.each(json, function (index, item) {
            // console.log(item);
            var name = item.description == null ? '' : item.description;
            var data = {
                label: name,
                id: item.value2
            };
            arrUtilReasonAdjustPoint.push(data);
        })
    }
    UtilReasonAdjustPoint.sortByArr();
};
var idForSelect = {};
UtilReasonAdjustPoint.setId = function (id_input) {
    idForSelect = id_input.id;

    if (arrUtilReasonAdjustPoint.length == 0) {
        UtilReasonAdjustPoint.queryData();
    } else {
        UtilReasonAdjustPoint.sortByArr();
    }
};

UtilReasonAdjustPoint.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilReasonAdjustPoint.focus = function (btn) {
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

