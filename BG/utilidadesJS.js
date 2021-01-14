//Usado para obtener el dominio de una url
function getMainDomain(href) {
	var mainDomain= null;
	try{
		var url = new URL(href);
		var urlSplit= url.hostname.split(".");
		mainDomain= urlSplit[urlSplit.length - 2];
	}catch(e){}
    return mainDomain;
}

//Usado para actualizar la url de una pestania
function updateTab(tabId, newUrl){
	if (!isNaN(tabId) && tabId > -1){
		chrome.tabs.get(tabId, tab => { //Comprueba si la pestania existe
			if (tab != null && !isNaN(tab.id) && tab.id > -1){
				chrome.tabs.update(tab.id, {url: newUrl});
			}
		});
	}
}

//Usado para mostrar notificaciones por sistema de windows
function showTrayNotification(priority, title, message){
	chrome.notifications.create({type: "basic", priority: priority, requireInteraction: true, iconUrl: "../img/logoChrome.jpg", title: title, message: message});
}

//Usado para hacer solicitudes
//httpMethod -> el metodo http para hacer la solicitud (POST, GET...)
//url -> la url a la que hacer la solicitud
//postParams -> si no se necesita usar "", si se necesita dar un string con los parametros en formato JSON
//headers -> array con los pares de valores con el nombre de la cabecera y su contenido. Ej. [{name: 'cabecera1', value: 'contenidoCabecera1'}, {name: 'cabecera2', value: 'contenidoCabecera2'}]
//functionToRun -> funcion que se ejecuta si la solicitud va bien y ademas recibe el objeto xhr de la conexion
//catchFunction -> funcion que se ejecuta cuando algo va mal, no recibe nada
function makeRequest(httpMethod, url, postParams, headers, functionToRun, catchFunction){
	var xhr = new XMLHttpRequest();
	xhr.onerror = function(e){
		console.log(e);
		catchFunction();
	};
	xhr.open(httpMethod.toUpperCase(), url, true);
	for (var i= 0; i < headers.length; ++i){
		var headerName= headers[i].name;
		var headerValue= headers[i].value;
		xhr.setRequestHeader(headerName, headerValue);
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			try{
				functionToRun(xhr);
			}catch(e){ //Si el servidor tiene algun error
				console.log(e);
				catchFunction();
			}
		}
	}
	xhr.send(postParams);
}

