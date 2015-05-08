a = $('table').last()
for (var i = 50; i >= 0; i--) {
	a.append("<tr><td>New row</td></tr>");
}

function paint() {
	for (var i = 50; i >= 0; i--) {
		$("table:nth-child("+i+")").css('background-color', 'black')
		console.log("table:nth-child("+i+")")
	  
	}
}

paint()