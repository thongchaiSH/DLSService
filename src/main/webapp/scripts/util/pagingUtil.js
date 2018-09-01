
var UtilPagination = new function(){
    _this = this;
    this.id;
    // this.limitData = session.initialData.limitPaging;
    this.limitData =15
    //get session setMax data
    this.page = 0;
    this.totalPage = 0;
    this.urlSize ="";
    this.urlData = "";
    this.dataSearch = {};
    this.numberOfPages = 3;
    this.maxData = 0;
    this.startDisplayRecords = 0;
    this.toDisplayRecords = 0;
    this.toDisplayPaging = true;

    this.setDisplayPaging = function(flag){
        this.toDisplayPaging = flag;
    };

    this.setLimitData = function(num){
        this.limitData = num;
    };

    this.getLimitData = function(){
        return this.limitData;
    };

    this.setNumberOfPages = function(num){
        this.numberOfPages = num;
    };

    this.getNumberOfPages = function(){
        return this.numberOfPages;
    };

    this.setUrlSize = function(url){
        this.urlSize = url;
    };

    this.getUrlSize = function(){
        return this.urlSize;
    }

    this.setUrlData = function(url){
        this.urlData = url;
    };

    this.getUrlData = function(){
        return this.urlData;
    };

    this.setDataSearch = function(jsonData){
        this.dataSearch = jsonData;
    }

    this.getDataSearch = function(){
        return this.dataSearch;
    }

    this.loadTable = function(json){
    };

    this.getMaxData = function () {
        return this.maxData;
    }

    this.setMaxData = function (num) {
        this.maxData = num;
    }

    function loadData(firstResult,maxResult,object){
        var temp = object.getDataSearch();
        var defualt = {
            firstResult:firstResult,
            maxResult:maxResult,
            page:firstResult/maxResult,
            size:maxResult
        };

        this.setMaxData(object.getMaxData());
        this.totalPage = object.totalPage;
        this.setId(object.getId());

        $.extend(temp,defualt);

        $('.dv-background').show();
        var jsonText = AjaxUtil.get(object.getUrlData(),temp,false).done(function (){
            //close loader
            $('.dv-background').hide();
        }).responseText;

        var json;
        try {
            json = JSON.parse(jsonText);
        }catch(e) {
            json = JSON.parse("[]");
            console.log("JSON.parse is fail");
            $('.dv-background').hide();
        }

        if(object.maxData == 0){
            this.startDisplayRecords = 0;
            this.toDisplayRecords = 0;
        }
        else
        {
            var lengthVar = 0;
            if(json.length){
                lengthVar = json.length;
            }else{
                lengthVar = json.content.length;
            }

            this.startDisplayRecords = firstResult;
            if(this.startDisplayRecords == 0){
                this.toDisplayRecords = this.startDisplayRecords + lengthVar;
                this.startDisplayRecords = 1;
            }
            else
            {
                this.startDisplayRecords = firstResult;
                this.toDisplayRecords = this.startDisplayRecords+lengthVar;
            }


        }

        object.loadTable(json);
        this.updateLabel();
    }

    this.setId = function(newId){
        this.id = newId;
    };

    this.setIdAndLimitData = function(newId,limit){
        this.id = newId;
        this.limitData = limit;
    };

    this.getId = function(){
        return this.id;
    }

    this.getPage = function(){
        return this.page;
    };

    this.setPage = function(p){
        this.page = p;
    };

    this.setDisplayPage = function(){


        $form = $("form#showOnPage");
        $form.find("input").val(this.getLimitData());
        var pagging = this;

        $form.on('submit',function(){
            try{
                $input = $form.find("input");

                // return false;
                pagging.setLimitData(parseInt($input.val()));
                session.pageLimitSize = parseInt($input.val())
                session.clickSize = parseInt($input.val());
                pagging.search(pagging);
            }catch(err){
                console.log(err);
                return false;
            }
            // this.setLimitData(parseInt($input.val()));
            // if($input.val()!=0 || $input.val() !="" ||$input.val()==nul)

            return false;
        });





    }


    this.loadData = loadData;

    this.search = function(object){

        var temp = this.getDataSearch();
        var pagging = this;
        var jsonSizeText = AjaxUtil.get(this.getUrlSize(),temp,false).responseText;
        var jsonSize = JSON.parse(jsonSizeText);

        if(jsonSize.size != undefined){
            this.setMaxData(jsonSize.size);
            object.setMaxData(jsonSize.size);
        }else{
            this.setMaxData(jsonSize.page.totalElements);
            object.setMaxData(jsonSize.page.totalElements);
        }



        this.totalPage = Math.ceil(this.getMaxData()/this.limitData);

        this.setId(object.getId());

        this.setLimitData(object.getLimitData());


        this.setPage(1);
        var firstResult = 0;
        this.loadData(firstResult,this.limitData,object);


        if(this.totalPage != 0){
            var options = {
                currentPage: 1,
                totalPages: this.totalPage,
                numberOfPages : this.getNumberOfPages(),
                onPageClicked: function(e,originalEvent,type,page){

                    _this.setPage(page);
                    // console.log('object.getLimitData()='+object.getLimitData());
                    // console.log('this.limitData='+this.limitData);
                    // console.log('_this.limitData='+_this.limitData);
                    //var firstResult = (page - 1)*_this.limitData;
                    //_this.loadData(firstResult,_this.limitData,object);
                    var firstResult = (page - 1) * object.getLimitData();
                    _this.loadData(firstResult,object.getLimitData(),object);
                }
            };

            $(this.getId()).bootstrapPaginator(options);
            if(this.toDisplayPaging){
                $(this.getId()).removeAttr("style");
            }
            $(this.getId()+"Label").removeAttr("style");
        }
        else{
            $(this.getId()).attr("style","display:none");
        }
        $(this.getId()+"Label").removeAttr("style");

        // console.log($("a.sizePaging"))

        $("a.sizePaging").click(function(){
            var size = $(this).attr("size");

            try{
                pagging.setLimitData(parseInt(size));
                session.pageLimitSize = parseInt(size)
                session.clickSize = size;

                pagging.search(pagging);

            }	catch(err){
                console.log(err);
                return false;
            }
            // $(this).css("color","#428bca");
        });


    };

    this.loadPage = function (page,object){
        if(page > this.totalPage){
            return;
        }

        this.setPage(page);
        this.setMaxData(object.getMaxData());
        this.totalPage = object.totalPage;

        var firstResult = (page - 1)*this.limitData;

        this.loadData(firstResult,this.limitData,object);

        if(this.totalPage != 0){
            this.options = {
                currentPage: page,
                totalPages: this.totalPage,
                numberOfPages : this.getNumberOfPages(),
                onPageClicked: function(e,originalEvent,type,page){

                    _this.setPage(page);
                    var firstResult = (page - 1)*_this.limitData;
                    _this.loadData(firstResult,_this.limitData,object);

                }
            };

            $(this.getId()).bootstrapPaginator(this.options);

            $(this.getId()+"Label").removeAttr("style");
            $(this.getId()).removeAttr("style");
        }
        else
        {
            $(this.getId()).attr("style","display:none");
        }
    };

    this.updateLabel = function () {

        if(this.page > 1)
        {
            $(this.getId()+ "StartDisplayRecords").text(this.startDisplayRecords+1);
        }
        else
        {
            $(this.getId()+ "StartDisplayRecords").text(this.startDisplayRecords);
        }

        $(this.getId()+ "ToDisplayRecords").text(this.toDisplayRecords);
        $(this.getId()+ "DisplayTotalRecord").text(this.getMaxData());

        if(this.getMaxData() > 1){
            $(this.getId()+ "Record").text($(this.getId()+ "Record").attr("data-records"));
        }
        else
        {
            $(this.getId()+ "Record").text($(this.getId()+ "Record").attr("data-record"));
        }
    }

    this.resetGrid=function () {
        this.page = 0;
        this.totalPage = 0;
        this.maxData = 0;
        this.startDisplayRecords = 0;
        this.toDisplayRecords = 0;
        this.updateLabel();
        $(this.getId()).attr("style","display:none");
    }
};

