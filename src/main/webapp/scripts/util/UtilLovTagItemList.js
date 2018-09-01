/****************************************************
 *   This is modal TagItem used for InsertOrder
 *   Create By Thongchai Sittikhetkorn
 *
 ****************************************************/
var UtilLovTagItemList = {};
var timerSearch = 0;
var dataHeader;

$(document).ready(function () {
    $('#tagcollapseTableTagItemsPointRem').click(function () {
        if ($(this).hasClass('collapsed')) {
            console.log('fa-caret-down')

            $('#divTableTageItem').css('max-height', '30vh');
        } else {
            console.log('fa-caret-up')
            $('#divTableTageItem').css('max-height', '55vh');
        }
    })
})

UtilLovTagItemList.pointsActive = {};

UtilLovTagItemList.getPointByArrIndexAndPointCode = function (index, pointCode) {
    var item = UtilLovTagItemList.arrLov[index];
    var pointQty;
    $.each(item.points, function (k, v) {
        if (v.pointCode == pointCode) {
            pointQty = v.pointQty;
        }
    })
    return pointQty;
}


UtilLovTagItemList.queryData = function (tagName) {

    var keywordSearch = tagName;
    var dataCriteria = {
        // orderBy: "itemName",
        // sortBy: "ASC",
        find: keywordSearch,
        // pointCode: UtilLovTagItemList.pointCode,
        // orderType: UtilLovTagItemList.orderType,
        // maxResult: 15,
        customerCode: session.lovItemCustomerCode,
        subCustomerCode: session.subCustomerCode,
        username: session.user
    }
    UtilLovTagItemList.arrLov = [];
    $('.dv-background').show();
    AjaxUtil.get('/itemList/listTagItemListByNamelikeAndmaxSizeAndOrderbyChangeItemCode', dataCriteria).complete(function (xhr) {
        if (xhr.readyState == 4) {
            $('.dv-background').hide();
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var json = xhr.responseJSON;
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
                        plCode: item.plCode,
                        packCode: item.packCode,
                        itemCode: item.itemCode,
                        oldItemCode: item.oldItemCode,
                        hasOldItemCode: item.hasOldItemCode,
                        tag: item.tag,
                        minOrder: item.minOrder
                    };
                    UtilLovTagItemList.arrLov.push(data);
                });
            } else {
                MessageUtil.Error("ERROR", xhr.getResponseHeader('errorMsg'));
            }
            UtilLovTagItemList.renderDataKeyword(json);

        }
    });
};

UtilLovTagItemList.searchByTagItem = function (tagItem) {
    $('#lbTitleModalTagItem').text(LB_TAG_NAME + tagItem)
    UtilLovTagItemList.queryData(tagItem);
}

UtilLovTagItemList.searchKeyword = function () {
    var input = $("input#" + modalTagItemId + "_search");
    var value = input.val().trim();
    console.log("value searchKeyword--->", value);
    UtilLovTagItemList.highlightWord(value);
}

UtilLovTagItemList.highlightWord = function (keyWord) {
    var keyWordSerch = keyWord.toLowerCase();
    //remove Highlight word Before Serch
    $.each($('.tagviewhilight'), function (k, v) {
        var txt = v.innerText;
        v.outerHTML = txt
    });

    if (keyWordSerch.length > 0) {
        $.each($('.tagviewserch'), function (k, v) {
            var old = $(v).text();
            if (old.toLowerCase().indexOf(keyWordSerch) >= 0) {
                old = old.substr(old.toLowerCase().indexOf(keyWordSerch), keyWordSerch.length);
                var re = new RegExp(keyWord, 'ig');
                v.innerHTML = v.innerHTML.replace(re, "<span class='tagviewhilight' style='font-weight:bold;background-color:#B2FF59;'>" + old + "</span>");
            }
        });
    }
}

UtilLovTagItemList.renderDataKeyword = function (data) {
    /*
    * Event Modal hide Show
    * */
    // if ($('#collapseTableTagItemsPointRem').hasClass('in') == false) {
    //     $('#iconcollapseTableTagItemsPointRem').removeClass('fa-caret-down');
    //     $('#iconcollapseTableTagItemsPointRem').addClass('fa-caret-up');
    //     $('#collapseTableTagItemsPointRem').collapse('show');
    //     $('#divTableTageItem').css('max-height', '30vh');
    //     $('#tagcollapseTableTagItemsPointRem').removeClass('collapsed');
    // }
    if ($('#collapseTableTagItemsPointRem').hasClass('in')) {
        $('#iconcollapseTableTagItemsPointRem').removeClass('fa-caret-up');
        $('#iconcollapseTableTagItemsPointRem').addClass('fa-caret-down');
        $('#collapseTableTagItemsPointRem').collapse('hide');
        $('#divTableTageItem').css('max-height', '55vh');
        $('#tagcollapseTableTagItemsPointRem').addClass('collapsed');
    } else {
        $('#collapseTableTagItemsPointRem').addClass('collapsed');
    }
    $modalTagItemId.on('shown.bs.modal', function () {
        $("#" + modalTagItemId + "_search").focus();
        $('#divTableTageItem').scrollTop(0);
        initAutoTab();
        initEventCalcPoint();
        $(".textAmount").on("keypress", function (e) {
            if ((e.which < 48 || e.which > 58) && e.which != 8 && e.which != 46) {
                return false;
            }
        });
    });
    /* $modalTagItemId.on('hidden.bs.modal', function () {
         initAutoTab();
         // $('.btn-add-item')[0].focus();
     });*/

    $table = $("#" + modalTagItemId + "Table");
    $table.unbind('appendCache applyWidgetId applyWidgets sorton update updateCell').removeClass('tablesorter')
        .find('thead th').unbind('click mousedown').removeClass('header headerSortDown headerSortUp');
    $table.find('thead th').find('span').css('display', 'none');

    $("#" + modalTagItemId + "_search").val('');
    if (!UtilLovTagItemList.isRenderModal) {
        UtilLovTagItemList.findPointActive();
        UtilLovTagItemList.findPharmacyByCustomerCode();

        // $('#rtTableTagItem').append('<th class="text-center" style="color:black;vertical-align: middle;" onclick="sortData(this)">' + LB_USE_DETAIL + '<span class="fa fa-caret-up" style="display:none;"><jsp:text/></span></th>');
        //Render pointsActive
        $.each(UtilLovTagItemList.pointsActive, function (key, value) {
            $('#rtTableTagItem').append("" +
                '<th value="' + key + '" class="text-center sortnumber" name="modalTablePoint" style="color:black;vertical-align: middle;"onclick="sortData(this)">' + value + '<span class="fa fa-caret-up" style="display:none;"><jsp:text/></span></th>'
            );
        });

        $('#rtTableTagItem').append('<th class="text-center nosort" style="color:black;vertical-align: middle;width: 9%">' + "ซื้อ" + '</th>');
        $.each(UtilLovTagItemList.pointsActive, function (key, value) {
            $('#rtTableTagItem').append("" +
                '<th value="' + key + '" class="text-center nosort" name="modalTablePoint" style="color:black;vertical-align: middle;width: 9%">' + "เบิก" + value + '</th>'
            );
        });
        //Render Pharmacy
        if (UtilLovTagItemList.pharmacy.length > 0) {
            $('#rtTableTagItem').append('<th class="text-center nosort" style="color:black;vertical-align: middle;width: 10%">' + "ร้านยา" + '</th>');
        }
        UtilLovTagItemList.isRenderModal = true;
        $("#modalTagItemListTable").tableHeadFixer();
    }


    $("#" + modalTagItemId + "TableBody").empty();
    if (data.length > 0) {
        $.each(data, function (index, item) {
            /*     Render HTML Tag Point      */
            var dataFunction = item.itemCode + "#" + item.itemName;
            var itemPoint = {};
            if (item.getSoItemListDetailViews.length > 0) {
                $.each(item.getSoItemListDetailViews, function (k, v) {
                    itemPoint[v.pointCode] = v.pointQty;
                })
            }
            var pointData = "";
            var tagInputPointData = "";
            /*     Render HTML Tag ซื้อ/เบิก      */
            $.each(UtilLovTagItemList.pointsActive, function (key, value) {
                var keySearch = key;
                if (itemPoint[keySearch] != undefined) {
                    pointData += '<td   class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas(itemPoint[keySearch]) + '</td>';
                    tagInputPointData += '<td><input maxlength="3" onkeydown="FormUtil.inputNumberOnly(event)" style="text-align: center" indexItem="' + index + '" pointType="' + key + '" class="form-control textAmount tagItem pointItem" type="text" ></td>'
                } else {
                    pointData += '<td   class="text-center" value="' + key + '" name="modalTablePoint" >' + numberWithCommas("0") + '</td>';
                    tagInputPointData += '<td><input  class="form-control" type="text" disabled="true"></td>'
                }
            });

            /*     Render HTML Tag Pharmacy      */
            var tagHtmlPharmacy = "";
            if (UtilLovTagItemList.pharmacy.length > 0) {
                var $tagSelect = "";
                $tagSelect += '<td class="text-center">';

                if (item.itemTypeWeb == 2) {
                    //Type 2 ร้านยา
                    $tagSelect += '<select  itemcode="' + item.itemCode + '"  class="form-control tagviewpharma">';
                    // $tagSelect += '<option value=""></option>';
                    $.each(UtilLovTagItemList.pharmacy, function (k, v) {
                        $tagSelect += '<option value="' + v.pharmacyCode + '">' + v.pharmacyName + '</option>';
                    });
                } else {
                    $tagSelect += '<select class="form-control" disabled=true>';
                }
                $tagSelect += '</select>';
                $tagSelect += '</td>';
                tagHtmlPharmacy = $tagSelect;
            }

            /*     Render Table      */
            // console.log(item);
            $("#" + modalTagItemId + "TableBody").append("" +
                '<tr>' +
                '<td  class="text-left tagviewserch" >' + CheckNull(item.itemName) + '</td>' + //ชื่อสินค้า
                '<td  class="text-left" >' + CheckNull(item.useDetail) + '</td>' +
                '<td  class="text-center tagviewserch" >' + CheckNull(item.itemCode) + '</td>' + //รหัส
                // '<td  class="text-left"  >' + CheckNull(item.itemSize) + '</td>' + //ขนาด
                '<td class="text-left" >' + numberWithCommas(item.priceList, 2) + '</td>' +
                pointData +
                '<td  class="text-left" >' +
                (parseFloat(item.priceList) > 0 ? '<input  maxlength="3" onkeydown="FormUtil.inputNumberOnly(event)" class="form-control textAmount tagItem" style="text-align: center" indexItem="' + index + '"  class="form-control " type="text">' : '<input class="form-control" disabled="true" type="text">') +
                '</td>' +
                tagInputPointData +
                tagHtmlPharmacy +
                '</tr>');

        });
        $('[name=modalTableListItem]').hide();
        $modalTagItemId.modal('show');

        var headers = {
            2: {sorter: 'sortNumber'},
            // 3: {sorter: 'sortNumber'},//ชนาด
        }
        $.each($('th.sortnumber'), function (key, value) {
            headers[value.cellIndex] = {sorter: 'sortNumber'};
        });
        $.each($('th.nosort'), function (key, value) {
            headers[value.cellIndex] = {sorter: false};
        });
        // console.log(headers);
        $table.tablesorter({
            headers: headers
        });

        $('.tagviewpharma').change(function () {
            if (!FormUtil.isEmpty($(this).val())) {
                $(this).popover('destroy');
            }
        });
    } else {
        $('[name=modalTableListItem]').show();
        $modalTagItemId.modal('show');
    }
    setCurrentPointBalance();
    tagView.updateRemanningPoint();
    UtilLovTagItemList.renderPointActive();

}

UtilLovTagItemList.renderPointActive = function () {
    $('[name=modalTablePoint]').each(function () {
        var pointCode = $(this).attr('value');
        if (UtilLovTagItemList.pointsActive[pointCode] != undefined) {
            $(this).show()
        } else {
            $(this).hide();
        }
    });
};
UtilLovTagItemList.findPointActive = function () {
    // idInput
    AjaxUtil.get('/points/findPointActive', '', false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                var result = xhr.responseJSON;
                $.each(result, function (key, value) {
                    UtilLovTagItemList.pointsActive[value.pointCode] = value.pointName
                });
            } else {
                console.log("Error findPointActive: ", xhr.getResponseHeader('errorMsg'));
            }
        }
    });
};

UtilLovTagItemList.pharmacy = [];
UtilLovTagItemList.findPharmacyByCustomerCode = function () {
    UtilLovTagItemList.pharmacy = [];
    var data = {
        customerCode: session.customer
    }
    AjaxUtil.get('/centrals/findPharmacyByCustomerCode', data, false).complete(function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.getResponseHeader('statusValidate') == 0) {
                UtilLovTagItemList.pharmacy = xhr.responseJSON;
            } else {
                console.log("Error {}", xhr.getResponseHeader('errorMsg'));
            }
        }
    });
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


/*
* @initEventCalcPoint
* for initial event on change of point then calculate table point
* */
var arrTempUse = {};

function initEventCalcPoint() {
    arrTempUse = {};
    $('.tagItem.pointItem').change(function (el) {
        var tempValue = 0; //value beforeChange;
        var index = parseInt($(this).attr('indexitem')); //value index in arrLov;
        var pointtype = $(this).attr('pointtype'); //01/02
        var itemData = UtilLovTagItemList.arrLov[index].points;
        var itemCode = UtilLovTagItemList.arrLov[index].itemCode;
        var qty = 0;
        $.each(itemData, function (key, value) {
            if (value.pointCode == pointtype) {
                qty = parseFloat(value.pointQty);
            }
        });
        var value = $(this).val(); //value Change
        value = value == "" ? 0 : parseFloat(value);
        //tranform qty -> point
        var valueToPoint = value * qty;
        var data = {
            itemCode: itemCode,
            pointType: pointtype,
            qty: value,
            totalPieces: valueToPoint
        };
        if (value == 0) {
            data = null;
        }
        arrTempUse[itemCode + "#" + pointtype] = data;
        UtilLovTagItemList.calculatePointOnChange(pointtype);
        tagView.updateRemanningPoint();


    });
    /*
      * Validate Amount / minOrder
      * */
    $('.tagItem').change(function (el) {
        setTimeout(function () {
            UtilLovTagItemList.validateMinOrder();
        }, 100);

    });
}

/**
 * @validateMinOrder
 * validate MinOrder for modal TagItemList
 */
UtilLovTagItemList.validateMinOrder = function (focus) {
    var resultValidate = true;
    var focusElement = [];
    $('.tagItem.textAmount').each(function (index, el) {
        var index = parseInt($(el).attr('indexitem')); //value index in arrLov;
        var minOrder = parseFloat(UtilLovTagItemList.arrLov[index].minOrder);
        // minOrder = 4;
        var value = $(el).val();
        value = value == "" ? 0 : parseFloat(value);
        $(el).popover('destroy');
        if (value > 0) {
            var divValue = parseFloat(value / minOrder) % 1;
            if (divValue != 0) {
                var message = MESSAGE.MS_PLS_BUY_MIN_ORDER.replace('{param}', minOrder);
                $(el).attr('data-content', message);
                $(el).attr('data-placement', 'bottom');
                $(el).popover('show');
                var element=$(el);
                focusElement.push(element);
                resultValidate = false;
            }
        }
    });
    if (focus && focusElement.length>0) {
        focusElement[0].focus();
    }
    return resultValidate;
}


UtilLovTagItemList.calculatePointOnChange = function (pointtype) {
    var pointtypeName = pointCodeToPointName(pointtype); //ส1/ส2
    var totalUse = 0;
    var tempItemCodeInDetail = {};
    $.each(dataOrderDetail, function (k, v) {
        if (v.pointType == pointtype) {
            if (arrTempUse[v.itemCode + "#" + pointtype]) {
                totalUse += arrTempUse[v.itemCode + "#" + pointtype].totalPieces;
            } else {
                totalUse += v.totalPieces;
            }
            tempItemCodeInDetail[v.itemCode] = "x";
        }
    });
    $.each(arrTempUse, function (k, v) {
        if (v && v.pointType == pointtype) {
            if (!tempItemCodeInDetail[v.itemCode]) {
                totalUse += v.totalPieces;
            }
        }
    });
    //update Point
    var remaining = parseFloat(copiedObjectCurrentPoint[pointtypeName].remaining);
    copiedObjectCurrentPoint[pointtypeName].use = totalUse;
    copiedObjectCurrentPoint[pointtypeName].balance = remaining - totalUse;
}
