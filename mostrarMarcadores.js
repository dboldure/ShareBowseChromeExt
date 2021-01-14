window.onload= ()=>{
	const crearMarcadores = document.querySelector('#anadirMarcadoresManualmente');
	crearMarcadores.href = chrome.runtime.getURL("anadirMarcadoresManualmente.html");
	
	const editarMarcadores = document.querySelector('#editarMarcadores');
	editarMarcadores.href = chrome.runtime.getURL("editarMarcadoresH.html");
	
	const borrarMarcadores = document.querySelector('#borrarMarcadores');
	borrarMarcadores.href = chrome.runtime.getURL("borrarMarcadores.html");
};

const filtrosTabla = {
    "language": {
        "emptyTable": "No hay registros para mostrar",
        "lengthMenu": "Mostrar _MENU_ registros por página",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Búsqueda",
        "zeroRecords": "No se han encontrado coincidencias",
        "paginate": {
            "first":      "Primera",
            "last":       "Última",
            "next":       "Siguiente",
            "previous":   "Anterior"
        },
        "info": "Mostrando página _PAGE_ de _PAGES_",
        "infoEmpty": "No hay registros disponibles",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "aria": {
            "sortAscending":  ": activar para ordenar de forma ascendente",
            "sortDescending": ": activar para ordenar de forma descendente"
        }
    }
};
filtrosTabla["columns"] = [
        { "orderable": true, "searchable": true},
		{ "orderable": true, "searchable": true}
    ];
filtrosTabla["order"]= [[0, "asc"]];

chrome.runtime.sendMessage({"code": "getmostrarMarcadores"}, response => {
    if (response.bookmarks != null && response.bookmarks.length > 0){
        response.bookmarks.sort(function (o1,o2) {
            if (o1.name > o2.name) {
                return 1;
            } else if (o1.name < o2.name) {
                return -1;
            }
            return 0;
        });
        for(var i=0 ;i < response.bookmarks.length ;i++){
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >"+response.bookmarks[i].name+ "</td><td  border="+2+" >" + response.bookmarks[i].url + "</td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
        }
		$('#tablitaExt').DataTable(filtrosTabla);
    } else if (response.bookmarks != null && response.bookmarks.length === 0){
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >No hay marcadores almacenados en la extensión</td><td  border="+2+" ></td></tr>";
			var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
	} else {
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >Ha ocurrido un error al tratar de obtener los marcadores</td><td  border="+2+" ></td></tr>";
			var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
	}
});