var listado=null;
document.querySelector('#editarVariosID').onclick= editarVarios;
window.onload= ()=>{
	const crearMarcadores = document.querySelector('#anadirMarcadoresManualmente');
	crearMarcadores.href = chrome.runtime.getURL("anadirMarcadoresManualmente.html");
	
	const borrarMarcadores = document.querySelector('#borrarMarcadores');
	borrarMarcadores.href = chrome.runtime.getURL("borrarMarcadores.html");
	
	const mostrarMarcadores = document.querySelector('#mostrarMarcadores');
	mostrarMarcadores.href = chrome.runtime.getURL("mostrarMarcadores.html");
};

chrome.runtime.sendMessage({"code": "getEditMarcadores"}, response => {
    if (response.bookmarks != null && response.bookmarks.length > 0){
		response.bookmarks.sort(function (o1,o2) {
		if (o1.name > o2.name) {
			return 1;
		} else if (o1.name < o2.name) {
			return -1;
		}
		return 0;
	   });
		listado =response.bookmarks;
        for(var i=0 ;i < response.bookmarks.length ;i++){
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" contenteditable = "+true+" id=\"editname"+response.bookmarks[i]._id.toString()+"\" >" +response.bookmarks[i].name+ "</td><td  border="+2+" id=\"contenidoEditadourl\" >" + response.bookmarks[i].url + "</td><td><button type=\"button\" class=\"btn btn-dark btn-sm\" id=\"buttonEditarH"+response.bookmarks[i]._id.toString()+"\" >"+"Editar"+"</button></td border="+2+"></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
            document.querySelector('#buttonEditarH'+response.bookmarks[i]._id.toString()).onclick= editarMarcadorH;
        }
		document.querySelector('#editarVariosID').removeAttribute("hidden");
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

function editarVarios(){

    for(let i=0 ;i<listado.length;i++){
        var idMongodb= listado[i]._id.toString();
        var name= document.getElementById("editname"+idMongodb).textContent;
        listado[i].name = name;
    }
        if ( listado != null && listado.length > 0){
            var jsonData= {"listado": listado, "code": "editVariosMarcadores"};
            chrome.runtime.sendMessage(jsonData, response => {
                if (response != null && response.result != null){
                    if (response.result === "Error desconocido al editar marcador") {
                        document.querySelector('#errorEdit').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde";
                        document.querySelector('#errorEdit').removeAttribute("hidden");
                        setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
                    }
                    else if (response.result === "Edicion realizada") {
                        document.querySelector('#successEdit').innerHTML = "Has editado con exito";
                        document.querySelector('#successEdit').removeAttribute("hidden");
                        setTimeout(function(){ document.querySelector('#successEdit').setAttribute("hidden", true); }, 2000);
                    } else if (response.result === "El marcador no existe") {
                        document.querySelector('#errorEdit').innerHTML = "El marcador no existe";
                        document.querySelector('#errorEdit').removeAttribute("hidden");
                        setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
                    } else if (response.result === "Formato de datos inválido") {
                        document.querySelector('#errorEdit').innerHTML = "Los datos introducidos no tienen un formato adecuado";
                        document.querySelector('#errorEdit').removeAttribute("hidden");
                        setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
                    } else if (response.result === "No ha iniciado sesión") {
                        document.querySelector('#errorEdit').innerHTML = "No se ha iniciado sesión";
                        document.querySelector('#errorEdit').removeAttribute("hidden");
                        setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
                    }
                }
            });
        } else {
            document.querySelector('#errorEdit').innerHTML= "Los datos introducidos no tienen un formato adecuado";
            document.querySelector('#errorEdit').removeAttribute("hidden");
            setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
        }
}


function editarMarcadorH(){
    const idMongodb= this.id.split("buttonEditarH")[1];
    var name= document.getElementById("editname"+idMongodb).textContent;

    if (name !== "" && idMongodb !== "" && idMongodb.length >= 0 && name.length >= 0){
        var jsonData= {"name": name, "id": idMongodb, "code": "editMarcador"};
        chrome.runtime.sendMessage(jsonData, response => {
            if (response != null && response.result != null){
                if (response.result === "Error desconocido al editar marcador") {
                    document.querySelector('#errorEdit').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                    setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
                }
                else if (response.result === "Edicion realizada") {
                   document.querySelector('#successEdit').innerHTML = "Has editado con exito";
                   document.querySelector('#successEdit').removeAttribute("hidden");
                    setTimeout(function(){ document.querySelector('#successEdit').setAttribute("hidden", true); }, 2000);
                } else if (response.result === "El marcador no existe") {
					document.querySelector('#errorEdit').innerHTML = "El marcador no existe";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                    setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
				} else if (response.result === "Formato de datos inválido") {
					document.querySelector('#errorEdit').innerHTML = "Los datos introducidos no tienen un formato adecuado";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                    setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
				} else if (response.result === "No ha iniciado sesión") {
					document.querySelector('#errorEdit').innerHTML = "No se ha iniciado sesión";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                    setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
				}
            }
        });
    } else {
        document.querySelector('#errorEdit').innerHTML= "Los datos introducidos no tienen un formato adecuado";
        document.querySelector('#errorEdit').removeAttribute("hidden");
        setTimeout(function(){ document.querySelector('#errorEdit').setAttribute("hidden", true); }, 2000);
    }
}