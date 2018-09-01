var MessageUtil = {};
//type is warning,success
// swal.close() is force close
// $('.sweet-overlay,.sweet-alert ').hide();
MessageUtil.Ok = function (title, type, callBackFunction) {
    swal({
            title: title,
            type: type,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
        },
        function () {
            if (isFunction(callBackFunction)) {
                callBackFunction();
            }
        });
}
MessageUtil.OkAndText = function (title, text, type, callBackFunction) {
    swal({
            title: title,
            text: text,
            type: type,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
        },
        function () {
            if (isFunction(callBackFunction)) {
                callBackFunction();
            }
        });
}
MessageUtil.OkYesNo = function (title, type, funcCallBackOk, funcCallBackCanCel) {
    swal({
            title: title,
            type: type,
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: !isFunction(funcCallBackOk),
            closeOnCancel: !isFunction(funcCallBackCanCel),
            cancelButtonColor: '#3085d6',
        },
        function (isConfirm) {
            if (isConfirm) {
                if (isFunction(funcCallBackOk)) {
                    funcCallBackOk();
                }
            } else {
                if (isFunction(funcCallBackCanCel)) {
                    funcCallBackCanCel();
                }
            }
        });
}
MessageUtil.OkYesNoAndText = function (title,text, type, funcCallBackOk, funcCallBackCanCel) {
    swal({
            title: title,
            text: text,
            type: type,
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: !isFunction(funcCallBackOk),
            closeOnCancel: !isFunction(funcCallBackCanCel),
            cancelButtonColor: '#3085d6',
        },
        function (isConfirm) {
            if (isConfirm) {
                if (isFunction(funcCallBackOk)) {
                    funcCallBackOk();
                }
            } else {
                if (isFunction(funcCallBackCanCel)) {
                    funcCallBackCanCel();
                }
            }
        });
}

MessageUtil.Error = function (errorTitile, errorMsg) {
    // swal("Delete Unsuccessfully", xhr.getResponseHeader('errorMsg'), "error")
    // swal(initialMessage.MESSAGE_ERROR, errorMsg, "error")
    MessageUtil.OkAndText(initialMessage.MESSAGE_ERROR,errorMsg,'error');
}


function isFunction(functionToCheck) {
    if (typeof functionToCheck === "function") {
        return true;
    }
    return false;
}
