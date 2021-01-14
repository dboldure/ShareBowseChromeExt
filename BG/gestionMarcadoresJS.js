//Funcion que se encarga de detectar si se ha borrado un marcador en chrome y lo elimina de la base de datos.
chrome.bookmarks.onRemoved.addListener((id,removeInfo)=> {
    chrome.storage.local.get(["token"], value => {
        if (removeInfo != null) {
            var name = removeInfo.node.title;
            var url = removeInfo.node.url;
            var jsonRequest = JSON.stringify({'name': name, 'url': url });
            const token= value["token"];
            makeRequest("POST",
                apiURL + "borrarMarcadorDetectado",
                jsonRequest,
                [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                xhr => {

                },
                () => {
                }
            );
            return true;

        }
    });
});

//Funcion que se encarga de detectar la creacion de un marcador en chrome y lo envia a node
chrome.bookmarks.onCreated.addListener((id, bookmark)=>{
    chrome.storage.local.get(["token"], value => {
        if (bookmark != null && bookmark.url != null) {
			setTimeout(() => { //Usado para si el usuario cambia el nombre al marcador que de tiempo a que lo registre con el nombre dado
				chrome.bookmarks.get(bookmark.id, bookmarks => {
					bookmark= bookmarks[0];
					var name = bookmark.title;
					var url = bookmark.url;
					var jsonRequest = JSON.stringify({'name': name, 'url': url, });
					const token= value["token"];
					makeRequest("POST",
						apiURL + "anadirMarcador",
						jsonRequest,
						[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
						xhr => {},
						() => {}
					);
				});
			}, 10000);
            return true;
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
	if (message != null && message["code"] === "addManualBookmark") {
		chrome.storage.local.get(["token"], value => {
			if (typeof value["token"] !== "undefined") { //Si hay usuario identificado
				const token = value["token"];
				var name = message["name"];
				var url = message["url"];
				var jsonRequest = JSON.stringify({'name': name, 'url': url});
				//Hacer la petición a NodeJS
				makeRequest("POST",
					apiURL + "anadirMarcador",
					jsonRequest,
					[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
					xhr => {
						var resp = JSON.parse(xhr.responseText);
						callback({result: resp.message});
					},
					() => { //Si ocurre un error del servidor
						callback({result: "Error del servidor"});
					}
				);
			} else {
				callback({result: "No está identificado"});
			}
		});
		return true;
	}
	else if (message != null && message["code"] === "getmostrarMarcadores") {
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No se ha iniciado sesion"});
            } else {
                const token = value["token"];
                //Hacer la petición a NodeJS
                makeRequest("GET",
                    apiURL + "obtenerMarcadores",
                    "",
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({bookmarks: resp.bookmarkk});
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error en el servidor"});
                    }
                );
            }
        });
        return true; //Para asegurarse que la respuesta esta gestionada de forma asincrona y el canal no se cierra
    }
	else if (message != null && message["code"] === "getBorrarMarcadores") {
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No ha iniciado sesión"});
            } else {
                const token = value["token"];
                //Hacer la petición a NodeJS
                makeRequest("GET",
                    apiURL + "borrarMarcador",
                    "",
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({bookmarks: resp.bookmark});
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error del servidor"});
                    }
                );
            }
        });
        return true; //Para asegurarse que la respuesta est� gestionada de forma as�ncrona y el canal no se cierra
    }else  if (message != null && message["code"] === "postBorrarMarcadores") {
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No ha iniciado sesión"});
            } else {
                const token = value["token"];
                var jsonRequest= JSON.stringify({'id': message["id"]});
                //Hacer la petición a NodeJS
                makeRequest("POST",
                    apiURL + "borrarMarcador",
                    jsonRequest,
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({result: resp.message});
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error del servidor"});
                    }
                );
            }
        });
        return true; //Para asegurarse que la respuesta est� gestionada de forma as�ncrona y el canal no se cierra
    }
	else if (message != null && message["code"] === "getEditMarcadores") {
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No ha iniciado sesión"});
            } else {
                const token = value["token"];
                //Hacer la petición a NodeJS
                makeRequest("GET",
                    apiURL + "editarMarcador",
                    "",
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({bookmarks: resp.bookmarkk});
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error del servidor"});
                    }
                );
            }
        });

        return true; //Para asegurarse que la respuesta est� gestionada de forma as�ncrona y el canal no se cierra
    }
    else  if (message != null && message["code"] === "editMarcador"){ //Si se llama desde el inicio de sesión
		chrome.storage.local.get(["token"], value => {
			if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No ha iniciado sesión"});
            } else {
					const token = value["token"];
					var name= message["name"];
					var id = message["id"];
					var jsonRequest= JSON.stringify({'name': name, 'id': id});
					//Hacer la petición a NodeJS
					makeRequest("POST",
						apiURL + "editarMarcador",
						jsonRequest,
						[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
						xhr => {
							var resp = JSON.parse(xhr.responseText);
							if (resp != null && resp.message != null){
								callback({result: resp.message});
							} else {
								callback({result: "Error desconocido al editar marcador"});
							}
						},
						() => { //Si ocurre un error del servidor
							callback({result: "Error del servidor"});
						}
					);
			}
		});
        return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
    }
	else  if (message != null && message["code"] === "editVariosMarcadores"){ //Si se llama desde el inicio de sesión
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No ha iniciado sesión"});
            } else {
                const token = value["token"];
                var listado= message["listado"];
                var jsonRequest= JSON.stringify({'listado': listado});
                //Hacer la petición a NodeJS
                makeRequest("POST",
                    apiURL + "editVariosMarcador",
                    jsonRequest,
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        if (resp != null && resp.message != null){
                            callback({result: resp.message});
                        } else {
                            callback({result: "Error desconocido al editar marcador"});
                        }
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error del servidor"});
                    }
                );
            }
        });
        return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
    }
});

