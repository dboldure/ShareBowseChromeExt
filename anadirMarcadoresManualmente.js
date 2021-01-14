document.querySelector('#buttonID').onclick= addBookmark;
window.onload= ()=>{
	const mostrarMarcadores = document.querySelector('#mostrarMarcadores');
	mostrarMarcadores.href = chrome.runtime.getURL("mostrarMarcadores.html");
	
	const editarMarcadores = document.querySelector('#editarMarcadores');
	editarMarcadores.href = chrome.runtime.getURL("editarMarcadoresH.html");
	
	const borrarMarcadores = document.querySelector('#borrarMarcadores');
	borrarMarcadores.href = chrome.runtime.getURL("borrarMarcadores.html");
};

function addBookmark() {
    var name= document.querySelector('#nameID').value.trim();
    var url= document.querySelector('#urlID').value.trim();
    const regexURL= new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
    if (name !== "" && url !== "" && regexURL.test(url)) {
        var jsonData = {"name": name, "url": url, "code": "addManualBookmark"};
        chrome.runtime.sendMessage(jsonData, response => {
            if (response != null && response.result != null){
                if (response.result === "Error desconocido al crear el marcador") {
                    document.querySelector('#errorAdd').innerHTML = "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
                    document.querySelector('#errorAdd').removeAttribute("hidden");
                }
                else if (response.result === "El marcador ya existe") {
                    document.querySelector('#errorAdd').innerHTML = "El marcador ya existe.";
                    document.querySelector('#errorAdd').removeAttribute("hidden");
                }else if (response.result === "Marcador guardado") {
                    document.querySelector('#successAdd').innerHTML = "Marcador guardado.";
                    document.querySelector('#successAdd').removeAttribute("hidden");
                }
            }
        });
    } else {
        document.querySelector('#errorAdd').innerHTML= "Formato de datos inválido";
        document.querySelector('#errorAdd').removeAttribute("hidden");
    }
}