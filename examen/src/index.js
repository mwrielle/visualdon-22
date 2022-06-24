import * as d3 from 'd3'

// Import des données
import data from '../data/countries.geojson';

let body = d3.select("body");
body.append("h1").text("Examen à blanc");

/// 01 - SVG ///

body.append("div").attr("id", "ex1").append("h2").text("01 - SVG");

const cellWidth = 10;
const cellHeight = 10;

const grid = d3.select("#ex1")
    .append("svg")
    .attr("width", "100px")
    .attr("height", "100px")
    .style("fill", "white");

for (let i = 0; i < 100; i += 10) {
    for (let j = 0; j < 100; j += 10) {
        grid.append("rect").attr("x", j).attr("y", i).attr("width", cellWidth).attr('height', cellHeight).attr("stroke", "black");
    }

}

grid.append("path").attr("d", "M 20 10 V 70 H 70 V 10 H 30 V 60 H 60 V 30 H 40 V 50 H 50 V 40").attr("fill", "none").attr('stroke', 'black').attr('stroke-width', '2px');
grid.append("circle").attr("cx", 50).attr("cy", 40).attr("r", 5).attr("fill", "red");

/// 02 - Données ///

body.append("div").attr("id", "ex2").append("h2").text("02 - Données");

let countriesWith1mioPop = data.features.filter(function (d) {
    return d.properties.POP2005 > 1000000
});

console.log("Pays avec plus de 1 MIO d'habitants : ");
console.log(countriesWith1mioPop);
d3.select("#ex2").append("p").text("Ouvrir la console pour voir le tableau de pays avec plus de 1 mio d'habitants");

const continentsNames = {
    142: "Asie",
    150: "Europe",
    2: "Afrique",
    9: "Océanie",
    19: "Amériques"
}

let continents = Array.from(d3.group(countriesWith1mioPop, d => d.properties.REGION));
let pop = 0;
continents.forEach(continent => {
    continent[1].forEach(pays => {
        pop += pays.properties.POP2005;
    });
    pop = pop / continent[1].length;
    d3.select("#ex2").append("p").text(continentsNames[continent[0]] + " : " + Math.round(pop));
    pop = 0;
});

/// 03 - Visualisation ///

body.append("div").attr("id", "ex3").append("h2").text("03 - Visualisations").append("h3").text("Chloropleth map");



let width = screen.availWidth;
let height = screen.availHeight - 100;

const svg = d3.select("body").append('svg').attr("width", width).attr("height", height);

// Projection et carte
const projection = d3.geoMercator()
    .center([0, 10])
    .scale([width / (2 * Math.PI)])
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);


// Données


let myColor = d3.scaleSqrt()
    .domain([
        d3.min(data.features.map(feature => feature.properties.POP2005)),
        d3.max(data.features.map(feature => feature.properties.POP2005))
    ])
    .range(["white", "blue"])


// Affiche la map
svg.append("g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    // Pour chaque pays, append un path
    .attr("d", path)
    // En fonction de l'espérance de vie, rend une couleur
    .attr("fill", function (d) {
        return myColor(d.properties.POP2005);
    });