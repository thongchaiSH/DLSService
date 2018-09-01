//---------------------------------------------     VALIABLE ---------------------------------------------
$toggleTag = $("a[name=toggle]");
//---------------------------------------------     INITIAL  ---------------------------------------------
$(document).ready(function () {
    //init component
    $("#money").autoNumeric('init');//1,234.22
    $('#txtAmount').autoNumeric('init', {mDec: '0', vMin: '0', vMax: '9999999', lZero: 'deny'}); //number only 9,999,999
    // autoNumeric http://www.decorplanit.com/plugin/
    //and get value
    $('#txtAmount').autoNumeric('get');

    $("table").tablesorter({
        // pass the headers argument and assing a object
        headers: {
            // sort วันที่
            0: {
                sorter: 'dateFormat'
            },
            //ไม่ sort
            4: {
                // disable it by setting the property sorter to false
                sorter: false
            },
        }
    });

    //initial form
    arrayIdForFormDataChangeValidation = getIdFromComponentForFormDataChangeValidation();
    mapForFormDataChangeValidation = setDataForFormDataChangeValidation(arrayIdForFormDataChangeValidation);
});

//--------------------------------------------- BUTTON EVENT ---------------------------------------------
//not first zero
$('.textAmount').on('change', function () {
    var str = $(this).val();
    $(this).val(str.replace(/^0+/, ''));
});

$('#btnBack').click(function () {
    startBackEventForFormDataChangeValidation("/news/findNews");
});
$('#btnSave').click(function () {
    // check form change ?
    var statusEvent = startSubmitEventForFormDataChangeValidation();
    if (statusEvent == "pass") {
        alert("Start Ajax ")
    }
});
$('#imagePreview').click(function () {
    previewImage(this);
});
// toggle span_up/span_down
$toggleTag.click(function () {
    $iconCollapseAlert = $(this).find("span");
    var checkIcon = $iconCollapseAlert.hasClass('fa-caret-down');
    console.log(checkIcon)
    if (checkIcon == true) {
        $iconCollapseAlert.removeClass('fa-caret-down');
        $iconCollapseAlert.addClass('fa-caret-up');
    } else {
        $iconCollapseAlert.removeClass('fa-caret-up');
        $iconCollapseAlert.addClass('fa-caret-down');
    }
});

//---------------------------------------------     FUNCTION ---------------------------------------------
function previewImage(src) {
    $('#imageModal').attr('src', src.src);
    $('#myModalImage').modal('show');
    /*how to use
    *
    * img onclick='previewImage(this)' style="cursor: pointer" src......
    *
    * */
}

function getReturnDataByDocNumber(returnNumber) {

    var result = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/returnItems/findReturnItemByReturnNumber',
        data: {
            returnNumber: returnNumber
        },
        complete: function (xhr) {
            if (xhr.readyState == 4) {
                if (xhr.getResponseHeader('statusValidate') == 0) {
                    result = xhr.responseJSON;
                } else {
                    console.log("Error getReturnIdByDocNumber: ", xhr.getResponseHeader('errorMsg'));
                }
            }
        },
        async: false
    }).responseJSON;

    return result;
}

function getAdjustRewardPointsById(id) {
    $('.dv-background').show();
    var result = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/adjustRewardPoints/findAdjustRewardPointsById',
        data: {
            id: id
        },
        complete: function (xhr) {
            if (xhr.readyState == 4) {
                if (xhr.getResponseHeader('statusValidate') == 0) {
                    // console.log(xhr.responseJSON)
                } else {
                    MessageUtil.Error("Error", xhr.getResponseHeader('errorMsg'));
                }
            }
            $('.dv-background').hide();
        },
        async: false
    }).responseJSON;
    return result;
}

//---------------------------------------------  FUNCTION UTIL ---------------------------------------------
function renderData(data) {
    $dataGrid.empty();
    $("table").unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
        .removeClass('tablesorter')
        .find('thead th')
        .unbind('click mousedown')
        .removeClass('header headerSortDown headerSortUp');
    if (data.length > 0) {
        $.each(data, function (index, item) {


        });
        $("table").tablesorter();
        $('#noItemDrugItems').hide();
    } else {
        $('#noItemDrugItems').show();
        MessageUtil.Ok('ไม่พบข้อมูล', 'warning');
    }
}

function sortData(th) {
    var orderBy = $(th).attr("id");
    var flagOrder;

    $("th span").hide();

    var $icon = $(th).find("span");

    $icon.show();
    if ($icon.hasClass('fa-caret-up') == true) {
        $icon.removeClass('fa-caret-up');
        $icon.addClass('fa-caret-down');
    } else {
        $icon.addClass('fa-caret-up');
        $icon.removeClass('fa-caret-down');
    }


    if ($(th).hasClass("desc") == true) {
        $(th).removeClass("desc");
        $(th).addClass("asc");

    } else {
        $(th).removeClass("asc");
        $(th).addClass("desc");
    }

    var sortBy = $(th).hasClass("desc") == true ? "desc" : "asc";

    //Ajax loadtable and function Render Data
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function getObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
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

//  get File_Name for type file
function getFileName(fullPath) {
    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    var filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }
    return filename;
}

function numberWithCommas(number) {
    number = CheckNull(number) + "";
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

