chrome.runtime.sendMessage({"code": "getMostrarVentanas"}, response => {
    if (response.windows != null && response.windows.length > 0){
        for(var i=0 ;i < response.windows.length ;i++){
            var fechaAnadido = new Date(response.windows[i].date * 1000);
            var fecha = fechaAnadido.getDate() + "/" + (fechaAnadido.getMonth()+1) + "/" + fechaAnadido.getFullYear() + "   " + fechaAnadido.getHours() + ":" + fechaAnadido.getMinutes() + ":" + fechaAnadido.getSeconds();
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" id=\"tabs\" >" +response.windows[i].numberOfTabs + "</td><td  border="+2+" id=\"fecha\" >" + fecha + "</td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
        }
    } else if (response.windows != null && response.windows.length === 0){
		var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >No hay ventanas almacenadas</td><td  border="+2+" ></td></tr>";
		var btn = document.createElement("TR");
        btn.innerHTML=fila;
        document.getElementById("tablita").appendChild(btn);
	} else{
		var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >Ha ocurrido un error al tratar de obtener las ventanas</td><td  border="+2+" ></td></tr>";
		var btn = document.createElement("TR");
        btn.innerHTML=fila;
        document.getElementById("tablita").appendChild(btn);
	}
});