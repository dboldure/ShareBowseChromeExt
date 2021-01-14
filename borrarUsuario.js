window.onload = function () {
    const datosUsuario = document.querySelector('#mostrarDatosUsuario');
    datosUsuario.href = chrome.runtime.getURL("mostrarDatosUsuario.html");

};
document.querySelector('#buttonBorrarUsuario').onclick= borrarUsuario;
document.querySelector("#passw").addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    document.querySelector("#buttonBorrarUsuario").click();
    event.preventDefault();
});

var usernameGlobal= null;
chrome.runtime.sendMessage({"code": "getDatosUsuario"}, response => {
	usernameGlobal = response.username;
});

function borrarUsuario(){
	var passw = document.querySelector('#passw').value.trim();
	const username = usernameGlobal;
	if (username && passw && username !== "" && username.length >= 0 && passw !== "" && passw.length >=7) {
		var jsonData = {"username": username, "code": "borrarUsuario", "password": passw};
		chrome.runtime.sendMessage(jsonData, response => {
			if (response != null && response.result != null) {
				if (response.result === "Formato de datos inválido") {
					document.querySelector('#errorDeleteUser').innerHTML = "El formato de datos no es válido";
					document.querySelector('#errorDeleteUser').removeAttribute("hidden");
				} else if (response.result.toString() === "Usuario borrado") {
					document.querySelector('#errorDeleteUser').innerHTML = "<p>Usuario eliminado</p>";
					document.querySelector('#errorDeleteUser').removeAttribute("hidden");
					location.reload();
				} else if (response.result.toString() === "Error al borrar usuario") {
					document.querySelector('#errorDeleteUser').innerHTML = "<p>Error desconocido al borrar usuario</p>";
					document.querySelector('#errorDeleteUser').removeAttribute("hidden");
				} else if (response.result.toString() === "La contraseña introducida es incorrecta") {
					document.querySelector('#errorDeleteUser').innerHTML = "<p>La contraseña introducida es incorrecta</p>";
					document.querySelector('#errorDeleteUser').removeAttribute("hidden");
				}
				
			} else{
				document.querySelector('#errorDeleteUser').innerHTML = "<p>Error desconocido al borrar usuario</p>";
				document.querySelector('#errorDeleteUser').removeAttribute("hidden");
			}
		});
	} else{
		document.querySelector('#errorDeleteUser').innerHTML = "<p>La contraseña no cumple el formato de mínimo 7 caracteres</p>";
		document.querySelector('#errorDeleteUser').removeAttribute("hidden");			
	}
}