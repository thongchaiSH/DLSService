/**
 * On page ready function
 */
$(document).ready(function () {

    // When Focus Element Popover Destroy
    $('*').focus(function () {
        $(this).popover('destroy');
    });

});

/**
 * ## Ajax Pattern ##########################################################################################
 */

/**
 * Ajax Pattern
 * Merge defaults and options, without modifying defaults
 * @default {POST} type
 */
var ajaxPattern = {
    type: 'POST',
    url: '',
//    statusCode: {
//        200: function () {
//            console.log('HttpStatus.OK');
//        },
//        204: function () {
//            console.log('HttpStatus.NO_CONTENT');
//        },
//        401: function () {
//            console.log('HttpStatus.UNAUTHORIZED');
//        },
//        403: function () {
//            console.log('HttpStatus.FORBIDDEN');
//        },
//        404: function () {
//            console.log('HttpStatus.NOT_FOUND');
//        },
//        500: function () {
//            console.log('HttpStatus.INTERNAL_SERVER_ERROR');
//        }
//    },
    async: false,
    data: '',
    beforeSend: function () {
        $('.dv-background').show();
    },
    complete: function () {
        $('.dv-background').hide();
    }
};

/**
 * ## General Function ######################################################################################
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

/**
 * Get parameter value from URL
 * @param {String} param
 * @returns {String} commonGetParameterValueFromUrlByName
 */
function commonGetParameterValueFromUrlByName(param) {
    param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * String Padding (default padding 0)
 * @param {String, Number} str
 * @param {Number} width
 * @param {String} pad
 * @returns {String} commonStringPadding
 * @examples
 *  commonStringPadding(10, 4);      // 0010
 *  commonStringPadding(9, 4);       // 0009
 *  commonStringPadding(123, 4);     // 0123
 *  commonStringPadding(10, 4, '-'); // --10
 */
function commonStringPadding(str, width, pad) {
    pad = pad || '0';
    str = str + '';
    return str.length >= width ? str : new Array(width - str.length + 1).join(pad) + str;
}

/**
 * Redirect page to specify url
 * @param {String} url
 * @returns {Page} commonRedirectPageToUrl
 */
function commonRedirectPageToUrl(url) {
    window.location.replace(url);
}

/**
 * Redirect page to specify language
 * @param {String} language
 * @returns {Page} commonChangeLanguage
 */
function commonChangeLanguage(language) {
    var url = window.location.href;
    if (url.indexOf("lang=") >= 0) {
        var prefix = url.substring(0, url.indexOf("lang"));
        var suffix = url.substring(url.indexOf("lang")).substring(url.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + "lang=" + language + suffix;
    } else {
        if (url.indexOf("?") < 0)
            url += "?" + "lang=" + language;
        else
            url += "&" + "lang=" + language;
    }
    window.location.href = url;
}


function commonConvertTimeToDateFormat(minutes) {
    var result = minutes != null ? minutes : '0';
    var day = result.toString().split('.')[0] != null ? result.toString().split('.')[0] : 0;
    var hour = result.toString().split('.')[1] != null ? result.toString().split('.')[1] : 0;
    return day.toString().padding(2) + ':' + hour.toString().padding(2);
}


function commonGetDateDiffInDays(a, b) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


/**
 * Validate number field
 * @param e
 * @returns {boolean}
 */
function commonValidateNumber(e) {
    var patternCharacter = /^[a-zA-Z]*$/;                                           // character
    var patternSpecialCharacter = /^[!@#$%^&*()_=+{}\\|;:'"<,.>/`~?\[\]-]$/;        // special character
    var keyChar = String.fromCharCode(e.which);
    return !patternCharacter.test(keyChar) && !patternSpecialCharacter.test(keyChar);
}

/**
 * Validate PID (ตรวจสอบหมายเลขบัตรประชาชน)
 * @param pid
 * @returns {boolean}
 */
function validatePID(pid) {
    pid = pid.toString().replace(/\D/g, '');
    if (pid.length == 13) {
        var sum = 0;
        for (var i = 0; i < pid.length - 1; i++) {
            sum += Number(pid.charAt(i)) * (pid.length - i);
        }
        var last_digit = (11 - sum % 11) % 10;
        return pid.charAt(12) == last_digit;
    } else {
        return false;
    }
}

/**
 * Get number days in a specified month
 * @param year
 * @param month
 * @returns {number}
 */
function getDayInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * ## Method Function #######################################################################################
 */

/**
 * Remove class "sr-only" and fade in element
 * @param {Number} time
 */
$.fn.commonShowElement = function (time) {
    if (typeof time !== "undefined") {
        time = 1000
    }
    this.each(function () {
        $(this).hide().removeClass("sr-only").fadeIn(time);
    });
};

/**
 * Add class "sr-only" and fade out element
 * @param {Number} time
 */
$.fn.commonHideElement = function (time) {
    if (typeof time !== "undefined") {
        time = 1000
    }
    this.each(function () {
        $(this).show().fadeOut(time, function () {
            $(this).addClass("sr-only")
        });
    });
};

/**
 * Render Full Calendar
 * @param {String} lang
 * @param {Number} height
 * @param {Boolean} detail
 */
$.fn.commonRenderCalendar = function (lang, height, detail) {
    if (lang == 'TH') {
        $(this).fullCalendar({
            height: height,
            buttonText: {
                today: "วันนี้"
            },
            monthNames: [
                "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
                "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
                "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
            ],
            dayNamesShort: [
                "อา.", "จ.", "อ.", "พ.",
                "พฤ.", "ศ.", "ส."
            ]
        });

    } else {
        $(this).fullCalendar({
            height: height
        });
    }

    if (detail) {
        var str = '<div style="text-align: right;">' +
            '<span class="label label-info">Today</span>' +
            '<span>&#160;|&#160;</span>' +
            '<span class="label label-success">Success</span>' +
            '<span>&#160;|&#160;</span>' +
            '<span class="label label-danger">Danger</span>' +
            '<span>&#160;|&#160;</span>' +
            '<span class="label label-warning">Warning</span>' +
            '</div>';
        $(this).append(str);
    }
};

/**
 * Render Google Map
 * @param {Double} latitude
 * @param {Double} longitudes
 * @param {Number} zoom
 * @param {String} title
 */
$.fn.commonRenderGoogleMap = function (latitude, longitudes, zoom, title) {
    this.each(function () {
        var myLocation = new google.maps.LatLng(latitude, longitudes);
        var mapOptions = {
            center: myLocation,
            zoom: zoom
        };
        var marker = new google.maps.Marker({
            position: myLocation,
            title: title
        });
        var map = new google.maps.Map(this, mapOptions);
        marker.setMap(map);
    });
};

/**
 * Render Employee Subordinate
 * @deprecated
 * @returns {List} commonRenderSubordinate
 */
$.fn.commonRenderSubordinate = function () {
    var input = $(this).parent().parent().children('input[type=text]');
    var fList = [];
    var url = encodeURI(session['context'] + '/common/json/subordinate?search=' + (input.val() == '' ? '%' : input.val()));

    $.ajax({
        url: url,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            if (data != '') {
                $.each(data, function (key, value) {
                    var empData = {
                        id: value.id,
                        value: value.id + ' - ' + value.nameThai,
                        label: value.id + ' - ' + value.nameThai
                    };
                    fList.push(empData);
                });
            } else {
                bootbox.dialog({
                    message: i18n['message_global_employee_not_found'],
                    title: title['information'],
                    closeButton: false,
                    buttons: {
                        main: {
                            label: "Close",
                            className: "btn-primary"
                        }
                    }
                });
            }
        },
        error: function () {
            alert('Time out, please contact admin');
        }
    });

    input.autocomplete({
        source: fList,
        minLength: 1000,
        close: function (event, ui) {
            input.autocomplete("option", "minLength", 1000);
        }
    });
    input.autocomplete("option", "minLength", 0);
    input.autocomplete("search", $(this).val());
};

/**
 * Generate Password
 * @param {String} prefix
 * @param {String} postfix
 * @param {Number} width
 * @returns {String}
 */
$.fn.commonGeneratePassword = function (prefix, postfix, width) {
    this.each(function () {
        var field = $(this).parent().parent().children('input[type=text]');
        var min = 0;
        var max = new Array(width + 1).join('9');
        var pass = prefix + commonStringPadding(Math.floor((Math.random() * max) + min), width, '0') + postfix;
        field.val(pass);
    });
};
/**
 * Add Days
 * @param {Number} days
 * @returns {Date}
 */
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
/**
 * Ex. 10.pad(4, '-'); // --10
 * @param width
 * @param pad
 * @returns {string}
 */
String.prototype.padding = function (width, pad) {
    pad = pad || '0';
    var num = this + '';
    return num.length >= width ? num : new Array(width - num.length + 1).join(pad) + num;
};
Array.prototype.clear = function () {
    this.length = 0;
    return this;
};

/**
 * Convert string to date object
 * @examples
 *  "15/01/2014 08:30".toDate();      // Wed Jan 15 2014 08:30:00 GMT+0700 (SE Asia Standard Time)
 *  "01/12/2014 12:00".toDate();      // Mon Dec 01 2014 12:00:00 GMT+0700 (SE Asia Standard Time)
 * @returns {Date}
 */
String.prototype.toDate = function () {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})\s(\d{2})/;
    return new Date(this.replace(pattern, '$3-$2-$1T$4'));
};

/**
 * Convert time format to minute
 * @examples
 *  "08:30".toMinute();      // 510 ((8*60)+30)
 *  "12:00".toMinute();      // 720 ((12*60)+0)
 * @returns {Number}
 */
String.prototype.toMinute = function () {
    var hour = this.split(':')[0];
    var minute = this.split(':')[1];
    return (parseInt(hour) * 60) + parseInt(minute);
};

/**
 * Capitalize the first letter of string
 * @examples
 *  "string".capitalize();  // String
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

/**
 * Convert minute to time format
 * @examples
 *  "510".toTimeFormat();      // 08:30 ((8*60)+30)
 *  "720".toTimeFormat();      // 12:00 ((12*60)+0)
 * @returns {String}
 */
Number.prototype.toTimeFormat = function () {
    var hour = Math.floor(this != null ? (this / 60) : '0');
    if (hour >= 24) hour -= 24;
    var minute = Math.floor(this != null ? (this % 60) : '0');
    return hour.toString().padding(2) + ':' + minute.toString().padding(2);
};

function findDefaultDeuDate(requestType, $component) {
    $.post(
        session['context'] + '/requesttype/findByCode',
        {
            code: requestType
        },
        function (returnedData) {
            console.info("returnedDatareturnedData == >" + returnedData);
            var defaultDeuDate = returnedData.defaultDueDays;
            $component.val(new Date(session.date).addDays(defaultDeuDate).format('dd/mm/yyyy'));
        }
    );
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

/*
* Set up ajax header for CSRF Protect
*/

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (settings.type == 'POST' || settings.type == 'PUT' || settings.type == 'DELETE') {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader('X-CSRF-TOKEN', $('[name=_csrf]').attr('content'));
            }
        }
    }
});

function replaceEmpty(v) {
    return (v == undefined || v == null || v == "null") ? "" : v;
}

var uri;

function printTableReport(value) {

    console.log(value);
    // var ddlType = $(value).attr('data-select');
    var ddlType = "ddlTablePrintReport";
    var table = $(value).attr('table');
    var reportName = $(value).attr('reportName');
    var typeExport = $("#" + ddlType).val();
    var element = $("#" + table);

    reportName = "MMC";

    var rows = $("#" + table + " tr").length - 1; //get rows count
    if (rows == 0) {
        MessageUtil.Ok(initialMessage.MS_NOT_FOUND_DATA_PRINT, 'warning');
        return false;
    }
    //filter data
    var $node = element;
    $node.find(':hidden').addClass('markedForRemoval');
    $node.find('[export=none]').addClass('markedForRemoval');
    // $node.find('a').addClass('markedForRemoval');
    var $clone = $node.clone();
    $clone.find('.markedForRemoval').remove();
    $clone.find('.markedForRemoval').removeClass('markedForRemoval');
    $node.find('.markedForRemoval').removeClass('markedForRemoval');
    // $clone.find('th').css('font-weight','bold');ตัวหนา
    $clone.find('th').prop("style", "background:#D9EDF6 !important;color:black;vertical-align: middle;");
    var colCount = 0;
    var clone2 = $clone.clone().attr('id', 'table-exportPDF').after($clone);
    $('#divExportReport').empty();
    $("<div/>").attr('id', 'divExportReport').appendTo('body');
    $('#divExportReport').append(clone2);

    //Custom for search reward points history (รายงานแต้มสมนาคุณ)
    if(window.location.pathname.split("/")[3] == "findSearchRewardPointsHistory"){
        $('#table-exportPDF').find('tbody tr:nth-child(1) td').each(function () {
            colCount++;
        });
        if(CheckNull($('#autoCustomer').attr('data-id'))!=""){
            $('#table-exportPDF').find('thead').prepend(
                '<tr >' +
                '<th style="background:white;border-color:white;color:black;" colspan="'+colCount+'">'
                +$('#autoCustomer').val()+
                '</th>' +
                '</tr>'
            );
        }
    };

    $('#divExportReport').show();
    if (typeExport == 'print') {
        $('#divExportReport').printThis();
        setTimeout(function () {
            $('#divExportReport').hide();
        }, 1000);
    } else if (typeExport == 'excel') {

        uri = clone2.excelexportjs({
            containerid: clone2
            , datatype: 'table'
            , returnUri: true
        });

        var link = document.createElement('a');
        // Add the element to the DOM
        document.body.appendChild(link);
        link.setAttribute("type", "hidden"); // make it hidden if needed
        link.download = reportName + '.xls';
        link.href = uri;
        link.click();
        $('#divExportReport').hide();

    } else if (typeExport == "pdf") {
        kendo.drawing
            .drawDOM("#table-exportPDF",
                {
                    landscape: true,
                    paperSize: "A4",
                    margin: {top: "0.5cm", bottom: "1cm", left: "1cm", right: "1cm"},
                    scale: 0.4,
                    height: 700,
                    keepTogether: ".prevent-split"
                })
            .then(function (group) {
                kendo.drawing.pdf.saveAs(group, reportName + ".pdf")
                $('#divExportReport').hide();
            });
    }
}

var isEnter = false;
$(document).ready(function () {
    $('body').on('keydown', 'input, select, textarea ,button,a', function (e) {
        var self = $(this)
            , form = self.parents('form:eq(0)')
            , focusable
            , next
        ;
        if (e.keyCode == 9) {
            console.log('tab')
            focusable = $('input,select,button,textarea,a').filter(':visible').not(':disabled,[name="toggle"]');
            focusable = focusable.not($("#map").find("a"));

            next = focusable.eq(focusable.index(this) + 1);
            if (next.length) {
                next.focus();
            }
            return false;
        } else if (e.keyCode == 13) {
            //console.log('enter')
            if (e.target.type == "checkbox") {
                e.target.click();
            }
        }
    });

})


var CommonDataOfCustomer = {};
CommonDataOfCustomer.dataFromBaseToAddress = function (data, typeAddress) {
    var mapData = {};
    if (typeAddress == "add") {
        mapData = {
            'เลขที่': replaceEmpty(data.addNumber),
            'หมู่': replaceEmpty(data.addMoo),
            'อาคาร': replaceEmpty(data.addBuilding),
            'ซอย/ตรอก': replaceEmpty(data.addSoi),
            'ถนน': replaceEmpty(data.addRoad),
            'แขวง/ตำบล': replaceEmpty(data.addTumbon),
            'เขต/อำเภอ': replaceEmpty(data.addAmphurName),
            'จังหวัด': replaceEmpty(data.provinceName),
            'ไปรษณีย์': replaceEmpty(data.postalCode),
            'ประเทศ': replaceEmpty(data.countryName)
        }
    } else if (typeAddress == "delv") {
        mapData = {
            'เลขที่': replaceEmpty(data.delvNumber),
            'หมู่': replaceEmpty(data.delvMoo),
            'อาคาร': replaceEmpty(data.delvBuilding),
            'ซอย/ตรอก': replaceEmpty(data.delvSoi),
            'ถนน': replaceEmpty(data.delvRoad),
            'แขวง/ตำบล': replaceEmpty(data.delvTumbon),
            'เขต/อำเภอ': replaceEmpty(data.delvAmphurName),
            'จังหวัด': replaceEmpty(data.delvProvinceName),
            'ไปรษณีย์': replaceEmpty(data.delvPostalCode),
            'ประเทศ': replaceEmpty(data.delvCountryName)
        }
    } else if (typeAddress == "iv") {
        mapData = {
            'เลขที่': replaceEmpty(data.ivNumber),
            'หมู่': replaceEmpty(data.ivMoo),
            'อาคาร': replaceEmpty(data.ivBuilding),
            'ซอย/ตรอก': replaceEmpty(data.ivSoi),
            'ถนน': replaceEmpty(data.ivRoad),
            'แขวง/ตำบล': replaceEmpty(data.ivTumbon),
            'เขต/อำเภอ': replaceEmpty(data.ivAmphurName),
            'จังหวัด': replaceEmpty(data.ivProvinceName),
            'ไปรษณีย์': replaceEmpty(data.ivPostalCode),
            'ประเทศ': replaceEmpty(data.ivCountryName)
        }
    }
    var result = "";
    $.each(mapData, function (key, value) {
        if (value != "") {
            result += key + " " + value + " ";
        }
    });
    return result;
}

CommonDataOfCustomer.dataFromBaseToRestday = function (data) {
    var mapData = {};
    mapData = {
        'วันจันทร์': replaceEmpty(data.closeMon),
        'วันอังคาร': replaceEmpty(data.closeTue),
        'วันพุธ': replaceEmpty(data.closeWed),
        'วันพฤหัสบดี': replaceEmpty(data.closeThu),
        'วันศุกร์': replaceEmpty(data.closeFri),
        'วันเสาร์': replaceEmpty(data.closeSat),
        'วันอาทิตย์': replaceEmpty(data.closeSun),
        'วันหยุดนักขัตฤกษ์': replaceEmpty(data.closeHoliday)
    }

    var result = "";
    $.each(mapData, function (key, value) {
        if (value == "Y") {
            result += key + ", ";
        }
    });
    result = result.replace(/,\s*$/, "");
    return result;
}

$(".textAmount").on("keypress", function (e) {
    if ((e.which < 48 || e.which > 58) && e.which != 8 && e.which != 46) {
        return false;
    }
});


var TimeUtil = {};

TimeUtil.convertTo24Hour = function (time) {
    if(CheckNull(time)==""){
        return "";
    }
    // 8:00am
    time = time.trim();
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.substr(time.length - 2, time.length - 1).toUpperCase();
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;

    var result = sHours + ":" + sMinutes;
    return result;
}

TimeUtil.convertTo12Hour = function (time) {
    // Check correct time format and split into components
    time = time.trim();
    if (time == "24:00") {
        time = "23:59";
    }
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

/*
* @validate24HrForMate
* @param 22:22
* @return true/false validate
* */
TimeUtil.validate24HrFormate = function (timeStr) {
    if (timeStr.trim() == "24:00") {
        return true;
    } else {
        return (timeStr.search(/^\d{2}:\d{2}$/) != -1) && (timeStr.substr(0, 2) >= 0 && timeStr.substr(0, 2) <= 23) && (timeStr.substr(3, 2) >= 0 && timeStr.substr(3, 2) <= 59)
    }

}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};