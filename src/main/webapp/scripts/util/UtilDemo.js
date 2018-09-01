var UtilDemo = {};
var arrDemo = [];


UtilDemo.sortByArr = function () {

    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrDemo,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.desc);
            checkDemoRevison(ui.item.label);
        }
    }).focus(function () {
        $(this).autocomplete('search', '')
    });
    $("#" + idForSelect).focus();
}

UtilDemo.checkData = function (btn) {
    var id = "#" + btn.id;
    checkDemoRevison($(id).val());
}

function checkDemoRevison(label) {
    var index = arrDemo.findIndex(arrDemo = > arrDemo.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrDemo[index].desc);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
    }
}

UtilDemo.queryData = function () {

    arrDemo = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/demos/listDemoApplicationOrderByParam',
        data: {
            orderBy: 'localName',
            sortBy: 'asc',
            find: $("#" + idForSelect).val(""),
            maxResult: null
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

            var name = item.localName == null ? '' : item.localName;

            var data = {
                label: name,
                desc: item.id
            };
            arrDemo.push(data);

        })
    }
    UtilDemo.sortByArr();
};
var idForSelect;
UtilDemo.setId = function (id_input) {
    idForSelect = id_input.id;

    if (arrDemo.length == 0) {
        UtilDemo.queryData();
    } else {
        UtilDemo.sortByArr();
    }
};

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

