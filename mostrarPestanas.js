window.onload= ()=>{

    chrome.runtime.sendMessage({"code": "getmostrarPestanas"}, response => {
        if (response.tab != null && response.tab.length > 0){
            for(var i=0 ;i < response.tab.length ;i++){
                var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >"+response.tab[i].index+ "</td><td  border="+2+" >" + response.tab[i].url + "</td></tr>";
                var btn = document.createElement("TR");
                btn.innerHTML=fila;
                document.getElementById("tablita").appendChild(btn);
            }

        }
        else if (response.tab != null && response.tab.length === 0){
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >No hay pestañas almacenadas en la extensión</td><td  border="+2+" ></td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
        }
        else {
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >Ha ocurrido un error al tratar de obtener las pestañas</td><td  border="+2+" ></td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
        }
    });
};