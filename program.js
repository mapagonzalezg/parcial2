var map = L.map('map').setView([4.669450147376564, -74.11759330312128], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// fetch es para obtener algo, await es funcion asincronica
async function loadPolygon(){
    let myData= await fetch('modelia.geojson');
    let myPolygon= await myData.json();
    L.geoJSON(myPolygon,
        {
            style:{
                color:"blue"
            }
        }
    ).addTo(map);
}
loadPolygon();
//Obtiene el elemento HTML con el id="btnTrees" y lo guarda en la variable btnTrees.
let btnTrees= document.getElementById("btnTrees");
//Agrega un evento de clic al botón.Cuando el usuario haga clic, se ejecutará una función asíncrona.
btnTrees.addEventListener('click',
    async ()=>{
//Usa fetch() para descargar el archivo arboles_modelia.geojson.await indica que el código debe esperar a que la solicitud se complete antes de continuar.
        let myData2= await fetch("arboles_modelia.geojson");
        let myPoints= await myData2.json();
//Convierte la respuesta obtenida en un objeto JSON.
        //Agregar la capa al mapa
        //Crea una capa GeoJSON a partir de myPoints y la agrega al mapa.pointToLayer define cómo se mostrarán los puntos en el mapa
        L.geoJSON(
            myPoints,
            {
                pointToLayer: (feature, latlong)=>{                    
                    return L.circleMarker(latlong,{
                        radius:5,
                        fillColor:'green',
                        weight:1,
                        opacity:1,
                        fillOpacity: 0.5,
                    })
                }
            }
        ).addTo(map);
    }
)
//Obtiene el botón con id="btnDistance" y lo guarda en la variable btnDistance.
let btnDistance= document.getElementById("btnDistance");

btnDistance.addEventListener('click',
    async ()=>{
//Descarga el archivo arboles_modelia.geojson y lo convierte a JSON.
        let myData3= await fetch("arboles_modelia.geojson");
        let myDistance= await myData3.json();
//Recorre los árboles y los almacena en trees, asignándoles: id: Un número único para cada árbol y coordinates: Las coordenadas geográficas del árbol.
//Este GeoJSON tiene un array de features, donde cada Feature representa un árbol con sus coordenadas
//Accede a la lista de puntos (árboles) dentro del GeoJSON.Usa .map() para recorrer cada árbol y transformar sus datos.
//map transforma cada elemento en un nuevo formato y devuelve un nuevo array foreach solo lo recorreria
        let trees= myDistance.features.map((myElement, index)=>({
            id: index+1,
//En el GeoJSON, la estructura geometry contiene las coordenadas del árbol
            coordinates: myElement.geometry.coordinates
        }));        
//Crea un array vacío distances para almacenar los resultados de las distancias.
        let distances=[];
//Usa dos forEach() anidados para comparar cada árbol con todos los demás.
//primer forach trees es un array de árboles con coordenadas, generado en el código anterior.treeA representa un árbol de la lista en cada iteración.
//Segundo forEach(): comparar treeA con todos los demás árboles (treeB)
        trees.forEach( (treeA)=>{trees.forEach(
                (treeB)=>{
//Evita comparar un árbol consigo mismo.
                    if(treeA.id != treeB.id){
//Usa Turf para calcular la distancia entre treeA y treeB.
//Convierte las coordenadas del árbol A y árbol B en un punto geográfico.
                        let distance = turf.distance( 
                            turf.point(treeA.coordinates),
                            turf.point(treeB.coordinates),
                        );
//Guarda la distancia calculada en distances.toFixed(3): Redondea la distancia a 3 decimales.
//El método .push() en JavaScript agrega un nuevo elemento al final de un array.
// En este caso, distances.push([...]) está agregando un array con tres elementos (Árbol A, Árbol B, distancia) a la lista distances.
//Árbol ${treeA.id} → Nombre del primer árbol.Árbol ${treeB.id} → Nombre del segundo árbol.
                        distances.push(
                            [
                                `Árbol ${treeA.id}`,
                                `Árbol ${treeB.id}`,
                                distance.toFixed(3)                            
                            ]
                        )
                }
            }
            )
        }
        )
//Llama a generatePDF() para crear un reporte en PDF con las distancias calculadas.
        generatePDF(distances, trees.length);
    }
)
//Define la función generatePDF(), que recibe: distances: Lista de distancias calculadas y totalTrees: Número total de árboles.
function generatePDF(distances, totalTrees){
    let { jsPDF } = window.jspdf;
    let documentPDF= new jsPDF();   

//Agrega un título en la posición (10,10) del PDF.
    documentPDF.text("REPORTE DE ÁRBOLES EN EL BARRIO MODELIA", 10,10);

    documentPDF.autoTable(
        {
//Encabezado: Árbol 1, Árbol 2, Distancia.Máximo 100,000 filas para evitar que el PDF sea muy grande.
            head: [['Árbol 1', 'Árbol 2', 'Distance']],
            // como son tantos arboles y tantas distancias opte por solo guardar 100000 FILAS
            body: distances.slice(0,100000),
        }
    );
//Guarda el archivo como modelia.pdf.
    documentPDF.save("modelia.pdf");
}

let btnSiniestros= document.getElementById("btnSiniestros");


btnSiniestros.addEventListener('click',
    async ()=>{
        let myData4= await fetch("siniestro_modelia.geojson");
        let myPoints2= await myData4.json();

        //Agregar la capa al mapa
        L.geoJSON(
            myPoints2,
            {
                pointToLayer: (feature, latlong)=>{                    
                    return L.circleMarker(latlong,{
                        radius:5,
                        fillColor:'red',
                        weight:1,
                        opacity:1,
                        fillOpacity: 0.5,
                    })
                }
            }
        ).addTo(map);
    }
)