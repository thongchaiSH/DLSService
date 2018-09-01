UtilLovItemListOrderCoupon = {};
UtilLovItemListOrderCoupon.arrLov = [];
UtilLovItemListOrderCoupon.timerSearch = 0;
UtilLovItemListOrderCoupon.objectModal = $.extend({}, UtilPagination);
UtilLovItemListOrderCoupon.pointsActive = {};
var timerSearch = 0;

UtilLovItemListOrderCoupon.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
        console.log("destroy")

    } catch (err) {
        console.log("no autocomplete")
    }
    UtilLovItemListOrderCoupon.highlightWord()
    $("#" + idForSelect).autocomplete({
        source: UtilLovItemListOrderCoupon.arrLov,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.desc);
            UtilLovItemListOrderCoupon.checkDemoRevison(ui.item.label);
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
            }
        }

    });
}
UtilLovItemListOrderCoupon.checkData = function (btn) {
    var id = "#" + btn.id;
    if ($(id).val() != "") {
        UtilLovItemListOrderCoupon.checkDemoRevison($(id).val());
    }
}
UtilLovItemListOrderCoupon.checkDemoRevison = function(label) {
    var arrLov = UtilLovItemListOrderCoupon.arrLov;
    var index = arrLov.findIndex(arrLov => arrLov.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", UtilLovItemListOrderCoupon.arrLov[index].desc);
        $("#" + idForSelect).attr("data-label", UtilLovItemListOrderCoupon.arrLov[index].label);
        $("#" + idForSelect).attr("data-name", UtilLovItemListOrderCoupon.arrLov[index].name);
        $("#" + idForSelect).attr("data-price", UtilLovItemListOrderCoupon.arrLov[index].price);
        $("#" + idForSelect).attr("data-item-type", UtilLovItemListOrderCoupon.arrLov[index].itemType);
        $("#" + idForSelect).attr("data-itemCode", UtilLovItemListOrderCoupon.arrLov[index].itemCode);
        $("#" + idForSelect).attr("data-oldItemCode", UtilLovItemListOrderCoupon.arrLov[index].oldItemCode);
        $("#" + idForSelect).attr("data-hasOldItemCode", UtilLovItemListOrderCoupon.arrLov[index].hasOldItemCode);
        if(UtilLovItemListOrderCoupon.arrLov[index].points != undefined){
            $.each(UtilLovItemListOrderCoupon.arrLov[index].points, function(index,item){
                $("#" + idForSelect).attr("data-point"+item.pointCode, item.pointQty);
            });    
        }
    }else{
        $("#" + idForSelect).attr("data-id", "");
        $("#" + idForSelect).attr("data-label", "");
        $("#" + idForSelect).attr("data-name", "");
        $("#" + idForSelect).attr("data-price", "");
        $("#" + idForSelect).attr("data-item-type", "");
        $("#" + idForSelect).attr("data-itemCode", "");
        $("#" + idForSelect).attr("data-oldItemCode", "");
        $("#" + idForSelect).attr("data-hasOldItemCode", "");
    }
}
UtilLovItemListOrderCoupon.queryData = function () {
    console.log("query")

    var keywordSearch = $("#" + idForSelect).val();
    console.log(keywordSearch);
    UtilLovItemListOrderCoupon.arrLov = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCode',
        data: {
            orderBy: "itemName",
            sortBy: "ASC",
            find: keywordSearch,
            firstResult: null,
            maxResult: 15,
            customerCode: session.lovItemCustomerCode,
            notItemTypeIn: "2",
            username: session.user
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
            var name = CheckNull(item.itemCode) + " " + CheckNull(item.itemName);
            var data = {
                label: name,
                desc: item.itemCode,
                name: item.itemName,
                price: item.priceList,
                itemType: item.itemType,
                points: item.getSoItemListDetailViews,
                itemCode: item.itemCode,
                oldItemCode: item.oldItemCode,
                hasOldItemCode: item.hasOldItemCode
            };
            UtilLovItemListOrderCoupon.arrLov.push(data);
        })
    }

    UtilLovItemListOrderCoupon.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};

var idForSelect;
UtilLovItemListOrderCoupon.setId = function (id_input) {

    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        // if (arrLov.length == 0) {
        UtilLovItemListOrderCoupon.queryData();
        // }
    }
    else {
        $("#" + idForSelect).autocomplete('search', '');
    }

    UtilLovItemListOrderCoupon.masterId = idForSelect;
};
UtilLovItemListOrderCoupon.focusInput = function (id_input) {
    idForSelect = id_input.id;
    console.log("focusInput");
};
UtilLovItemListOrderCoupon.focus = function (btn) {
    var id = "#" + btn.id;
    UtilLovItemListOrderCoupon.idInput = "#" + $(id).attr('data-target');
    $(UtilLovItemListOrderCoupon.idInput).click();
};
UtilLovItemListOrderCoupon.highlightWord = function() {

    var oldFn = $.ui.autocomplete.prototype._renderItem;

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {

        var t = item.label.replace(this.term, "<span style='font-weight:bold;background-color:#B2FF59;'>" + this.term + "</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + t + "</a>")
            .appendTo(ul);
    };
}
UtilLovItemListOrderCoupon.research = function () {

    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilLovItemListOrderCoupon.queryData();
        }, 1000);

}

UtilLovItemListOrderCoupon.idInput;
UtilLovItemListOrderCoupon.searchValueModal = function (items) {
    var id = $(items).attr('searchLabel').split("_")[0];


    if (!$('#lovSearchItemList').attr('disabled')) { //not disabled
        var inputTextValue = $("input#" + id).val();
        var labelId = $(items).attr('searchLabel');
        UtilLovItemListOrderCoupon.idInput = labelId;
        var $label = $("input#" + UtilLovItemListOrderCoupon.idInput)

        $label.val(inputTextValue);
        UtilLovItemListOrderCoupon.loadDataKeyword(inputTextValue, "itemName", "asc");
        $("#searchModal" + UtilLovItemListOrderCoupon.masterId).modal('show');
    }

}
UtilLovItemListOrderCoupon.searchKeyword = function () {
    // UtilLovItemListOrderCoupon.idInput
    var input = $("input#" + UtilLovItemListOrderCoupon.idInput);
    var value = input.val();
    console.log("value")
    UtilLovItemListOrderCoupon.loadDataKeyword(value, "itemName", "asc");
}

UtilLovItemListOrderCoupon.loadDataKeyword = function(keyword, orderBy, sortBy) {
    keyword = keyword == null ? "" : keyword
    var criteriaObject = {
        find: keyword,
        orderBy: orderBy,
        sortBy: sortBy,
        customerCode: session.lovItemCustomerCode,
        notItemTypeIn: "2",
        username: session.user
    };


    UtilLovItemListOrderCoupon.objectModal.setId("#paggingModal");
    UtilLovItemListOrderCoupon.objectModal.setUrlData("/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCode");
    UtilLovItemListOrderCoupon.objectModal.setUrlSize("/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCodeSize");
    UtilLovItemListOrderCoupon.objectModal.setLimitData(session.initialData.limitPagingLov);
    UtilLovItemListOrderCoupon.objectModal.loadTable = function (items) {
        UtilLovItemListOrderCoupon.renderDataKeyword(items);
    }

    UtilLovItemListOrderCoupon.objectModal.setDataSearch(criteriaObject);
    UtilLovItemListOrderCoupon.objectModal.search(UtilLovItemListOrderCoupon.objectModal);

}
UtilLovItemListOrderCoupon.renderDataKeyword = function(data) {
    if (!UtilLovItemListOrderCoupon.isRenderModal) {
        UtilLovItemListOrderCoupon.findPointActive();
        $.each(UtilLovItemListOrderCoupon.pointsActive, function (key, value) {
            $('#rtTable').append("" +
                '<th value="' + key + '" class="text-center" name="modalTablePoint" style="color:black;vertical-align: middle;">' + value + '</th>'
            );
        });
        UtilLovItemListOrderCoupon.isRenderModal = true;
    }

    $("#modalTable").empty();
    if (data.length > 0) {
        $.each(data, function (index, item) {
            // console.log(item);
            var dataFunction = item.itemCode + "#" + item.itemName;

            var pointData = "";
            $.each(UtilLovItemListOrderCoupon.pointsActive, function (key, value) {
                var keySearch = key.replace("p", "point");
                console.log(item[keySearch])
                if (item[keySearch] != undefined) {
                    pointData += '<td  onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas(item[keySearch]) + '</td>';
                } else {
                    pointData += '<td  onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas("0") + '</td>';
                }
            });
            // console.log(pointData)

            $("#modalTable").append("" +
                '<tr>' +
                '<td onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-center" >' + CheckNull(item.itemCode) + '</td>' +
                '<td onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-left" >' + CheckNull(item.itemName) + '</td>' +
                '<td onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-left"  >' + CheckNull(item.itemNameEng) + '</td>' +
                '<td onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-left" >' + CheckNull(item.itemShortName) + '</td>' +
                '<td onclick="UtilLovItemListOrderCoupon.selectItemTable(\'' + dataFunction + '\')" class="text-right" >' + numberWithCommas(item.priceList,2) + '</td>' +
                pointData +
                '</tr>');

        });
        $('[name=modalTableListItem]').hide();
        $('#modalTableListItemAdd').show();
    } else {
        $('[name=modalTableListItem]').show();
        $('#modalTableListItemAdd').hide();
    }
    UtilLovItemListOrderCoupon.renderPointActive();

}

UtilLovItemListOrderCoupon.selectItemTable = function (data) {
    // console.log(data);
    var code = data.split("#")[0];
    $("#" + UtilLovItemListOrderCoupon.masterId).val(data.replace("#", " "));
    $("#" + UtilLovItemListOrderCoupon.masterId).attr('data-id', code);
    $("#searchModal" + UtilLovItemListOrderCoupon.masterId).modal('hide');

}
UtilLovItemListOrderCoupon.findPointActive = function () {
    // UtilLovItemListOrderCoupon.idInput
    $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/points/findPointActive',
        complete: function (xhr) {
            if (xhr.readyState == 4) {
                if (xhr.getResponseHeader('statusValidate') == 0) {
                    var result = xhr.responseJSON;
                    $.each(result, function (key, value) {
                        UtilLovItemListOrderCoupon.pointsActive[value.pointCode] = value.pointName
                    });
                } else {
                    console.log("Error findPointActive: ", xhr.getResponseHeader('errorMsg'));
                }
            }
        },
        async: false
    });
};
UtilLovItemListOrderCoupon.renderPointActive = function () {
    $('[name=modalTablePoint]').each(function () {
        var pointCode = $(this).attr('value');
        if (UtilLovItemListOrderCoupon.pointsActive[pointCode] != undefined) {
            $(this).show()
        } else {
            $(this).hide();
        }
    });
}

// check empty Data return " "
function CheckNull(object) {
    if (object == null || object == "null" || object == "" || object == undefined) {
        object = "";
    } else {
        object = object;
    }
    return object;
}
function numberWithCommas(number,digit) {
    if(digit==undefined)
        digit=0;
    number = CheckNullReturnValue(number,"0") + "";
    number=parseFloat(number).toFixed(digit);
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function CheckNullReturnValue(object,returnValue) {
    if (object == null || object == "null" || object == "" || object == undefined) {
        object = returnValue;
    } else {
        object = object;
    }
    return object;
}