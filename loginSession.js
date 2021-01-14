document.querySelector('#buttonID').onclick= login;
document.querySelector('#buttonregistroID').onclick= registro;
document.querySelector('#btnHistorial').onclick= historial;
document.querySelector('#btnMaracadores').onclick= marcadores;
document.querySelector('#btnPestanas').onclick= pestanas;
document.querySelector('#btnVentanas').onclick= ventanas;
document.querySelector('#btnUsuario').onclick= usuario;
document.querySelector('#btnCerrarSesion').onclick= cerrarSesion;

document.getElementById("usernameID").autofocus= true; 

document.querySelector("#passwordID").addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    document.querySelector("#buttonID").click();
    event.preventDefault();
});

document.querySelector("#usernameID").addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    document.querySelector("#buttonID").click();
    event.preventDefault();
});

window.onload = function() {
	chrome.runtime.sendMessage({"code": "onOpen"}, response => {
			if (response != null && response.result != null){
				if (response.result === "No ha iniciado sesión"){
					mostrarFormulario();
				} else if (response.result === "Ha iniciado sesión"){
					mostrarMenu(response.username);
				}
			} else {
				window.close();
			}
		});
};

function historial(){
	chrome.tabs.create({url: chrome.runtime.getURL("mostrarHistorial.html"), active: true}, tab => {});
}

function marcadores(){
	chrome.tabs.create({url: chrome.runtime.getURL("mostrarMarcadores.html"), active: true}, tab => {});
}

function ventanas(){
	chrome.tabs.create({url: chrome.runtime.getURL("mostrarVentanas.html"), active: true}, tab => {});
}

function pestanas(){
	chrome.tabs.create({url: chrome.runtime.getURL("mostrarPestanas.html"), active: true}, tab => {});
}

function usuario(){
	chrome.tabs.create({url: chrome.runtime.getURL("mostrarDatosUsuario.html"), active: true}, tab => {});
}

function cerrarSesion(){
	chrome.runtime.sendMessage({"code": "logout"}, response => {
			if (response != null && response.result != null){
				if (response.result === "Cierre de sesión correcto"){
					mostrarFormulario();
				}
			}
		});
}

function login(){
	var username= document.querySelector('#usernameID').value.trim();
	var passw= document.querySelector('#passwordID').value.trim();
	const regexEmail= new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	if (username !== "" && passw !== "" && passw.length >= 8 && regexEmail.test(username)){
		var jsonData= {"username": username, "password": passw, "code": "login"};
		chrome.runtime.sendMessage(jsonData, response => {
			if (response != null && response.result != null){
				if (response.result === "No coinciden los datos"){
					document.querySelector('#errorLogIn').innerHTML= "Los datos introducidos no coinciden con ningún registro o ya tiene una sesión iniciada en otro equipo.";
					document.querySelector('#errorLogIn').removeAttribute("hidden");
				} else if (response.result === "Error del servidor"){
					document.querySelector('#errorLogIn').innerHTML= "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
					document.querySelector('#errorLogIn').removeAttribute("hidden");
				} else if (response.result === "El usuario no está registrado, regístrate si quieres usarlo"){
					document.querySelector('#errorLogIn').innerHTML= "El usuario no está registrado, regístrate si quieres usarlo.";
					document.querySelector('#errorLogIn').removeAttribute("hidden");
				} else if (response.result === "Inicio de sesión correcto") {
					mostrarMenu(response.username);
				}
			} else {
				document.querySelector('#errorLogIn').innerHTML= "Ha ocurrido un problema, inténtalo de nuevo.";
				document.querySelector('#errorLogIn').removeAttribute("hidden");
			}
		});
	} else {
		document.querySelector('#errorLogIn').innerHTML= "Los datos introducidos no tienen un formato adecuado";
		document.querySelector('#errorLogIn').removeAttribute("hidden");
	}
}

function mostrarMenu(username){
	document.querySelector('#divInicioSesion').setAttribute("hidden", true); //Ocultar formulario de inicio de sesión
	document.querySelector('#usernameTitle').innerHTML= username; //Mostrar usuario
	document.querySelector('#divMenu').removeAttribute("hidden"); //Mostrar menú
}

function mostrarFormulario(){
	document.querySelector('#divMenu').setAttribute("hidden", true); //Ocultar menu
	document.querySelector('#divInicioSesion').removeAttribute("hidden"); //Mostrar formulario
}

function registro(){
	var username= document.querySelector('#usernameID').value.trim();
	var passw= document.querySelector('#passwordID').value.trim();
	const regexEmail= new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	if (username !== "" && passw !== "" && passw.length >= 8 && regexEmail.test(username)){
		var jsonData= {"username": username, "password": passw, "code": "signin"};
		chrome.runtime.sendMessage(jsonData, response => {
			if (response != null && response.result != null){
				if (response.result === "El email ya existe"){
					document.querySelector('#errorLogIn').innerHTML= "El email ya existe en el sistema";
					document.querySelector('#errorLogIn').removeAttribute("hidden");
				} else if (response.result === "Error del servidor"){
					document.querySelector('#errorLogIn').innerHTML= "El servidor no responde correctamente, inténtalo de nuevo más tarde.";
					document.querySelector('#errorLogIn').removeAttribute("hidden");
				} else if (response.result === "Error desconocido al iniciar sesión"){
					document.querySelector('#errorLogIn').innerHTML= "El usuario se ha registrado pero no ha sido posible iniciar sesión, inicie sesión manualmente.";
					document.querySelector('#errorLogIn').removeAttribute("hidden");
				} else if (response.result === "Inicio de sesión correcto") {
					mostrarMenu(response.username);
				}
			} else {
				document.querySelector('#errorLogIn').innerHTML= "Ha ocurrido un problema, inténtalo de nuevo.";
				document.querySelector('#errorLogIn').removeAttribute("hidden");
			}
		});
	} else {
		document.querySelector('#errorLogIn').innerHTML= "Los datos introducidos no tienen un formato adecuado";
		document.querySelector('#errorLogIn').removeAttribute("hidden");
	}
}