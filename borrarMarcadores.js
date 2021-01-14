window.onload= ()=>{
	const crearMarcadores = document.querySelector('#anadirMarcadoresManualmente');
	crearMarcadores.href = chrome.runtime.getURL("anadirMarcadoresManualmente.html");
	
	const editarMarcadores = document.querySelector('#editarMarcadores');
	editarMarcadores.href = chrome.runtime.getURL("editarMarcadoresH.html");
	
	const mostrarMarcadores = document.querySelector('#mostrarMarcadores');
	mostrarMarcadores.href = chrome.runtime.getURL("mostrarMarcadores.html");
};

chrome.runtime.sendMessage({"code": "getBorrarMarcadores"}, response => {
    if (response.bookmarks != null && response.bookmarks.length > 0){
        response.bookmarks.sort(function (o1,o2) {
            if (o1.name > o2.name) {
                return 1;
            } else if (o1.name < o2.name) {
                return -1;
            }
            return 0;
        });
        for(var i=0 ;i < response.bookmarks.length ;i++){
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" id=\"editname"+response.bookmarks[i]._id.toString()+"\" >" +response.bookmarks[i].name+ "</td><td  border="+2+" id=\"contenidoBorradourl\" >" + response.bookmarks[i].url + "</td><td border="+2+"><button type=\"button\" class=\"btn btn-dark btn-sm\" id=\"buttonBorrar"+response.bookmarks[i]._id.toString()+"\" >"+"Borrar"+"</button></td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
            document.querySelector('#buttonBorrar'+response.bookmarks[i]._id.toString()).onclick= borrarMarcadorH;
        }
	} else if (response.bookmarks != null && response.bookmarks.length === 0){
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >No hay marcadores almacenados en la extensión</td><td  border="+2+" ></td></tr>";
			var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
	} else {
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >Ha ocurrido un error al tratar de obtener los marcadores</td><td  border="+2+" ></td></tr>";
			var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
	}
});

function borrarMarcadorH(){
    const idMongodb= this.id.split("buttonBorrar")[1].trim();
    if (idMongodb !== "" && idMongodb.length >= 0){
        var jsonData= {"id": idMongodb, "code": "postBorrarMarcadores"};
        chrome.runtime.sendMessage(jsonData, response => {
            if (response != null && response.result != null){
                if (response.result === "Error del servidor") {
                    document.querySelector('#errorDelete').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
                    document.querySelector('#errorDelete').removeAttribute("hidden");
                    setTimeout(() => {
                        document.querySelector('#errorDelete').setAttribute("hidden", true);
                        }, 2000);
                }
                else{
                    location.reload();
                }
            }
        });
    }
}