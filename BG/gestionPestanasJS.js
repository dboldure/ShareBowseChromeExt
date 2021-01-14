chrome.tabs.onCreated.addListener((tab)=>{
    chrome.storage.local.get(["token"], value => {
        if (tab != null && tab.pendingUrl != null) {
                chrome.tabs.get(tab.id, tabs => {
                    var windowId = tabs.windowId;
                    var url = tabs.pendingUrl;
                    var sessionId;
                    if(tabs.sessionId == null){
						sessionId = "global";
					}
                    else {
						sessionId = tabs.sessionId;
					}
                    var index = tabs.index;
                    var jsonRequest = JSON.stringify({'windowId': windowId, 'url': url, 'sessionId': sessionId, 'index': index});
                    const token= value["token"];
                    makeRequest("POST",
                        apiURL + "anadirPestana",
                        jsonRequest,
                        [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                        xhr => {},
                        () => {}
                    );
                });
            return true;
        }
    });
}); 

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    if (message != null && message["code"] === "getmostrarPestanas") { //.js
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No se ha iniciado sesion"});
            } else {
                const token = value["token"];
                //Hacer la petición a NodeJS
                makeRequest("GET",
                    apiURL + "obtenerPestanas",//rTabs.js
                    "",
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({tab: resp.tabbb});//rTabs.js
                    },
                    () => { //Si ocurre un error del servidor
                        callback({result: "Error en el servidor"});
                    }
                );
            }
        });
        return true; //Para asegurarse que la respuesta esta gestionada de forma asincrona y el canal no se cierra
    }
});