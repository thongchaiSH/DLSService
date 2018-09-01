var UtilCouponPormotion = {};
var arrUtilCouponPormotion = [];
var timerSearch=0;

UtilCouponPormotion.sortByArr = function () {

    highlightWord()
    $("#" + idForSelect).autocomplete({
        source: arrUtilCouponPormotion,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.id);
            UtilCouponPormotion.checkDemoRevison(ui.item.label);
        }
    });
}

UtilCouponPormotion.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilCouponPormotion.checkDemoRevison($(id).val());
}

UtilCouponPormotion.checkDemoRevison = function (label) {
    var index = arrUtilCouponPormotion.findIndex(arrUtilCouponPormotion => arrUtilCouponPormotion.label == label
    )
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrUtilCouponPormotion[index].id);
    } else {
        $("#" + idForSelect).val("");
        $("#" + idForSelect).attr("data-id", "");
    }
}


UtilCouponPormotion.queryData = function () {

    arrUtilCouponPormotion = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/coupons/findAllCouponPromotionViewByPromotionType?promotionType='+$("#" + idForSelect).attr("promotionType"),
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

            var name = item.promotionCode == null ? '' : item.promotionCode;
            var data = {
                label: name,
                id: item.promotionCode,

            };
            arrUtilCouponPormotion.push(data);
        })
    }
    UtilCouponPormotion.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};
var idForSelect = {};
UtilCouponPormotion.setId = function (id_input) {
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        UtilCouponPormotion.queryData();
    }
    else {
        $("#" + idForSelect).autocomplete('search', '');
    }
};

UtilCouponPormotion.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilCouponPormotion.queryData();
        }, 1000);
}

UtilCouponPormotion.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilCouponPormotion.focus = function (btn) {
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





