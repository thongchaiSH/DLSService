var UtilCustomerWithOutPhama = {};
var arrUtilCustomerWithOutPhama = [];
var timerSearch=0;


UtilCustomerWithOutPhama.onChange = function (e) {
    console.log('UtilCustomerWithOutPhama.onChange');
}
UtilCustomerWithOutPhama.onSelect = function (e) {
    console.log('UtilDemo.onSelect');
}
UtilCustomerWithOutPhama.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrUtilCustomerWithOutPhama,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilCustomerWithOutPhama.checkDemoRevison(ui.item.label);
            UtilCustomerWithOutPhama.onSelect(event);
            
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
                // $("#" + idForSelect).attr('customercode', '');
            }
            UtilCustomerWithOutPhama.onChange(event);
        }
    });
}

UtilCustomerWithOutPhama.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilCustomerWithOutPhama.checkDemoRevison($(id).val());
}

UtilCustomerWithOutPhama.checkDemoRevison = function (label) {
    var index = arrUtilCustomerWithOutPhama.findIndex(arrUtilCustomerWithOutPhama => arrUtilCustomerWithOutPhama.label == label
    );
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilCustomerWithOutPhama[index].id);
        $("#" + idForSelect).attr("data-customerCode", arrUtilCustomerWithOutPhama[index].customerCode);
        $("#" + idForSelect).attr("data-label", arrUtilCustomerWithOutPhama[index].subCustomerName);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
        $("#" + idForSelect).attr("data-customerCode", "");
        $("#" + idForSelect).attr("data-label", "");
    }
}


UtilCustomerWithOutPhama.queryData = function () {

    arrUtilCustomerWithOutPhama = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/customerUsers/findCustomerAndSubCustomerByCustomerCode?customerCode='+$("#" + idForSelect).attr("customerCode"),
      
        headers: {
            Accept: "application/json",
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false
    }).responseJSON;

    if (json != null) {
        // console.log(json);
        $.each(json, function (index, item) {
            console.log(item);
            // var name = item.subCustomerName == null ? '' : item.subCustomerName;
            var code = item.subCustomerCode == "" ? item.customerCode : item.subCustomerCode;
            var name = item.subCustomerName == null ? '' : item.subCustomerName;
            var data = {
                label: code + " " + name,
                id: item.subCustomerCode,
                customerCode: item.customerCode,
                subCustomerName : item.subCustomerName
            };
            arrUtilCustomerWithOutPhama.push(data);
        })
    }
    UtilCustomerWithOutPhama.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};
var idForSelect = {};
UtilCustomerWithOutPhama.setId = function (id_input) {
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        UtilCustomerWithOutPhama.queryData();
        $("#" + idForSelect).focus();
    }
    else {
        $("#" + idForSelect).focus();
        $("#" + idForSelect).autocomplete('search', '');
    }
    // setTimeout(function () {
    //     $("#" + idForSelect).focus();
    // },10)

};

UtilCustomerWithOutPhama.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilCustomerWithOutPhama.queryData();
        }, 1000);
}

UtilCustomerWithOutPhama.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilCustomerWithOutPhama.focus = function (btn) {
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

