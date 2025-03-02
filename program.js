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

let btnTrees= document.getElementById("btnTrees");

btnTrees.addEventListener('click',
    async ()=>{
        let myData2= await fetch("arboles_modelia.geojson");
        let myPoints= await myData2.json();

        //Agregar la capa al mapa
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
let btnDistance= document.getElementById("btnDistance");

btnDistance.addEventListener('click',
    async ()=>{
        let myData3= await fetch("arboles_modelia.geojson");
        let myDistance= await myData3.json();
        let trees= myDistance.features.map((myElement, index)=>({
            id: index+1,
            coordinates: myElement.geometry.coordinates
        }));        

        let distances=[];
        trees.forEach( (treeA)=>{trees.forEach(

            
                (treeB)=>{
                    if(treeA.id != treeB.id){
                        let distance = turf.distance( 
                            turf.point(treeA.coordinates),
                            turf.point(treeB.coordinates),
                        );
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
        generatePDF(distances, trees.length);
    }
)

function generatePDF(distances, totalTrees){
    let { jsPDF } = window.jspdf;
    let documentPDF= new jsPDF();   
    
    documentPDF.text("REPORTE DE ÁRBOLES EN EL BARRIO MODELIA", 10,10);

    documentPDF.autoTable(
        {
            head: [['Árbol 1', 'Árbol 2', 'Distance']],
            // como son tantos arboles y tantas distancias opte por solo guardar 100000 FILAS
            body: distances.slice(0,100000),
        }
    );
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