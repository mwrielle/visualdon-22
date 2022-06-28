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
    })// 2. Rajouter une info-bulle avec la population du pays quand on y survole avec la souris
    .on("mouseover", function(d) {
        d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", "3")

        svg.transition()
            .duration(100)
            .style("opacity", 1);
        
    })

    .on("mouseleave", function(d) {
        d3.select(this)
        .style("opacity", 0.8)
        .style("stroke", "white")
        .style("stroke-width", "0.3");

        svg.transition()
            .duration(200)
            .style("opacity", 0);
    });


// Bar chart

body.append("div").attr("id", "ex32").append("h3").text("Bar chart");


let margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 90
};
let widthBarChart = 460 - margin.left - margin.right;
let heightBarChart = 400 - margin.top - margin.bottom;

let svgex3 = d3.select("#ex32")
    .append("svg")
    .attr("width", widthBarChart + margin.left + margin.right)
    .attr("height", heightBarChart + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// axe x
let x = d3.scaleLinear()
    .domain([0, 13000])
    .range([0, width]);
svgex3.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// axe y
console.log(continents);
let y = d3.scaleBand()
    .range([ 0, height ])
    .domain(continents.map(function(d) { return d.reduce(function(p, c, index, d){
        return p + c;
    })}))
    .padding(.1);
  svgex3.append("g")
    .call(d3.axisLeft(y))