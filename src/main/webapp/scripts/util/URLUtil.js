function URLUtil () {}

URLUtil.getParameterValue = function (strParameterName) {
    strParameterName = strParameterName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + strParameterName + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Redirect page to specify language
 * @param {String} language
 * @returns {Page} commonChangeLanguage
 */
URLUtil.changeLanguage = function (language) {
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

/**
 * Rujiphat 23/11/2017
 */
URLUtil.getUrlRequestParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }


};
