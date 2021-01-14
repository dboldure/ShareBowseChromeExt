//Usado para impedir acceso a páginas internas de la extensión sin iniciar sesión
chrome.webNavigation.onCommitted.addListener(result => { //When a navigation is requested
	if (!(result.url.indexOf(chrome.runtime.id) === -1 || result.url.indexOf("loginPage.html") !== -1)) {
		chrome.storage.local.get(["username"], value => {
			chrome.storage.local.get(["token"], value2 => {
				if (typeof value["username"] === "undefined" || typeof value2["token"] === "undefined"){ //Si no hay usuario identificado
					chrome.tabs.get(parseInt(result.tabId), tab => {
						chrome.tabs.remove(tab.id);
					});
				}
			});
		});
	}
});

//Usado para cerrar la sesión cada vez que se arranca el navegador
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["token"], value => {
		if (typeof value["token"] !== "undefined"){ //Si hay usuario identificado
			const token= value["token"];
			//Hacer la petición a NodeJS
			makeRequest("GET", 
				apiURL + "cierreSesion",
				"",
				[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
				xhr => {
					var resp = JSON.parse(xhr.responseText);
					chrome.storage.local.remove(["username"], () => {
						chrome.storage.local.remove(["token"], () => {
							if (timeoutLogin != null){
								clearInterval(timeoutLogin);
								timeoutLogin= null;
							}
						});
					});
				},
				() => { //Si ocurre un error del servidor
				}
			);
		}
	});
});

//Usado para recibir los mensajes de inicio de sesión y registro
//callback -> función callback con los parámetros: message (con la información), sender (quien envia el mensaje) y callback (con la respuesta)
chrome.runtime.onMessage.addListener((message, sender, callback) => {
	if (message != null && message["code"] === "login"){ //Si se llama desde el inicio de sesión
		var username= message["username"];
		var passw= message["password"];
		var jsonRequest= JSON.stringify({'password': passw, 'username': username});
		//Hacer la petición a NodeJS
		makeRequest("POST", 
			apiURLLoginSignIn + "inicioSesion",
			jsonRequest,
			[{name: 'Content-type', value: 'application/json;charset=UTF-8'}],
			xhr => {
				var resp = JSON.parse(xhr.responseText);
				if (resp.access === true) { //Si se ha concedido el acceso
						var tokenAlmacenaje= {};
						tokenAlmacenaje["token"]= resp.token;
						chrome.storage.local.set(tokenAlmacenaje, () => {
							var usernameAlmacenaje= {};
							usernameAlmacenaje["username"]= username;
							chrome.storage.local.set(usernameAlmacenaje, () => {
								callback({result: "Inicio de sesión correcto", username: username});
								timeoutLogin= setTimeout(() => {
									chrome.storage.local.remove(["username"], () => {
										chrome.storage.local.remove(["token"], () => {
											timeoutLogin= null;
										});
									});
								}, 2700000);
							});
						});		
				} else {
					if (resp.message === "El usuario no está registrado, regístrate si quieres usarlo"){
						callback({result: resp.message});
					} else{
						callback({result: "No coinciden los datos"});
					}
				}
			},
			() => { //Si ocurre un error del servidor
				callback({result: "Error del servidor"});
			}
		);
		return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
	} else if (message != null && message["code"] === "signin"){ //Si se llama desde el registro
		var username= message["username"];
		var passw= message["password"];
		var jsonRequest= JSON.stringify({'password': passw, 'username': username});
		//Hacer la petición a NodeJS
		makeRequest("POST", 
			apiURLLoginSignIn + "registro",
			jsonRequest,
			[{name: 'Content-type', value: 'application/json;charset=UTF-8'}],
			xhr => {
				var resp = JSON.parse(xhr.responseText);
				if (resp.access === true) { //Si se ha concedido el acceso
						var tokenAlmacenaje= {};
						tokenAlmacenaje["token"]= resp.token;
						chrome.storage.local.set(tokenAlmacenaje, () => {
							var usernameAlmacenaje= {};
							usernameAlmacenaje["username"]= username;
							chrome.storage.local.set(usernameAlmacenaje, () => {
								callback({result: "Inicio de sesión correcto", username: username});
								timeoutLogin= setTimeout(() => {
									chrome.storage.local.remove(["username"], () => {
										chrome.storage.local.remove(["token"], () => {
											timeoutLogin= null;
										});
									});
								}, 2700000);
							});
						});		
				} 
				else if (resp.message === "Error desconocido al iniciar sesión") {
					callback({result: "Error desconocido al iniciar sesión"});				
				} 
				else if (resp.message === "El usuario ya existe") {
					callback({result: "El email ya existe"});
				} 
				else {
					callback({result: "Error del servidor"});
				}
			},
			() => { //Si ocurre un error del servidor
				callback({result: "Error del servidor"});
			}
		);
		return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
	} else if (message != null && message["code"] === "onOpen"){ //Si se llama desde la apertura de menú
		chrome.storage.local.get(["username"], value => {
			chrome.storage.local.get(["token"], value2 => {
				if (typeof value["username"] === "undefined" || typeof value2["token"] === "undefined"){ //Si no hay usuario identificado
					callback({result: "No ha iniciado sesión"});
				} else {
					callback({result: "Ha iniciado sesión", username: value["username"]});
				}
			});
		});
		return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
	} else if (message != null && message["code"] === "logout"){ //Si se llama desde el cierre de sesión
		chrome.storage.local.get(["token"], value => {
				if (typeof value["token"] === "undefined"){ //Si no hay usuario identificado
					callback({result: "No ha iniciado sesión"});
				} else {
					const token= value["token"];
					chrome.storage.local.remove(["username"], () => {
						chrome.storage.local.remove(["token"], () => {
							callback({result: "Cierre de sesión correcto"});
							if (timeoutLogin != null){
								clearInterval(timeoutLogin);
								timeoutLogin= null;
							}
						});
					});
					//Hacer la petición a NodeJS
					makeRequest("GET", 
						apiURL + "cierreSesion",
						"",
						[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
						xhr => {},
						() => { //Si ocurre un error del servidor
							callback({result: "Error del servidor"});
						}
					);
				}
		});
		return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
	} else if(message != null && message["code"] === "getDatosUsuario") {
		chrome.storage.local.get(["username"], value => {
			if (typeof value["username"] === "undefined"){ //Si no hay usuario identificado
				callback({result: "No ha iniciado sesión"});
			} else {
				callback({username: value["username"]});
			}
		});
		return true;
	}
	else  if (message != null && message["code"] === "borrarUsuario") {
			//Hacer la petición a NodeJS
			chrome.storage.local.get(["token"], value => {
				var jsonRequest = JSON.stringify({'username': message['username'], 'password': message['password']});
				const token = value["token"];
				//Hacer la petición a NodeJS
				makeRequest("POST",
					apiURL + "borrarUsuario",
					jsonRequest,
					[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
					xhr => {
						var resp = JSON.parse(xhr.responseText);
						if (resp.message === "Usuario borrado"){
							chrome.storage.local.remove(["username"], () => {
								chrome.storage.local.remove(["token"], () => {
									callback({result: "Cierre de sesión correcto"});
									if (timeoutLogin != null){
										clearInterval(timeoutLogin);
										timeoutLogin= null;
									}
								});
							});
						}
						callback({result: resp.message});
					},
					() => {
					}
				);
			});
			return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
	}
});