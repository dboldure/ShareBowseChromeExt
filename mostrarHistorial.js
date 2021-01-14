window.onload= ()=>{
	const borrarHistorial = document.querySelector('#borrarHistorial');
	borrarHistorial.href = chrome.runtime.getURL("borrarHistorialH.html");
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
		{ "orderable": false, "searchable": true}
    ];
filtrosTabla["order"]= [[0, "asc"]];

chrome.runtime.sendMessage({"code": "getMostrarHistorial"}, response => {
    if (response.history != null && response.history.length > 0){
        for(var i=0 ;i < response.history.length ;i++){
            var fechaAnadido = new Date(response.history[i].addedTime * 1000);
            var fecha = fechaAnadido.getDate() + "/" + (fechaAnadido.getMonth()+1) + "/" + fechaAnadido.getFullYear() + "   " + fechaAnadido.getHours() + ":" + fechaAnadido.getMinutes() + ":" + fechaAnadido.getSeconds();
            var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" id=\"fecha\" >" +response.history[i].url + "</td><td  border="+2+" id=\"URL\" >" + fecha + "</td></tr>";
            var btn = document.createElement("TR");
            btn.innerHTML=fila;
            document.getElementById("tablita").appendChild(btn);
        }
		$('#tablitaExt').DataTable(filtrosTabla);
    } else if (response.history != null && response.history.length === 0){
		var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >No hay historial almacenado</td><td  border="+2+" ></td></tr>";
		var btn = document.createElement("TR");
        btn.innerHTML=fila;
        document.getElementById("tablita").appendChild(btn);
	} else{
		var fila = "<tr align=\"center\" bottom=\"middle\" border="+1+"><td border="+2+" >Ha ocurrido un error al tratar de obtener el historial</td><td  border="+2+" ></td></tr>";
		var btn = document.createElement("TR");
        btn.innerHTML=fila;
        document.getElementById("tablita").appendChild(btn);
	}
});