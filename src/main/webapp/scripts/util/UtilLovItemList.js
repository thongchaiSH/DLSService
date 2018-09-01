var UtilLovItemList = {};

var timerSearch = 0;
var dataHeader;
var objectModal = $.extend({}, UtilPagination);

UtilLovItemList.pointsActive = {};
UtilLovItemList.arrLovEmptyTemp = [];
UtilLovItemList.onChange = function () {
    console.log('onChange')
}

UtilLovItemList.onSelect = function (e) {
    console.log('onSelect');
}
UtilLovItemList.sortByArr = function () {
    try {
        $("#" + idForSelect).autocomplete("destroy");
        // console.log("destroy")

    } catch (err) {
        console.log("no autocomplete")
    }
    highlightWord();
    $("#" + idForSelect).autocomplete({
        source: UtilLovItemList.arrLov,
        minLength: 0,
        select: function (event, ui) {
            $("#" + idForSelect).val(ui.item.desc);
            UtilLovItemList.checkDemoRevison(ui.item.label);
            UtilLovItemList.onSelect(event);
        },
        change: function (event, ui) {
            if ($("#" + idForSelect).val() == "") {
                $("#" + idForSelect).attr('data-id', '');
            }
            UtilLovItemList.onChange();
        },
    });
    // $("#" + idForSelect).focus();
}

UtilLovItemList.checkData = function (btn) {
    // console.log('onblur')
    var id = "#" + btn.id;
    // console.log(id);
    if ($(id).val() != "") {
        UtilLovItemList.checkDemoRevison($(id).val());
    }
}

UtilLovItemList.checkDemoRevison = function (label) {

    var arrLov = UtilLovItemList.arrLov;
    var index = arrLov.findIndex(arrLov => arrLov.label == label
)
    ;
    if (index != -1) {
        $("#" + idForSelect).attr("data-id", arrLov[index].desc);
        $("#" + idForSelect).attr("data-label", arrLov[index].label);
        $("#" + idForSelect).attr("data-name", arrLov[index].name);
        $("#" + idForSelect).attr("data-oldName", arrLov[index].oldName);
        $("#" + idForSelect).attr("data-price", arrLov[index].price);
        $("#" + idForSelect).attr("data-item-type", arrLov[index].itemType);
        $("#" + idForSelect).attr("data-item-type-web", arrLov[index].itemTypeWeb);
        $("#" + idForSelect).attr("data-plCode", arrLov[index].plCode);
        $("#" + idForSelect).attr("data-packCode", arrLov[index].packCode);
        $("#" + idForSelect).attr("data-itemCode", arrLov[index].itemCode);
        $("#" + idForSelect).attr("data-oldItemCode", arrLov[index].oldItemCode);
        $("#" + idForSelect).attr("data-hasOldItemCode", arrLov[index].hasOldItemCode);
        $("#" + idForSelect).attr("data-minOrder", arrLov[index].minOrder);
        if ($("#" + idForSelect)[0]) {
            //clear attr
            var allAttr = $("#" + idForSelect)[0].attributes
            $.each(allAttr, function () {
                if (this.name.indexOf("data-point") >= 0) {
                    // console.log(this.name)
                    $("#" + idForSelect).attr(this.name, 0);
                }
            });
        }
        if (arrLov[index].points != undefined) {
            $.each(arrLov[index].points, function (index, item) {
                $("#" + idForSelect).attr("data-point" + item.pointCode, item.pointQty);
            });
        }
    } else {
        $("#" + idForSelect).attr("data-id", '');
        $("#" + idForSelect).attr("data-label", '');
        $("#" + idForSelect).attr("data-name", '');
        $("#" + idForSelect).attr("data-oldName", '');
        $("#" + idForSelect).attr("data-price", '');
        $("#" + idForSelect).attr("data-item-type", '');
        $("#" + idForSelect).attr("data-item-type-web", '');
        $("#" + idForSelect).attr("data-plCode", '');
        $("#" + idForSelect).attr("data-packCode", '');
        $("#" + idForSelect).attr("data-itemCode", '');
        $("#" + idForSelect).attr("data-oldItemCode", '');
        $("#" + idForSelect).attr("data-hasOldItemCode", '');
        $("#" + idForSelect).attr("data-minOrder", '');
        // $("#" + idForSelect).val('');
    }

}

UtilLovItemList.queryData = function (isNotShow) {
    var keywordSearch = $("#" + idForSelect).val();
    if (keywordSearch != undefined) {
        var dataCriteria = {
            orderBy: "itemName",
            sortBy: "ASC",
            find: keywordSearch,
            pointCode: UtilLovItemList.pointCode,
            orderType: UtilLovItemList.orderType,
            maxResult: 15,
            customerCode: session.lovItemCustomerCode,
            subCustomerCode: session.subCustomerCode,
            username: session.user
        }

        var url = '/itemList/listItemListByNamelikeAndmaxSizeAndOrderby';
        // กรณี ถ้าเป็นหน้า สร้าง Order เปลี่ยน controllers
        if (dataHeader != undefined) {            // For order
            url = '/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCode';
        }

        UtilLovItemList.arrLov = [];
        if(keywordSearch=="" && UtilLovItemList.arrLovEmptyTemp.length>0){
            //For Tune performance
            UtilLovItemList.arrLov= UtilLovItemList.arrLovEmptyTemp;
            UtilLovItemList.sortByArr();
            if (!isNotShow) {
                if (dataHeader != undefined) {
                    if (keywordSearch.length > 0) {
                        $("#" + idForSelect).autocomplete('search', '');
                    }
                } else {
                    $("#" + idForSelect).autocomplete('search', '');
                }
            }
        }else{
            AjaxUtil.get(url, dataCriteria,false).complete(function (xhr) {
                console.log('AjaxUtil');
                if (xhr.readyState == 4) {
                    if (xhr.getResponseHeader('statusValidate') == 0) {
                        var json = xhr.responseJSON;

                        if (json != null) {
                            $.each(json, function (index, item) {
                                var name = CheckNull(item.itemCode) + " " + CheckNull(item.itemName);
                                if (item.hasOldItemCode == 'Y') {
                                    name = CheckNull(item.oldItemCode) + " " + CheckNull(item.itemNameEng);
                                }
                                var data = {
                                    label: name,
                                    desc: item.itemCode,
                                    name: item.itemName,
                                    oldName: item.itemNameEng,
                                    price: item.priceList,
                                    itemType: item.itemType,
                                    itemTypeWeb: item.itemTypeWeb,
                                    points: item.getSoItemListDetailViews,
                                    plCode: item.plCode,
                                    packCode: item.packCode,
                                    itemCode: item.itemCode,
                                    oldItemCode: item.oldItemCode,
                                    hasOldItemCode: item.hasOldItemCode,
                                    minOrder: item.minOrder
                                };
                                UtilLovItemList.arrLov.push(data);
                            })
                            if(keywordSearch==""){
                                UtilLovItemList.arrLovEmptyTemp=UtilLovItemList.arrLov;
                            }
                        }

                        UtilLovItemList.sortByArr();
                        if (!isNotShow) {
                            if (dataHeader != undefined) {
                                if (keywordSearch.length > 0) {
                                    $("#" + idForSelect).autocomplete('search', '');
                                }
                            } else {
                                $("#" + idForSelect).autocomplete('search', '');
                            }
                        }
                    }
                }
            });
        }
    }

};
UtilLovItemList.ajaxQueryData=function (find) {

};

var idForSelect;
UtilLovItemList.setId = function (id_input) {
    if (idForSelect != id_input.id || !(idForSelect)) {
        idForSelect = id_input.id;
        // if (arrLov.length == 0) {
        UtilLovItemList.queryData();
        // }
    }
    else {
        if (dataHeader != undefined) {
            var keywordSearch = $("#" + idForSelect).val();
            if (keywordSearch.length > 0) {
                $("#" + idForSelect).autocomplete('search', '');
            }
        } else {
            $("#" + idForSelect).autocomplete('search', '');
        }
    }
};

UtilLovItemList.focusInput = function (id_input) {
    idForSelect = id_input.id;
    console.log("focusInput");
};


UtilLovItemList.focus = function (btn) {
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


UtilLovItemList.research = function (ele) {
    idForSelect = $(ele).attr('id');
    // console.log("===research===");
    if (timerSearch != 0) {
        clearTimeout(timerSearch);
    }
    timerSearch = setTimeout(
        function () {
            UtilLovItemList.queryData();
        }, 1000);

}
var idInput;
UtilLovItemList.searchValueModal = function (items) {
    idForSelect = "";
    var id = $(items).attr('searchLabel').split("_")[0];
    if (!$('#lovSearchItemList').attr('disabled')) { //not disabled
        var inputTextValue = $("input#" + id).val();
        var labelId = $(items).attr('searchLabel');
        idInput = labelId;
        var $label = $("input#" + idInput)

        $label.val(inputTextValue);
        loadDataKeyword(inputTextValue, "itemName", "asc");
        $("#searchModal" + UtilLovItemList.masterId).modal('show');
    }
}

UtilLovItemList.searchKeyword = function () {
    // idInput
    var input = $("input#" + idInput);
    var value = input.val();
    console.log("value")
    loadDataKeyword(value, "itemName", "asc");
}


function loadDataKeyword(keyword, orderBy, sortBy) {
    keyword = keyword == null ? "" : keyword
    var criteriaObject = {
        find: keyword,
        orderBy: orderBy,
        sortBy: sortBy,
        customerCode: session.lovItemCustomerCode,
        username: session.user
    };

    var url = '/itemList/listItemListByNamelikeAndmaxSizeAndOrderby';
    var urlSize = '/itemList/listItemListByNamelikeAndmaxSizeAndOrderbySize'
    if (dataHeader != undefined) {            // For order
        url = '/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCode';
        urlSize = '/itemList/listItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCodeSize'
    }

    objectModal.setId("#paggingModal");
    objectModal.setUrlData(url);
    objectModal.setUrlSize(urlSize);
    objectModal.setLimitData(session.initialData.limitPagingLov);
    objectModal.loadTable = function (items) {
        renderDataKeyword(items);
    }

    objectModal.setDataSearch(criteriaObject);
    $('.dv-background').show();
    setTimeout(function () {
        objectModal.search(objectModal);
        $('.dv-background').hide();
    },50)


}

function renderDataKeyword(data) {

    if (!UtilLovItemList.isRenderModal) {
        UtilLovItemList.findPointActive();
        $.each(UtilLovItemList.pointsActive, function (key, value) {
            $('#rtTable').append("" +
                '<th value="' + key + '" class="text-center" name="modalTablePoint" style="color:black;vertical-align: middle;">' + value + '</th>'
            );
        });
        $('#rtTable').append('<th class="text-center" style="color:black;vertical-align: middle;">' + LB_USE_DETAIL + '</th>');
        UtilLovItemList.isRenderModal = true;
    }

    $("#modalTable").empty();
    console.log(data);
    if (data.length > 0) {
        $.each(data, function (index, item) {
            // console.log(item);
            var dataFunction = item.itemCode + "#" + item.itemName;
            var itemPoint = {};
            if (item.getSoItemListDetailViews.length > 0) {
                $.each(item.getSoItemListDetailViews, function (k, v) {
                    itemPoint[v.pointCode] = v.pointQty;
                })
            }
            var pointData = "";
            $.each(UtilLovItemList.pointsActive, function (key, value) {
                var keySearch = key;
                console.log(item[keySearch])
                if (itemPoint[keySearch] != undefined) {
                    pointData += '<td  onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas(itemPoint[keySearch]) + '</td>';
                } else {
                    pointData += '<td  onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas("0") + '</td>';
                }
            });
            // console.log(pointData)

            $("#modalTable").append("" +
                '<tr>' +
                '<td onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-left" >' + CheckNull(item.itemName) + '</td>' + //ชื่อสินค้า
                '<td onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-center" >' + CheckNull(item.itemCode) + '</td>' + //รหัส
                '<td onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-left"  >' + CheckNull(item.itemSize) + '</td>' + //ขนาด
                '<td onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-left" >' + numberWithCommas(item.priceList, 2) + '</td>' +
                pointData +
                '<td onclick="UtilLovItemList.selectItemTable(\'' + dataFunction + '\')" class="text-left" >' + CheckNull(item.useDetail) + '</td>' +
                '</tr>');

        });
        $('[name=modalTableListItem]').hide();
        $('#modalTableListItemAdd').show();
    } else {
        $('[name=modalTableListItem]').show();
        $('#modalTableListItemAdd').hide();
    }
    UtilLovItemList.renderPointActive();

}

UtilLovItemList.selectItemTable = function (data) {

    console.log(data);

    if (typeof data === 'object') {
        var code = data.itemCode;
        var label = data.itemName
    } else {
        var code = data.split("#")[0];
        var label = data.split("#")[1];
    }
    $("#" + UtilLovItemList.masterId).val(code + " " + label);
    $("#" + UtilLovItemList.masterId).attr('data-id', code);
    $("#searchModal" + UtilLovItemList.masterId).modal('hide');

}

UtilLovItemList.findPointActive = function () {
    // idInput
    $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/points/findPointActive',
        complete: function (xhr) {
            if (xhr.readyState == 4) {
                if (xhr.getResponseHeader('statusValidate') == 0) {
                    var result = xhr.responseJSON;
                    $.each(result, function (key, value) {
                        UtilLovItemList.pointsActive[value.pointCode] = value.pointName
                    });
                } else {
                    console.log("Error findPointActive: ", xhr.getResponseHeader('errorMsg'));
                }
            }
        },
        async: false
    });
};
UtilLovItemList.renderPointActive = function () {
    $('[name=modalTablePoint]').each(function () {
        var pointCode = $(this).attr('value');
        if (UtilLovItemList.pointsActive[pointCode] != undefined) {
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

function numberWithCommas(number, digit) {
    if (digit == undefined)
        digit = 0;
    number = CheckNullReturnValue(number, "0") + "";
    number = parseFloat(number).toFixed(digit);
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function CheckNullReturnValue(object, returnValue) {
    if (object == null || object == "null" || object == "" || object == undefined) {
        object = returnValue;
    } else {
        object = object;
    }
    return object;
}