console.log("Assignment 4-B");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);


plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

var lineGenerator = d3.svg.line()
    .x(function(d){ return scaleX(d.year)})
    .y(function(d){ return scaleY(d.value)})
    .interpolate('basis');

//load data
queue()
    .defer(d3.csv,'data/fao_combined_world_1963_2013.csv', parse)
    .defer(d3.csv,'data/metadata.csv', parseMetadata)
    .await(dataLoaded);


function parse(d) {
    return {
        item: d.ItemName,
        year: +d.Year,
        value: +d.Value
    };
}

function parseMetadata(d){

}




//time to draw
function dataLoaded(error, data, metadata){
    console.log(data);

    var nestedData = d3.nest()
        .key(function(d){return d.item})
        .entries(data);

    console.log(nestedData);

    /*nestedData.forEach(function(t){
        console.log(t.key);

        t.item = t.key;
        t.totalProd = function(t){
            var total = 0;
            t.values.forEach(function(each){total = total + each.value;

            })
            return total;
        }
        t.year = t.year;
    })*/

    plot.append('path')
        .datum(nestedData[0].values)
        .attr('class', 'tea-data-line data-line')
        .attr('d', lineGenerator)

    plot.selectAll('t')
        .data(nestedData[0].values)
        .enter()
        .append('circle')
        .attr('class', 'tea-data-point data-point')
        .attr('r', 3)
        .attr('cx', function(d){return scaleX(d.year);})
        .attr('cy', function(d){return scaleY(d.value);})


    plot.append('path')
        .datum(nestedData[1].values)
        .attr('class', 'coffee-data-point data-line')
        .attr('d', lineGenerator)

    plot.selectAll('t')
        .data(nestedData[1].values)
        .enter()
        .append('circle')
        .attr('class', 'coffee-data-point data-point')
        .attr('r', 3)
        .attr('cx', function(d){return scaleX(d.year);})
        .attr('cy', function(d){return scaleY(d.value);})


}


