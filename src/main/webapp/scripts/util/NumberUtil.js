function NumberUtil () {}

NumberUtil.numberOnly=function(e){
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey ||
        (e.keyCode < 48 || e.keyCode > 57))&& (e.keyCode < 96 || e.keyCode > 105)|| e.keyCode==188) {
        e.preventDefault();
    }
}

NumberUtil.numberFixDigit=function(element,numberOfdigit){
    $(element).keyup(function() {
        if ($(this).val().indexOf('.') != -1) {
            if ($(this).val().split(".")[1].length > numberOfdigit) {
                if (isNaN(parseFloat(this.value)))
                    return;
                this.value = parseFloat(this.value).toFixed(numberOfdigit);
            }
        }
        if($(this).val().length>=2&&String($(this).val()).charAt(0)=="0"){
            $(this).val(0);
        }
        return this;
    });
}

NumberUtil.addComma=function(textValue){
   return textValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

NumberUtil.removeComma=function(textValue){
    var splitValue=textValue.split(",")
    var realValue=""
    $.each(splitValue,function(index,item){
        realValue+=item
    })
    return realValue
}

NumberUtil.parseFloat=function(value,digit){
    value=parseFloat(value);
    return value.toFixed(digit);
};