UtilLovItemListOrder = {};
UtilLovItemListOrder.arrLov = [];
UtilLovItemListOrder.timerSearch = 0;
UtilLovItemListOrder.objectModal = $.extend({}, UtilPagination);
UtilLovItemListOrder.pointsActive = {};
UtilLovItemListOrder.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete('destroy');
        console.log("destroy")

    } catch (err) {
        console.log("no autocomplete")
    }
    UtilLovItemListOrder.highlightWord()
    $("#" + idForSelect).autocomplete({
        source: UtilLovItemListOrder.arrLov,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.desc);
            UtilLovItemListOrder.checkDemoRevison(ui.item.label);
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
            }
        }

    });
}
UtilLovItemListOrder.checkData = function (btn) {
    var id = "#" + btn.id;
    UtilLovItemListOrder.checkDemoRevison($(id).val());
}
UtilLovItemListOrder.checkDemoRevison = function(label) {
    var arrLov = UtilLovItemListOrder.arrLov;
    var index = arrLov.findIndex(arrLov => arrLov.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", UtilLovItemListOrder.arrLov[index].desc);
        $("#" + idForSelect).attr("data-label", UtilLovItemListOrder.arrLov[index].label);
        $("#" + idForSelect).attr("data-name", UtilLovItemListOrder.arrLov[index].name);
        $("#" + idForSelect).attr("data-price", UtilLovItemListOrder.arrLov[index].price);
        $("#" + idForSelect).attr("data-item-type", UtilLovItemListOrder.arrLov[index].itemType);
        $("#" + idForSelect).attr("data-item-type-web", UtilLovItemListOrder.arrLov[index].itemTypeWeb);
        $("#" + idForSelect).attr("data-itemCode", UtilLovItemListOrder.arrLov[index].itemCode);
        $("#" + idForSelect).attr("data-oldItemCode", UtilLovItemListOrder.arrLov[index].oldItemCode);
        $("#" + idForSelect).attr("data-hasOldItemCode", UtilLovItemListOrder.arrLov[index].hasOldItemCode);
        var allAttr = $("#" + idForSelect)[0].attributes
        $.each(allAttr, function () {
            if (this.name.indexOf("data-point") >= 0) {
                console.log(this.name)
                $("#" + idForSelect).attr(this.name,0);
            }
        });
        if(UtilLovItemListOrder.arrLov[index].points != undefined){
            $.each(UtilLovItemListOrder.arrLov[index].points, function(index,item){
                $("#" + idForSelect).attr("data-point"+item.pointCode, item.pointQty);
            });
        }


    }else{
        $("#" + idForSelect).attr("data-id", "");
        $("#" + idForSelect).attr("data-label", "");
        $("#" + idForSelect).attr("data-name", "");
        $("#" + idForSelect).attr("data-price", "");
        $("#" + idForSelect).attr("data-item-type", "");
        $("#" + idForSelect).attr("data-item-type-web", "");
        $("#" + idForSelect).attr("data-itemCode", "");
        $("#" + idForSelect).attr("data-oldItemCode", "");
        $("#" + idForSelect).attr("data-hasOldItemCode", "");
    }

}
UtilLovItemListOrder.queryData = function () {
    console.log("query")

    if(idForSelect==""){
        console.log("idForSelect-->Empty")
        return false;
    }

    var keywordSearch = $("#" + idForSelect).val();
    console.log(keywordSearch);
    UtilLovItemListOrder.arrLov = [];
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
            subCustomerCode:session.subCustomerCode,
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
                itemTypeWeb: item.itemTypeWeb,
                points: item.getSoItemListDetailViews,
                itemCode: item.itemCode,
                oldItemCode: item.oldItemCode,
                hasOldItemCode: item.hasOldItemCode
            };
            UtilLovItemListOrder.arrLov.push(data);
        })
    }

    UtilLovItemListOrder.sortByArr();
    $("#" + idForSelect).autocomplete('search', '');
};


UtilLovItemListOrder.setId = function (id_input) {
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        // if (UtilLovItemListOrder.arrLov.length == 0) {
            UtilLovItemListOrder.queryData();
        // }
    }
    else {
        $("#" + idForSelect).focus();
    }
};
UtilLovItemListOrder.focusInput = function (id_input) {
    idForSelect = id_input.id;
    console.log("focusInput");
};
UtilLovItemListOrder.focus = function (btn) {
    var id = "#" + btn.id;
    UtilLovItemListOrder.idInput = "#" + $(id).attr('data-target');
    $(UtilLovItemListOrder.idInput).click();
};
UtilLovItemListOrder.highlightWord = function () {

    var oldFn = $.ui.autocomplete.prototype._renderItem;

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {

        var t = item.label.replace(this.term, "<span style='font-weight:bold;background-color:#B2FF59;'>" + this.term + "</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + t + "</a>")
            .appendTo(ul);
    };
}
UtilLovItemListOrder.research = function () {

    if (UtilLovItemListOrder.timerSearch != 0) {
        clearTimeout(UtilLovItemListOrder.timerSearch);
    }
    UtilLovItemListOrder.timerSearch = setTimeout(
        function () {
            UtilLovItemListOrder.queryData();
        }, 1000);

}

UtilLovItemListOrder.idInput;
UtilLovItemListOrder.searchValueModal = function (items) {
    idForSelect = "";
    var id = $(items).attr('searchLabel').split("__")[0];

    if (!$("#"+id).attr('disabled')) { //not disabled
        var inputTextValue = $("input#" + id).val();
        var labelId = $(items).attr('searchLabel');
        UtilLovItemListOrder.idInput = labelId;
        var $label = $("input#" + UtilLovItemListOrder.idInput)

        $label.val(inputTextValue);
        UtilLovItemListOrder.loadDataKeyword(inputTextValue, "itemName", "asc");
        $("#searchModal" + UtilLovItemListOrder.masterId).modal('show');
    }

}
UtilLovItemListOrder.searchKeyword = function () {
    // UtilLovItemListOrder.idInput
    var input = $("input#" + UtilLovItemListOrder.idInput);
    var value = input.val();
    UtilLovItemListOrder.loadDataKeyword(value, "itemName", "asc");
};
UtilLovItemListOrder.loadDataKeyword = function(keyword, orderBy, sortBy) {
    keyword = keyword == null ? "" : keyword
    var criteriaObject = {
        find: keyword,
        orderBy: orderBy,
        sortBy: sortBy,
        customerCode: session.lovItemCustomerCode,
        username: session.user
    };


    UtilLovItemListOrder.objectModal.setId("#paggingModal");
    UtilLovItemListOrder.objectModal.setUrlData("/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCode");
    UtilLovItemListOrder.objectModal.setUrlSize("/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCodeSize");
    UtilLovItemListOrder.objectModal.setLimitData(session.initialData.limitPagingLov);
    UtilLovItemListOrder.objectModal.loadTable = function (items) {
        UtilLovItemListOrder.renderDataKeyword(items);
    }

    UtilLovItemListOrder.objectModal.setDataSearch(criteriaObject);
    UtilLovItemListOrder.objectModal.search(UtilLovItemListOrder.objectModal);

}
UtilLovItemListOrder.renderDataKeyword = function(data) {
    if (!UtilLovItemListOrder.isRenderModal) {
        UtilLovItemListOrder.findPointActive();
        $.each(UtilLovItemListOrder.pointsActive, function (key, value) {
            $('#rtTable').append("" +
                '<th value="' + key + '" class="text-center" name="modalTablePoint" style="color:black;vertical-align: middle;">' + value + '</th>'
            );
        });
        $('#rtTable').append('<th class="text-center" style="color:black;vertical-align: middle;">'+LB_USE_DETAIL+'</th>');
        UtilLovItemListOrder.isRenderModal = true;
    }

    $("#modalTable").empty();
    if (data.length > 0) {
        $.each(data, function (index, item) {

            var dataFunction = UtilLovItemListOrder.enHtmlEntity(item);
            var itemPoint = {};
            if (item.getSoItemListDetailViews.length > 0) {
                $.each(item.getSoItemListDetailViews, function (k, v) {
                    itemPoint[v.pointCode] = v.pointQty;
                })
            }
            var pointData = "";
            $.each(UtilLovItemListOrder.pointsActive, function (key, value) {
                var keySearch = key.replace("p", "point");
                console.log(itemPoint[keySearch])
                if (itemPoint[keySearch] != undefined) {
                    pointData += '<td  onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas(itemPoint[keySearch]) + '</td>';
                } else {
                    pointData += '<td  onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas("0") + '</td>';
                }
            });
            // console.log(pointData)

            $("#modalTable").append("" +
                '<tr>' +

                '<td onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-left" >' + CheckNull(item.itemName) + '</td>' + //ชื่อสินค้า
                '<td onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-center" >' + CheckNull(item.itemCode) + '</td>' + //รหัส
                '<td onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-center" >' + CheckNull(item.itemSize) + '</td>' + //ขนาด
                '<td onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-right" >' + numberWithCommas(item.priceList,2) + '</td>' +
                pointData +
                '<td onclick="UtilLovItemListOrder.selectItemTable('+dataFunction+')" class="text-left" >' + CheckNull(item.useDetail) + '</td>' +
                '</tr>');

        });
        $('[name=modalTableListItem]').hide();
        $('#modalTableListItemAdd').show();
    } else {
        $('[name=modalTableListItem]').show();
        $('#modalTableListItemAdd').hide();
    }
    UtilLovItemListOrder.renderPointActive();

}
    UtilLovItemListOrder.selectItemTable = function (data) {

    $("#" + UtilLovItemListOrder.masterId).val(data.itemCode+" "+data.itemName);
    $("#" + UtilLovItemListOrder.masterId).attr('data-id', data.itemCode);
    $("#" + UtilLovItemListOrder.masterId).attr('data-label', data.itemCode+" "+data.itemName);
    $("#" + UtilLovItemListOrder.masterId).attr('data-name', data.itemName);
    $("#" + UtilLovItemListOrder.masterId).attr('data-price', data.priceList);
    $("#" + UtilLovItemListOrder.masterId).attr('data-item-type', data.itemType);
    if(data.points != undefined){
        $.each(data.points, function(index,item){
            $("#" + UtilLovItemListOrder.masterId).attr("data-point"+item.pointCode, item.pointQty);
        });
    }

    $("#searchModal" + UtilLovItemListOrder.masterId).modal('hide');
    $("[id=" + UtilLovItemListOrder.masterId + "]").focusout();
}
UtilLovItemListOrder.findPointActive = function () {
    // UtilLovItemListOrder.idInput
    $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/points/findPointActive',
        complete: function (xhr) {
            if (xhr.readyState == 4) {
                if (xhr.getResponseHeader('statusValidate') == 0) {
                    var result = xhr.responseJSON;
                    $.each(result, function (key, value) {
                        UtilLovItemListOrder.pointsActive[value.pointCode] = value.pointName
                    });
                } else {
                    console.log("Error findPointActive: ", xhr.getResponseHeader('errorMsg'));
                }
            }
        },
        async: false
    });
};
UtilLovItemListOrder.renderPointActive = function () {
    $('[name=modalTablePoint]').each(function () {
        var pointCode = $(this).attr('value');
        if (UtilLovItemListOrder.pointsActive[pointCode] != undefined) {
            $(this).show()
        } else {
            $(this).hide();
        }
    });
};
UtilLovItemListOrder.showModalLov = function(btn){
    if(UtilLovItemListOrder.masterId != btn.id.replace('btnUtil','')){
        UtilLovItemListOrder.masterId = btn.id.replace('btnUtil','');
    }
    UtilLovItemListOrder.searchValueModal(btn);

    // เปลี่ยนชื่อ Modal ให้ตรงกับชื่อ Lov
    $("[id^=searchModal]:first").attr("id", "searchModal"+UtilLovItemListOrder.masterId);
    $(".sub-button").attr("id", UtilLovItemListOrder.masterId+"btnUtil").attr("data-target", UtilLovItemListOrder.masterId);

    $("[id$=__product]").attr("id", UtilLovItemListOrder.masterId+"__product").val($("#"+UtilLovItemListOrder.masterId).val());
    $("#searchModal" + UtilLovItemListOrder.masterId).modal('show');
    setTimeout(function(){
        $("#searchModal" + UtilLovItemListOrder.masterId).focus();
    }, 500);

};

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

UtilLovItemListOrder.enHtmlEntity = function(dataObj) {
    var str = JSON.stringify(dataObj);
    var buf = [];
    if (str == undefined) {
        return '{}';
    }
    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift([ '&#', str[i].charCodeAt(), ';' ].join(''));
    }
    return buf.join('');
}
UtilLovItemListOrder.deHtmlEntity = function(str) {
//		 console.log('str ::==',str);
    if (str == undefined) {
        return {};
    }
    var deJson = str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
    return JSON.parse(deJson);
}