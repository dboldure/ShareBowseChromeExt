window.onload= ()=>{
	const mostrarHistorial = document.querySelector('#mostrarHistorial');
	mostrarHistorial.href = chrome.runtime.getURL("mostrarHistorial.html");
};

chrome.runtime.sendMessage({"code": "getMostrarHistorial"}, response => {
    if (response.history != null && response.history.length > 0){
        for(var i=0 ;i < response.history.length ;i++){
            var fechaAnadido = new Date(response.history[i].addedTime * 1000);
            var fecha = fechaAnadido.getDate() + "/" + (fechaAnadido.getMonth()+1) + "/" + fechaAnadido.getFullYear() + "   " + fechaAnadido.getHours() + ":" + fechaAnadido.getMinutes() + ":" + fechaAnadido.getSeconds();
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"'><td border="+2+" id=\"fecha\" style='word-wrap:break-word;'>" +response.history[i].url + "</td><td  border="+2+" id=\"URL\" >" + fecha + "</td><td  border="+2+"><button type=\"button\" class=\"btn btn-dark btn-sm\" id=\"buttonBorrarH"+response.history[i]._id.toString()+"\" >"+"Borrar"+"</button></td><td  border="+2+"><input type=\"checkbox\" class='multipleDelete' id=\"CheckBoxBorrarH"+response.history[i]._id.toString()+"\"></td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
            document.querySelector('#buttonBorrarH'+response.history[i]._id.toString()).onclick= BorrarUnoDelHistorial;
        }
		document.querySelector('#borrarTodoID').removeAttribute("hidden");
		document.querySelector('#borrarSeleccionadoID').removeAttribute("hidden");
        
    } else if (response.history != null && response.history.length === 0){
		document.querySelector('#borrarTodoID').setAttribute("hidden", true);
		document.querySelector('#borrarSeleccionadoID').setAttribute("hidden", true);
		var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >No hay historial almacenado</td><td  border="+2+" ></td></tr>";
		var btn = document.createElement("TR");
        btn.innerHTML=fila;
        document.getElementById("tablita").appendChild(btn);		
	} else{
		document.querySelector('#borrarTodoID').setAttribute("hidden", true);
		document.querySelector('#borrarSeleccionadoID').setAttribute("hidden", true);
		var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >Ha ocurrido un error al tratar de obtener el historial</td><td  border="+2+" ></td></tr>";
		var btn = document.createElement("TR");
        btn.innerHTML=fila;
        document.getElementById("tablita").appendChild(btn);
	}
});

document.querySelector('#borrarSeleccionadoID').onclick= borrarHistorialSeleccionado;
function borrarHistorialSeleccionado() {
    const checkboxes = document.querySelectorAll(".multipleDelete:checked");
    const arrayID = [];
    for (let i =0; i < checkboxes.length;i++){
        const currentID  = checkboxes[i].id.split("CheckBoxBorrarH")[1];
        arrayID.push(currentID);
    }
    if ( arrayID.length > 0){
        var jsonData= {"listIDS": arrayID, "code": "borrarEntradaHistorialSeleccionada"};
        chrome.runtime.sendMessage(jsonData, response => {
            if (response != null && response.result != null){
                if (response.result === "Error del servidor") {
                    document.querySelector('#errorEdit').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                }
                else if(response.result.toString() === "Paginas del historial eliminadas"){
                    document.querySelector('#errorEdit').innerHTML = "<p>Paginas del historial eliminadas</p>";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                    location.reload();
                }
                else if(response.result.toString() === "Error desconocido al borrar el historial"){
                    document.querySelector('#errorEdit').innerHTML = "<p>Error desconocido al borrar el historial</p>";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                }
            }
        });
    }
}
	

function BorrarUnoDelHistorial(){
    const idMongodb= this.id.split("buttonBorrarH")[1];
    if ( idMongodb !== "" && idMongodb.length >= 0){
        var jsonData= {"id": idMongodb, "code": "borrarEntradaHistorial"};
        chrome.runtime.sendMessage(jsonData, response => {
            if (response != null && response.result != null){
                if (response.result === "Error del servidor") {
                    document.querySelector('#errorEdit').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                }
                else if(response.result.toString() === "Pagina del historial eliminada"){
                    document.querySelector('#errorEdit').innerHTML = "<p>Pagina del historial eliminada</p>";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
					location.reload();
                }
                else if(response.result.toString() === "Error desconocido al borrar el historial"){
                    document.querySelector('#errorEdit').innerHTML = "<p>Error desconocido al borrar el historial</p>";
                    document.querySelector('#errorEdit').removeAttribute("hidden");
                }
            }
        });
    }
}

document.querySelector('#borrarTodoID').onclick= BorrarTodoHistorial;

function BorrarTodoHistorial(){
    var jsonData= {"code": "borrarTodoHistorial"};
    chrome.runtime.sendMessage(jsonData, response => {
        if (response != null && response.result != null){
            if (response.result === "Error del servidor") {
                document.querySelector('#errorEdit').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
                document.querySelector('#errorEdit').removeAttribute("hidden");
            }
            else if(response.result === "Historial eliminado"){
				location.reload();
            }
            else if(response.result === "Error desconocido al borrar el historial"){
                document.querySelector('#errorEdit').innerHTML = "<p>Error desconocido al borrar el historial</p>";
                document.querySelector('#errorEdit').removeAttribute("hidden");
            }
        }
    });
}