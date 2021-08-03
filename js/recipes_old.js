

window.addEventListener('load', function(){
    // addImgTag();
    drawSVG("1.0");
});

function getJson(version) {
    let map = new Object();
    $.getJSON(`../sources/inventory/${version}/recipes/items.json`, function(data) {
        map = data[version];
    });
    return map
}

function getVersion(){
    return document.getElementById("version").value;
}

function addImgTag() {
    removeImg();
    $.ajaxSetup({ async: false });
    const version = getVersion();
    const itemMap = getJson(version);
    $.ajaxSetup({ async: true });

    for (let item in itemMap) {
        let extension = "png";
        if (itemMap[item]["id"] == "Golden Apple") extension = "gif";
        $("#inventory-items").append(`<img class="drag-image" id="${itemMap[item]["id"]}" src="../images/items/${version}/${itemMap[item]["id"]}.${extension} alt="item image of ${itemMap[item]["id"]}">`);
    }
}

function removeImg(){
    const parent = document.getElementById("inventory-items");
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

/* svg force layout */
function drawSVG(version) {
    let json_data;
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    let data_tip = d3.select("#datatip");
    const side_data = d3.select("#side_data");

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const simulation = d3
        .forceSimulation()
        .velocityDecay(0.4)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink().id(function(d) { return d.id; }))
        .force('colllision',d3.forceCollide(40))
        .force('positioningX',d3.forceX())
        .force('positioningY',d3.forceY())
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    const zoom = d3
        .zoom()
        .scaleExtent([1/8,4])
        .on('zoom', SVGZoomed);
    
    svg.call(zoom);
    
    const g = svg.append("g")
        .call(d3.drag()
        .on('drag',SVGDragged))
    
    function SVGZoomed() {
        g.attr("transform", d3.event.transform);
    }
    
    function SVGDragged(d) {
        d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
    };

    const Defs = svg.append("defs");
    const figCircle = Defs
            .append('circle')
            .attr("id","circle")
            .attr('r', 20),
        lenCircle = figCircle.node().getTotalLength(),
        spCircle = figCircle.node().getPointAtLength(0);

    const figRect = Defs.append('rect')
            .attr("id","rect")
            .attr('width', 40)
            .attr('height', 40)
            .attr('rx', 7)
            .attr('ry', 7)
            .attr('x', -(40/2))
            .attr('y', -(30/2)),
        lenRect = figRect.node().getTotalLength(),
        spRect  = figRect.node().getPointAtLength(0);

    d3.json("../recipes/force layout.json", function(error, graph) {
        if (error) throw error;
        json_data = graph;

        const links = g
            .append("g")
            .attr("class", "links")
            .selectAll("g")
            .data(graph.links)
            .enter()
            .append("g")
            .attr("id", "linkArrow")
            .attr("fill", "#999")
            .attr("stroke","#999")
            .on('mouseover', function(d){
                d3.select(this).attr('stroke', 'red');
                data_tip
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY + 20 + "px")
                    .style("z-index", 0)
                    .style("opacity", 1)
                    .style('background-image',function(){
                        return `url("../images/items/${version}/${d.source.image}"), url("../images/items/${version}/${d.target.image}")`;
                    });

                data_tip
                    .select("h2")
                    .style("border-bottom", "2px solid " +color(d.source.group))
                    .style("margin-right", "50px")
                    .text("value:" + 3);

                data_tip
                    .select("p")
                    .text(d.source.id + " to " + d.target.id);
            })
            .on('mousemove', function(){
                data_tip
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY + 20 + "px")
            })
            .on('mouseout', function(){
                d3.select(this).attr('stroke', "#999");
                data_tip.style("z-index", -1).style("opacity", 0)
            })
            .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded));
        
        const marker = links
            .append("marker")
            .attr("id", function(d) { return "mkr" + d.source+d.target })
            .attr("viewBox", "0 0 20 20")
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("refX", 19)
            .attr("refY", 10)
            .attr("orient", "auto-start-reverse");
    
        marker
            .append("path")
            .attr("d", "M0.5,0.75L18.88,10L0.5,19.25z")
            .attr("fill","#ddd")
            .attr("stroke-width", 3)
    
        const link = links
            .append("path")
            .attr("marker-end",function(d) { return "url(#mkr" + d.source+d.target  + ")"})
            .attr("fill","none")
            .attr("stroke-width", 4)

        const node = g
            .append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(graph.nodes)
            .enter()
            .append('g')
            .on('mousedown', setSideData)
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded));
        
        node
            .append("use")
            .attr("xlink:href", "#" + "rect")
            .attr('stroke', '#ccc')
            .attr('fill', function(d) { return color(d.group); })
            .style('stroke-width', '2')
            .on('mouseover', function(d){
                d3.select(this).attr('fill', 'red');
            
                data_tip
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY + 20 + "px")
                    .style("z-index", 0)
                    .style("opacity", 1)
                    .style(
                        'background-image', 
                        function() {
                            if (typeof d.image === "undefined" ) return  `url("../images/items/${version}/Unknown.png")` 
                            else { return `url("../images/items/${version}/${d.image}")`}
                        }
                    );
            
                data_tip
                    .select("h2")
                    .style("border-bottom", "2px solid " +color(d.group))
                    .style("margin-right", "0px")
                    .text(d.id);
            
                data_tip.select("p").text("グループID:" + d.group );
            })
            .on('mousemove', function(){
                data_tip
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY + 20 + "px")
                })
            .on('mouseout', function(){
                d3.select(this).attr('fill', function(d) { return color(d.group); })
            
                data_tip.style("z-index", -1).style("opacity", 0)
            })

        node
            .append('image')
            .attr(
                'xlink:href', 
                function(d) {
                    if (typeof d.image === "undefined") return  `../images/items/${version}/Unknown.png` 
                    else return `../images/items/${version}/${d.image}`
                }
            )
            .attr('width',30)
            .attr('x',-15)
            .attr('y',-10)
        
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation
            .force("link")
            .distance(150)
            .links(graph.links);
    
        simulation
            .force('charge')
            .strength(function(d) {return -300})
    
        simulation
            .force('positioningX')
            .strength(0.04)
    
        simulation
            .force('positioningY')
            .strength(0.04)

        function ticked() {
            link.attr("d", linkArc);

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'});
        }
    });

    function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    
    function dragEnded(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function InputZoom(){
        if (g.attr("transform") == null){
            const trnsf = "translate(0,0) scale(1)"
        }
        else {
            const trnsf = g.attr("transform")
        }
        const pre_pos_str = trnsf.split('(')[1].split(')')[0],
            pre_pos = {x: +pre_pos_str.split(',')[0], y: +pre_pos_str.split(',')[1]},
            pre_k   = trnsf.split('(')[2].split(')')[0],
            pre_c   = {x:+(1-pre_k)*width/2 ,y:+(1-pre_k)*height/2},
            d_pos = {x:(+pre_c.x-pre_pos.x)*(1-pre_k) ,y:(+pre_c.y-pre_pos.y)*(1-pre_k) };
        
        console.log("pre_pos_str:",pre_pos_str);
        console.log("pre_pos:",JSON.stringify(pre_pos));
        console.log("pre_k:",pre_k);
        console.log("pre_c:",JSON.stringify(pre_c));
        console.log("d_pos:",JSON.stringify(d_pos));
        
        const zoom_scale = Math.pow(2,document.getElementById("rng_zoom").value),
            g_c = {x:width/2 , y:height/2},
            pos = {x:-g_c.x-d_pos.x, y:-g_c.y-d_pos.y}
        
        console.log("zoom_scale:",zoom_scale);
        console.log("svg_c:",JSON.stringify(g_c));
        console.log("pos:",JSON.stringify(pos));
        
        svg.transition().call(zoom.transform, transform);
        
        function transform() {
            return d3.zoomIdentity
                .translate(width / 2,height / 2)
                .scale(zoom_scale)
                .translate(-g_c.x, -g_c.y);
        }
    }
    
    function UpdateNodeLink(){
        let link_value = document.getElementById("rng_link").value;
        const node_group = document.getElementById("num_group").value;
    
        d3.select("#r_link_text").text(link_value);
        if (node_group == ""){
            d3.selectAll("#nodefigure").attr("display","inline");
    
            link_value = document.getElementById("rng_link").value;
            d3.selectAll("#linkArrow").attr("visibility",function(d){
                if(d.value >= linkvalue){return "visible"}
                else {return "hidden"}
            })
        }
        else {
            d3.selectAll("#nodefigure").attr("display",function(d){
                if(d.group == node_group){return "inline"}
                else {return "none"}
            })
            d3.selectAll("#linkArrow").attr("visibility",function(d){
                if((d.source.group == node_group)&&(d.target.group == node_group)&&(d.value >= link_value)){return "visible"} 
                else {return "hidden"}
            })
        }
    }

    function OnClickSearch(){
        const search_val = document.getElementById("txt_search").value;
        if (search_val == ""){
            window.alert("検索文字列を入力して下さい")
        }
        else{
            const search_data = json_data.nodes.filter(function(d){if (d.id == search_val) return true})[0]
            if  (typeof search_data === "undefined") {
                window.alert("無効な検索文字列です");
                document.getElementById("txt_search").value = "";
            }
            else {
                svg
                    .transition()
                    .duration(750)
                    .call(zoom.transform, transform(search_data));
                setSideData(search_data);
            }
        }
    }
    
    function transform(d) {
        return d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(4)
            .translate(-d.x, -d.y);
    }

    function setSideData(d){
        side_data
            .style("z-index", 0)
            .style("opacity", 1)
            .style(
                'background-image', 
                function() {
                    if (typeof d.image === "undefined" ) return `url("../images/items/${version}/Unknown.png")`  
                    else return `url("../images/items/${version}/${d.image}")`
                }
            )
        
        side_data.select("h3").text(d.id.replace(/_/g, " "));

        side_data
            .select("#data_memo")
            .attr("srcdoc",function(){
                if (typeof d.memo === "undefined" ){
                    return "<p style='font-size: 11px'></p>"
                }
                else {
                    return "<p style='font-size: 11px'>" +d.memo.replace(/\n/g,"<br>") +"</p>"
                }
            })
        
        side_data
            .select("#data_relation")
            .attr("srcdoc",function(){
                let r_value = "",
                r_target = json_data.links.filter(
                    function(item,index){if(item.source.id == d.id ) return true}
                ),
                r_source =json_data.links.filter(
                    function(item,index){if(item.target.id == d.id ) return true}
                );
                for (var key in r_target) {
                    r_value = r_value + "to: " + r_target[key].target.id.replace(/_/g, " ") + "<br>"
                }
                for (var key in r_source) {
                    r_value = r_value + "from: " + r_source[key].source.id.replace(/_/g, " ") + "<br>"
                }
                return "<p style='font-size: 11px'>" + r_value +"</p>"
            })
    }

    function linkArc(d) {
        const dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy),
            srcPos = getIntersectionPos(d.source , d.target),
            tgtPos = getIntersectionPos(d.target , d.source);
            return "M" + srcPos.x + "," + srcPos.y + "A" + dr + "," + dr + " 0 0,1 " + tgtPos.x + "," + tgtPos.y;
    }
    
    function calcLoengthRate(pos1,pos2,pos3){
        const v21 = {x:pos1.x - pos2.x , y:pos1.y - pos2.y},
            v23 = {x:pos3.x - pos2.x , y:pos3.y - pos2.y},
            x   =  v21.x * v23.x + v21.y * v23.y,
            y   =  v21.x * v23.y - v21.y * v23.x,
            theta = Math.atan2(y,x);
        if ( theta > 0){
          return theta / (2 * Math.PI);
        }
        else {
          return  1 + theta / (2 * Math.PI);
        };
    }
    
    function getIntersectionPos(d1,d2){
        const nodeID = "rect";
        switch (nodeID) {
            case "rect":
                let pos1 = {x:d1.x + spRect.x , y:d1.y + spRect.y},
                    pos2 = {x:d1.x , y:d1.y},
                    pos3 = {x:d2.x , y:d2.y},
                    rate = calcLoengthRate(pos1,pos2,pos3),
                    dpos =  figRect.node().getPointAtLength(lenRect * rate);
                return {x:d1.x + dpos.x, y:d1.y + dpos.y}
            default:
                pos1 = {x:d1.x + spCircle.x , y:d1.y + spCircle.y},
                pos2 = {x:d1.x , y:d1.y},
                pos3 = {x:d2.x , y:d2.y},
                rate = calcLoengthRate(pos1,pos2,pos3),
                dpos =  figCircle.node().getPointAtLength(lenCircle * rate);
                return {x:d1.x + dpos.x, y:d1.y + dpos.y}
        }
    }
}