var UtilNumber = {};

UtilNumber.setOldValue = function (input) {
    var input = $(input);
    input.attr("oldValue", input.val());
}

UtilNumber.plus = function (btn) {
    var btn = $(btn);
    var input = $("#"+btn.attr('data-target')) ;
    if(input.attr("disabled") == "disabled"){
        return;
    }
    if(input.val() == ""){
        input.val("0");
    }
    if(input.val() == input.attr("max")){
        return;
    }
    input.attr("oldValue", input.val());
    input.val(Number(input.val())+1)
    input.change();
};

UtilNumber.minus = function (btn) {
    var btn = $(btn);
    var input = $("#"+btn.attr('data-target')) ;
    if(input.attr("disabled") == "disabled"){
        return;
    }
    if(input.val() == ""){
        input.val("0");
    }
    if(input.val() == input.attr("min")){
        return;
    }
    input.attr("oldValue", input.val());
    input.val(Number(input.val())-1)
    input.change();
};
