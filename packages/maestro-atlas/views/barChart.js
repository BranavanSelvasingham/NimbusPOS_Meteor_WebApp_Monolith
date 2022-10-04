// Maestro.Templates.SimpleBarAndPie = "SimpleBarAndPie";

Maestro.Atlas.BarChart = function(id, fData){  
    
    //create a container for the histogram, piechart, and legend
    var dashboardContainer = document.getElementById(id);
    dashboardContainer.setAttribute('class', "row valign-wrapper");

    var containerWidth = $('#'+id).width();

    var hGAvailRes = containerWidth; //(9/10 is a scale down factor for gaps)

    if(!hGAvailRes){console.log('div not yet rendered'); return;}

    //create a container for svg histogram
    // hGContId = id+"_hG";
    // var hGContainer = document.createElement("div");

    // hGContainer.setAttribute("id", hGContId);
    // hGContainer.setAttribute("class", "col s"+hGCol+" valign");

    // dashboardContainer.appendChild(hGContainer);

    var barColor = 'steelblue';
    // function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }
    
    // compute total for each state.
    // fData.forEach(function(d){d.total=d.freq.low+d.freq.mid+d.freq.high;});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = hGAvailRes - hGDim.l - hGDim.r; 
        // hGDim.h = hGAvailRes*1/2 - hGDim.t - hGDim.b;
        hGDim.h = 200;
            
        //create svg for histogram.
        var hGsvg = d3.select("#"+id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { 
                return hGDim.h - y(d[1]); 
            })
            .attr('fill',barColor);
            // .on("mouseover",mouseover)// mouseover is defined below.
            // .on("mouseout",mouseout);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            // var st = fData.filter(function(s){ return s.State == d[0];})[0],
            //     nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            // pC.update(nD);
            // leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            // pC.update(tF);
            // leg.update(tF);
        }
        
        // // create function to update the bars. This will be used by pie-chart.
        // hG.update = function(nD, color){
        //     // update the domain of the y-axis map to reflect change in frequencies.
        //     y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
        //     // Attach the new data to the bars.
        //     var bars = hGsvg.selectAll(".bar").data(nD);
            
        //     // transition the height and color of rectangles.
        //     bars.select("rect").transition().duration(500)
        //         .attr("y", function(d) {return y(d[1]); })
        //         .attr("height", function(d) { return hGDim.h - y(d[1]); })
        //         .attr("fill", color);

        //     // transition the frequency labels location and change value.
        //     bars.select("text").transition().duration(500)
        //         .text(function(d){ return d3.format(",")(d[1])})
        //         .attr("y", function(d) {return y(d[1])-5; });            
        // }        
        return hG;
    }  
    
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){ 
        let tally = Math.round(d.total*100)/100; 
        return [d.label, tally];
    });

    var hG = histoGram(sF); // create the histogram.
};

