function ValidateFieldUtil(){

}



ValidateFieldUtil.isEmpty=function(value){
    return (value==null)||(typeof (value)=="undefined")||(value.length==0);
}