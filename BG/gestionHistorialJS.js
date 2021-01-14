let arrayControlHistory= [];
chrome.history.onVisited.addListener((history)=>{
	if (!arrayControlHistory.includes(history.url)){
		arrayControlHistory.push(history.url);
		chrome.storage.local.get(["token"], value => {
			if (history != null) {
				const arrayValidValues = ["link", "typed"];
				let valueFound= false;
				let valueHistory= null;
				chrome.history.getVisits({url: history.url}, visitItemsArray => {
					for (let i= 0; i < visitItemsArray.length; ++i){
						if (visitItemsArray[i].id === history.id && visitItemsArray[i].visitTime === history.lastVisitTime && arrayValidValues.includes(visitItemsArray[i].transition)){
							valueFound= true;
							valueHistory= history;
							break;
						}
					}
					if (valueFound){
						var lastVisitTime = valueHistory.lastVisitTime/1000;
						var url = valueHistory.url;
						var jsonRequest = JSON.stringify({'lastVisitTime': lastVisitTime, 'url': url,});
						const token= value["token"];
						makeRequest("POST",
							apiURL + "anadirHistorial",
							jsonRequest,
							[{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
							xhr => {},
							() => {}
						);
					}
					setTimeout(() => {
						const newArray= arrayControlHistory.filter((value) => {return value !== history.url});
						arrayControlHistory = newArray;
					}, 2000);
				});
				return true;
			}
		});
	}
});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    if (message != null && message["code"] === "getMostrarHistorial") {
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No se ha iniciado sesion"});
            } else {
                const token = value["token"];
                //Hacer la petición a NodeJS
                makeRequest("GET",
                    apiURL + "obtenerHistorial",
                    "",
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({history: resp.historyy});
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error en el servidor"});
                    }
                );
            }
        });
        return true; //Para asegurarse que la respuesta esta gestionada de forma asincrona y el canal no se cierra
    }
	else  if (message != null && message["code"] === "borrarEntradaHistorial"){
		var id = message["id"];
		var jsonRequest= JSON.stringify({'id': id});
		//Hacer la petición a NodeJS
		chrome.storage.local.get(["token"], value => {
			const token= value["token"];
			//Hacer la petición a NodeJS
			makeRequest("POST",
				apiURL + "borrarEntradaConcretaHistorial",
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
		});
		return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
    }
    else  if (message != null && message["code"] === "borrarTodoHistorial"){
        chrome.storage.local.get(["token"], value => {
            const token= value["token"];
            //Hacer la petición a NodeJS
            makeRequest("POST",
                apiURL + "borrarTodoHistorial",
                "",
                [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                xhr => {
                    var resp = JSON.parse(xhr.responseText);
                    callback({result: resp.message});
                },
                () => {
                    //Si ocurre un error del servidor
                    callback({result: "Error del servidor"});
                }
            );

        });
        return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
    }
	else  if (message != null && message["code"] === "borrarEntradaHistorialSeleccionada"){
		var arrayID = message["listIDS"];
		var jsonRequest= JSON.stringify({'listIDS': arrayID});
		//Hacer la petición a NodeJS
		chrome.storage.local.get(["token"], value => {
			const token= value["token"];
			//Hacer la petición a NodeJS
			makeRequest("POST",
				apiURL + "borrarEntradaHistorialSeleccionada",
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
		});
		return true; //Para asegurarse que la respuesta está gestionada de forma asíncrona y el canal no se cierra
	}
});