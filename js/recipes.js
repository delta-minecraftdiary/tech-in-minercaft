window.addEventListener('load', function(){
    addImgTag();
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