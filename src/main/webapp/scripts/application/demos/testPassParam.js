$("#button").click(function(){
	for(var i=0; i<10; i++){
		test();
	}
});

function test(){
	var rand = Number((new Date().getTime()+"").substr(9, 4));
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			Accept: "application/json"
		},
		data: rand,
		url: session['context']+'/demos/testPassParam?ouCode='+rand,
		complete:function(xhr){
			console.log("Random: "+ rand);
			console.log("Result: "+ xhr.responseText);
			console.log("----------------------------------");
		},
		// async:false
	});
}