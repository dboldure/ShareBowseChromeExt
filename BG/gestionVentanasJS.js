chrome.windows.onCreated.addListener((window)=>{
    chrome.tabs.getAllInWindow(window.id , (tabs) =>{
        chrome.storage.local.get(["token"], value => {
            if (window != null && tabs!= null) {
                chrome.windows.get(window.id, windows => {

                    var windowId = window.id;
                    var sessionId;
                    if (windows.sessionId == null){
						sessionId = "global";
					}
                    else{
						sessionId = windows.sessionId;
					}
                    var date = parseInt(new Date().valueOf()/1000).toString();
                    var nTabs = tabs.length;
                    var jsonRequest = JSON.stringify({
                        'windowId': windowId,
                        'sessionId': sessionId,
                        'nTabs': nTabs,
                        'date': date
                    });
                    const token = value["token"];
                    makeRequest("POST",
                        apiURL + "anadirVentana",
                        jsonRequest,
                        [{name: "token", value: token}, {
                            name: 'Content-type',
                            value: 'application/json;charset=UTF-8'
                        }],
                        xhr => {
                        },
                        () => {
                        }
                    );
                });
                return true;
            }
        });
    });
}); 

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    if (message != null && message["code"] === "getMostrarVentanas") {
        chrome.storage.local.get(["token"], value => {
            if (typeof value["token"] === "undefined") { //Si no hay usuario identificado
                callback({result: "No se ha iniciado sesion"});
            } else {
                const token = value["token"];
                //Hacer la petición a NodeJS
                makeRequest("GET",
                    apiURL + "obtenerVentanas",
                    "",
                    [{name: "token", value: token}, {name: 'Content-type', value: 'application/json;charset=UTF-8'}],
                    xhr => {
                        var resp = JSON.parse(xhr.responseText);
                        callback({windows: resp.windowss});
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