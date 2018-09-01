UtilLov={};
var arrLov = [];
var timerSearch=0;

var objectModal = $.extend({}, UtilPagination);

UtilLov.sortByArr = function () {

    highlightWord()
    $("#"+idForSelect).autocomplete({
        source: arrLov,
        minLength: 0,
        select:function(event,ui) {
            $("#"+idForSelect).val( ui.item.desc );
            checkDemoRevison(ui.item.label);
        }
    }).focus(function () {
        $(this).autocomplete('search','')
    });
    $("#"+idForSelect).focus();
}

UtilLov.checkData = function (btn) {
    var id = "#"+btn.id;
    checkDemoRevison($(id).val());
}

function checkDemoRevison(label) {
    var index = arrLov.findIndex( arrLov => arrLov.label  == label);
    if(index != -1){
        $("#"+idForSelect).attr("data-id",arrLov[index].desc);
    }
}

UtilLov.queryData = function () {
    var keywordSearch =  $("#"+idForSelect).val();
    console.log(keywordSearch);
    arrLov = [];
    var json = $.ajax({
        type: "GET",
        dataType: "json",
        url: session['context'] + '/demos/listDemoHeaderNamelikeAndmaxSizeAndOrderby',
        data:{
            orderBy:'localName',
            sortBy : 'asc',
            firstResult:null,
            maxResult:null,
            name : keywordSearch,
            size:15
        },
        headers: {
            Accept: "application/json",
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false
    }).responseJSON;

    if(json != null){

        $.each(json,function (index,item) {

                var name = item.localName ==null?'':item.localName;

                var data={
                    label:name,
                    desc:item.id
                };
                arrLov.push(data);

        })
    }
    UtilLov.sortByArr();
};
var idForSelect;
UtilLov.setId = function (id_input) {
    idForSelect = id_input.id;

    if(arrLov.length == 0){
        UtilLov.queryData();
    }else{
        UtilLov.sortByArr();
    }
};

UtilLov.focusInput = function (id_input) {
    idForSelect = id_input.id;
};


UtilLov.focus = function (btn) {
    var id = "#"+btn.id;
    var idInput = "#"+$(id).attr('data-target');
    $(idInput).click();
};




function highlightWord() {

  var oldFn = $.ui.autocomplete.prototype._renderItem;

  $.ui.autocomplete.prototype._renderItem = function( ul, item) {

      var t = item.label.replace(this.term,"<span style='font-weight:bold;background-color:#B2FF59;'>" + this.term + "</span>");
      return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( "<a>" + t + "</a>" )
          .appendTo( ul );
  };
}


UtilLov.research=function(){

	if(timerSearch!=0){
		clearTimeout(timerSearch);
	}
	timerSearch= setTimeout(
    function(){ 
    	UtilLov.queryData();
    }, 1000);

}

var idInput ;

UtilLov.searchValueModal=function(items){
    var id = $(items).attr('searchLabel').split("_")[0];
    var inputTextValue = $("input#"+id).val();
    var labelId = $(items).attr('searchLabel');
    idInput = labelId;
    var $label = $("input#"+idInput)
    
    $label.val(inputTextValue);
    loadDataKeyword(inputTextValue,"code","asc");

}

UtilLov.searchKeyword=function(){
    // idInput
    var input = $("input#"+idInput);
    var value = input.val();
    console.log("value")
    loadDataKeyword(value,"code","asc");
}




function loadDataKeyword(keyword,orderBy,sortBy){
    keyword = keyword==null?"":keyword
     var criteriaObject = {
        keyword:keyword,
        orderBy:orderBy,
        sortBy : sortBy
    };

    objectModal.setId("#paggingModal");
    objectModal.setUrlData("/demos/listDemoApplicationOrderByParamAndKeyword");
    objectModal.setUrlSize("/demos/listDemoApplicationOrderByParamSizeKeyword");
    objectModal.setLimitData(session.initialData.limitPagingLov); //donforget;
    objectModal.loadTable = function (items) {
        renderDataKeyword(items);
    }


    objectModal.setDataSearch(criteriaObject);
    objectModal.search(objectModal);




}


function renderDataKeyword(data){
    $("#modalTable").empty();
    if(data.length > 0){
        $.each(data,function(index,item){
            $("#modalTable").append("<tr code="+item.localName+" >"+
                "<td class='text-center' >"+(item.code==null?'':item.code)+"</td>"+
                "<td class='text-left' >"+(item.localName==null?'':item.localName)+"</td>"+
                "</tr>");
        });
    }else{
    }


}