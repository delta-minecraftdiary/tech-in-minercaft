window.addEventListener('load', function(){
    addImgTag();
});

function getJson(version) {
    let map = new Object();
    $.getJSON("../images/items/items.json", function(data) {
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

    for (let key in itemMap) {
        let extension = "png";
        if (key == "Golden Apple") extension = "gif";
        $("#inventory-items").append(`<img class="drag-image" src="../images/items/${version}/${key}.${extension}">`);
    }
}

function removeImg(){
    const parent = document.getElementById("inventory-items");
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}