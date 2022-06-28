import * as d3 from 'd3'

// Import des données
import data from '../data/countries.geojson'


// EXERCICE 1
const ex1 = d3.select("body").append("div").attr("id", "ex1");

ex1.append("h1").text("Exercice 1");

const ex1svg = ex1.append("svg").attr("width", "200px").attr("height", "200px");

const ex1grid = ex1svg.append("path").attr("d", "M0 0 L0 100 L10 100 L10 0 L 20 0 L 20 100 L 30 100 L 30 0 L 40 0 L 40 100 L 50 100 L 50 0 L 60 0 L 60 100 L 70 100 L 70 0 L 80 0 L 80 100 L 90 100 L 90 0 L 100 0 L 100 100 L 0 100 L 0 90 L 100 90 L 100 80 L 0 80 L 0 70 L 100 70 L 100 60 L 0 60 L 0 50 L 100 50 L 100 40 L 0 40 L 0 30 L 100 30 L 100 20 L 0 20 L 0 10 L 100 10 L 100 0 L 0 0").attr("stroke", "black").attr("fill", "none");

const ex1drawing = ex1svg.append("path").attr("d", "M 20 10 L 20 70 L 70 70 L 70 10 L 30 10 L 30 60 L 60 60 L 60 30 L 40 30 L 40 50 L 50 50 L 50 40").attr("stroke", "black").attr("stroke-width", "4px").attr("fill", "none");

const ex1drawingCircle = ex1svg.append("circle").attr("cx", "50").attr("cy", "40").attr("r", "5").attr("fill", "red");


// EXERCICE 2

const continentsNames = {
    142: "Asie",
    150: "Europe",
    2: "Afrique",
    9: "Océanie",
    19: "Amériques"
}

const ex2 = d3.select("body").append("div").attr("id", "ex2");

ex2.append("h1").text("Exercice 2");

const populations = data.features.filter(feature => feature.properties.POP2005 > 1000000);

let continents = Array.from(d3.group(populations, d => d.properties.REGION))
    .map(continent => {
        return {
            'code': continentsNames[continent[0]],
            'average': Math.round(continent[1]
                .reduce((acc, curr) => acc + curr.properties.POP2005, 0) / continent[1].length)
        };
    });
console.log("populations", populations);
console.log("continents", continents);

ex2.append("p").text("Pays > 1 million de population " + populations.length);
ex2.append("p").text("Continent " + continents.length);
ex2.append("h5").text("Voir la console pour les détails");




// EXERCICE 3

const ex3 = d3.select("body").append("div").attr("id", "ex3");

ex3.append("h1").text("Exercice 3");

const ex3svg = ex3.append("svg").attr("width", "100vw").attr("height", "300px");

var projection = d3.geoMercator();

var path = d3.geoPath()
    .projection(projection);

console.log([
    d3.min(data.features.map(feature => feature.properties.POP2005)),
    d3.max(data.features.map(feature => feature.properties.POP2005))
]);
var myColor = d3.scaleSqrt()
    .domain([
        d3.min(data.features.map(feature => feature.properties.POP2005)),
        d3.max(data.features.map(feature => feature.properties.POP2005))
    ])
    .range(["white", "blue"])


var tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

ex3svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("data-population", function(d) {
        return d.properties.POP2005;
    })
    .attr("data-country", function(d) {
        return d.properties.NAME;
    })
    .attr("d", path)
    .attr("fill", function(d) {
        return myColor(d.properties.POP2005);
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .on("mouseover", function(d) {
        tooltipDiv.transition()
            .duration(200)
            .style("opacity", 1);
        tooltipDiv.html(this.dataset.country + " " + this.dataset.population)
            .style("left", (d.clientX) + "px")
            .style("top", (d.clientY + 100) + "px");
    })
    .on("mouseout", function(d) {
        tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
    });


// CHART BAR

continents = continents.sort((b, a) => a.average - b.average);

const ex3ChartWidth = 500;
const ex3ChartHeight = 500;

const ex3Chart = d3.select("body").append("div").attr("id", "ex3Chart");

ex3Chart.append("h1").text("Exercice 3 Chart");

const ex3ChartSVG = ex3Chart.append("svg").attr("width", "550px").attr("height", "600px").attr("transform", "rotate(90)");

console.log(continents.map(c => c.code));

var x = d3.scaleBand()
    .range([0, ex3ChartWidth])
    .domain(continents.map(c => c.code))
    .padding(0.2);

ex3ChartSVG.append("g")
    .attr("transform", "translate(0," + ex3ChartHeight + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-13,10)rotate(-90)")
    .style("text-anchor", "end");


// Add Y axis
var y = d3.scaleLinear()
    .domain([0, d3.max(continents.map(c => c.average))])
    .range([ex3ChartHeight, 0]);


ex3ChartSVG.append("g")
    .call(d3.axisLeft(y));

// Bars
ex3ChartSVG.selectAll("mybar")
    .data(continents)
    .enter()
    .append("rect")
    .attr('data-name', d => d.code)
    .attr('data-pop', d => d.average)
    .attr("x", function(d) { return x(d.code); })
    .attr("y", function(d) { return y(d.average); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return ex3ChartHeight - y(d.average); })
    .attr("fill", "#69b3a2")
    .on("mouseover", function(d) {
        tooltipDiv.transition()
            .duration(200)
            .style("opacity", 1);
        tooltipDiv.html(this.dataset.name + " " + this.dataset.pop)
            .style("left", (d.clientX) + "px")
            .style("top", (d.clientY + 500) + "px");
    })
    .on("mouseout", function(d) {
        tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
    });




//EXERCICE 4

/* const url = 'https://heig-vd.ch/formations/bachelor/filieres';


//screenshot
(async() => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto(url)
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
})();

// fillieres 
(async() => {
    const response = await axios.get(url)
    const dom = new JSDOM(response.data);
    let fillieresTd = dom.window.document.querySelectorAll(".liste-formations td");
    //console.log(p[0].querySelectorAll("div.ratings p")[1].getAttribute("data-rating"));
    const fillieresName = [];

    const orientations = [];

    for (const td of fillieresTd) {
        if (td.classList.contains("prog")) {
            fillieresName.push(td.innerText);
        }
    }
    console.log(fillieresName);

    for (const td of fillieresTd) {
        if (td.classList.contains("ori")) {
            orientations.push(td.innerText);
        }
    }

    console.log(orientations);

})(); */