
window.onload = function () {
	const borrarUsuarioMenu = document.querySelector('#borrarUsuarioMenu');
	borrarUsuarioMenu.href = chrome.runtime.getURL("borrarUsuario.html");
    chrome.runtime.sendMessage({"code": "getDatosUsuario"}, response => {
        if (response != null && response.username != null){
            var nombre = response.username;
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" contenteditable = "+true+" id=\"Nombre\" >" + nombre + "</td><td  border="+2+" id=\"Password\" >" + "********" + "</td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
        }
    });
};