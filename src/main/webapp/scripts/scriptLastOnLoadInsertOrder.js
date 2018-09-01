/**
 * On page ready function
 */
var inputs;
var inputsModal;

// $(document).on({
//     ajaxStart: function () {
//         $('.dv-background').show();
//     },
//     ajaxStop: function () {
//         $('.dv-background').hide();
//     }
// });

$(document).ready(function () {
    console.log('scriptLastOnLoad----Ready')
    inputs = $('input,select,button,textarea,a').not(".close,.xdsoft_next,.xdsoft_prev,.ignore_tab").keypress(function (e) {
        if (e.which == 13) {
            console.log('====== Enter Key ========');
            onwheelFunction();
            e.preventDefault();
            var nextInput
            if (e.currentTarget.id == 'lovSearchItemModal') {
                // $("#lovSearchItemModal").focusout();
            }
            focusNextElement(this);
        }
    });

    $('body').keypress(function (e) {
        if (e.which == 13) {
            // console.log('body-->Keypress');
            // if (checkTypeEnter == 1) {
            //     $("#lovSearchItemModal").focus();
            //     $("#lovSearchItemModal").click();
            //     checkTypeEnter = 0;
            // } else {
            var btnConfirm = $('#btnConfirm').prop('disabled');
            if (btnConfirm) {

            } else {
                if ($('#dataGridFavoriteItems').find('select').not('[disabled]').length > 0) {
                    $($('#dataGridFavoriteItems').find('select').not('[disabled]')[0]).focus();
                }
                else if ($('#dataGridTopChartItems').find('select').not('[disabled]').length > 0) {
                    $($('#dataGridTopChartItems').find('select').not('[disabled]')[0]).focus();
                } else {
                    console.log('else')
                }
            }
            // }
            if ($('.showSweetAlert').hasClass('visible')) {
                $($('.confirm')[0]).focus();
                $($('.confirm')[0]).click();
            }

        }
    });
    setTimeout(function () {
        $('[tabindex="1"]').focus()
    }, 100);

    if ($('#btnConfirm').prop('disabled')) {
        $('#btnAdd').focus();
    }

    if (dataHeader.documentStatus == "W" || dataHeader.documentStatus == "A") {
        $('.btnTagItem').each(function (k, v) {
            $(v).removeAttr('onclick');
            $(v).css('cursor', '');
        });
    }

});

function focusNextElement(ele) {
    for (var i = inputs.index(ele) + 1; i < inputs.length; i++) {
        nextInput = inputs.get(i);
        nextInput = $(nextInput);

        var isDisabled = nextInput.prop('disabled') == true ? 1 : 0;
        var isToggle = nextInput.attr('name') == "toggle" ? 1 : 0;
        var isToggleTab = nextInput.attr('data-toggle') == "tab" ? 1 : 0;
        var isNotDisplay = nextInput.css('display') == "none" ? 1 : 0;
        var isVisabled = nextInput.is(':visible') == true ? 1 : 0;
        var isTypeHiden = nextInput.attr('type') == "hidden" ? 1 : 0;
        var isBtnPicture = nextInput.text() == "รูป" ? 1 : 0;
        var isBtnDelete = nextInput.hasClass('btn-danger') == true ? 1 : 0;
        // var isBtnAdd = nextInput.text().trim() == "เพิ่ม" ? 1 : 0;

        // console.log(nextInput, isDisabled, isToggle, isNotDisplay);
        if (isDisabled == 1 || isVisabled == 0 || isToggle == 1 ||
            isToggleTab == 1 || isNotDisplay == 1 || isTypeHiden == 1
            // || isBtnAdd == 1
            || isBtnPicture == 1 || isBtnDelete == 1
        ) {
            // nextInput = inputs.get(inputs.index(nextInput) + 1);
        }
        else {
            break;
        }
    }
    console.log('from--->')
    // console.log(this)
    console.log('To----->')
    console.log(nextInput)
    if (nextInput) {
        nextInput.focus();
        var type = $(nextInput).attr("type");
        var tagName = $(nextInput).prop('tagName');
        var id = $(nextInput).attr("id");

        if (!FormUtil.validateFormByElementsFunction($("#modalAddItem").find("[validate=true]"))) {
            return false;
        }
        UtilLovItemList.arrLov = [];
        if ($('#modalAddItemMessageText').is(':visible') && $('#modalAddItemMessageText').text() == LABEL.LB_NOT_HAVE_IN_STOCK) //case stock 0
        {
            //ถ้ามี hilight show
            $('#lovSearchItemModal').click();
            $('#lovSearchItemModal').focus();
            $('#lovSearchItemModal').select();
            return false;
        }
        if (addItemUil.validateMinOrder(ele) == false) {
            return false;
        }
        if (tagName == "BUTTON") {

            if (id == "btnAddItem" || id == "btnSaveItemList") {
                if (id == "btnAddItem") {
                    nextInput.click();
                }
                $('#lovSearchItemModal').val('');
                $('#lovSearchItemModal').focus();
                $('#lovSearchItemModal').click();
                // $('#lovSearchItemModal').focusout();

            } else {
                nextInput.click();
            }
        } else if (tagName == "SELECT") {
            $(nextInput).attr('size', 20);
            $(nextInput).focusout(function () {
                $(nextInput).attr('size', 0);
            })
        } else if (tagName == "INPUT") {
            if ($(nextInput).hasClass("textAmount")) {
                $(nextInput).select();
            }
        }

    }
}

function initAutoTab() {
    // onwheelFunction();
    $('#modalTagItemList').find('input,select,button,textarea').not(".close,.xdsoft_next,.xdsoft_prev").unbind("keypress");
    inputsModal = $('#modalTagItemList').find('input,select,button,textarea').not(".close,.xdsoft_next,.xdsoft_prev").keypress(function (e) {
        if (e.which == 13) {
            // onwheelFunction();
            console.log('initAutoTab');
            e.preventDefault();
            var nextInput;
            if (e.currentTarget.id == 'modalTagItemList_search') {
                UtilLovTagItemList.searchKeyword();
                if ($('input.textAmount.tagItem').length > 0) {
                    $('input.textAmount.tagItem')[0].focus();
                }
            }
            // else if (e.currentTarget.id == 'modalTableTagListItemAdd') {
            //     if (UtilLovTagItemList.validateMinOrder(true) == false) {
            //         return false;
            //     }
            // }

            for (var i = inputsModal.index(this) + 1; i < inputsModal.length; i++) {
                nextInput = inputsModal.get(i);
                nextInput = $(nextInput);

                var isDisabled = nextInput.prop('disabled') == true ? 1 : 0;
                var isToggle = nextInput.attr('name') == "toggle" ? 1 : 0;
                var isToggleTab = nextInput.attr('data-toggle') == "tab" ? 1 : 0;
                var isNotDisplay = nextInput.css('display') == "none" ? 1 : 0;
                var isVisabled = nextInput.is(':visible') == true ? 1 : 0;
                var isTypeHiden = nextInput.attr('type') == "hidden" ? 1 : 0;
                var isBtnPicture = nextInput.text() == "รูป" ? 1 : 0;
                var isBtnAdd = nextInput.text().trim() == "เพิ่ม" ? 1 : 0;

                // console.log(nextInput, isDisabled, isToggle, isNotDisplay);
                if (isDisabled == 1 || isVisabled == 0 || isToggle == 1 || isToggleTab == 1 || isNotDisplay == 1 || isTypeHiden == 1 || isBtnPicture == 1 || isBtnAdd == 1) {
                    // nextInput = inputs.get(inputs.index(nextInput) + 1);
                }
                else {
                    break;
                }
            }
            /*            console.log('from--->')
                        console.log(this)
                        console.log('To----->')
                        console.log(nextInput)*/
            if (nextInput) {
                nextInput.focus();
                var type = $(nextInput).attr("type");
                var tagName = $(nextInput).prop('tagName');
                if (type == "button") {

                    nextInput.click();
                } else if (tagName == "SELECT") {
                    $(nextInput).attr('size', 20);
                    $(nextInput).focusout(function () {
                        $(nextInput).attr('size', 0);
                    })
                }

            }
        }
    })
}

