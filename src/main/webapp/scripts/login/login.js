$(window).load(function () {
    $('head').append(' <link type="image/png"  rel="shortcut icon" href="/MMC/resources/images/faviconPage.ico" />');
});


$(document).ready(function () {
    if (document.URL.indexOf('error') > 0) {
        $('#msg').html('Username หรือ Password ไม่ถูกต้อง')
    } else {
        $('#msg').html('')
    }

    $("#username").css("text-transform", "lowercase");

    $("#username").keyup(function () {
        $("#username").val($("#username").val().toLowerCase());
    });

    $("#username").blur(function () {
        $("#username").val($("#username").val().toLowerCase());
    });
// Config Date Month Year //
    var MonthsTH = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
        "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
        "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    var DaysTH = [
        "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี",
        "ศุกร์", "เสาร์"];
    var MonthsEN = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"];
    var DaysEN = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday"];

    var date = _currentDate.getDate();
    var day = _currentDate.getDay();
    var month = _currentDate.getMonth();
    var year = _currentDate.getFullYear();
    var minutes = _currentDate.getMinutes();
    var hour = _currentDate.getHours();
    var millisecond = _currentDate.getMilliseconds();


// Show Description Date //
    var lang = "TH";
    switch (lang) {
        case 'TH':
            $("h4[id=nowDate]").text("วัน" + DaysTH[day] + " " + date + " " + MonthsTH[month] + " " + (year + 543));
            break;
        case 'EN':
            $("h4[id=nowDate]").text(DaysEN[day] + " " + date + " " + MonthsEN[month] + " " + year);
            break;
        default :
            $("h4[id=nowDate]").text(DaysEN[day] + " " + date + " " + MonthsEN[month] + " " + year);
            break;
    }

    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    function startTime() {
        _currentDate.setSeconds(_currentDate.getSeconds() + 1);
        // console.log(_currentDate);
        var today = _currentDate,
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
        var timeNow = "เวลา " + h + ":" + m;
        $('#timeNow').text(timeNow);
        // console.log(timeNow);
        t = setTimeout(function () {
            startTime()
        }, 1000);
    }

    startTime();

});


function openForgotPassword() {
    $('#f_email').val('');
    $('.login_control_form').hide();
    $('.forgotpassword_control').show();
}

function openLoginForm() {
    // $('#j_username').val('');
    $('#j_password').val('');
    $('.forgotpassword_control').hide();
    $('.login_control_form').show();
}


function resetPassword() {
    var email = $('#f_email').val().trim();
    if (email.length > 0) {
        if (isEmail(email)) {
            $('#f_email').popover('destroy');
            var status = updatePasswordByEmail(email);
            console.log(status);
        } else {
            // alert();
            MessageUtil.Ok(Message.eMailWrongFormat, 'warning');
        }

    } else {
        $('#f_email').popover().click();
    }
}

function updatePasswordByEmail(email) {
    $('.dv-background').show();
    var result = ""
    $.ajax({
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "json",
        headers: {
            Accept: "application/json"
        },
        url: '/MMC/customerUsers/updatePasswordEmail?email=' + email,
        complete: function (xhr) {
            $('.dv-background').hide();
            if (xhr.readyState == 4) {
                if (xhr.getResponseHeader('statusValidate') == 0) {
                    result = xhr.responseJSON;
                } else {
                    result = xhr.getResponseHeader('errorMsg');
                }
                modalMessageUpdatePassWord(result);
            }
        },
        // async: false
    });

    return result;

}

function modalMessageUpdatePassWord(status) {
    console.log('modalMessageUpdatePassWord', status);
    if (status == "success") {
        var email = $('#f_email').val().trim();
        var messageOutput = Message.eCheckEmail.replace('{param}', email);
        // alert(messageOutput);
        MessageUtil.Ok(messageOutput, 'success', openLoginForm());
    } else if (status == "ERR01") {
        var email = $('#f_email').val().trim();
        var messageOutput = Message.ERR01.replace('{param}', email);
        // alert(messageOutput);
        MessageUtil.Ok(messageOutput, 'warning');
    } else {
        MessageUtil.Ok(status, 'warning');
        // alert(status);
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}