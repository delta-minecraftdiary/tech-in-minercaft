function getVersion() {
    return "1.0"
}

/*function getItemMap(ver) {
    let map = new Object();
    $.getJSON("../images/items/items.json", function(data) {
        map = data[ver];
    });
    return map;
}

function addItemImage() {
    const ver = getVersion();
    const parent = document.getElementById("inventory-items");
    let nameMap = new Object();
    const getJson = function () {
        $.getJSON("../images/items/items.json", function (data) {
            console.log(data[ver]);
            nameMap = data[ver];
        });
    };
    const getMap = function(callback) {
        callback();
    };
    getMap(getJson);

    // const nameMap = getItemMap(ver);
    console.log(nameMap);
    for (let index in nameMap) {
        console.log(index);
        let img = document.createElement("img");
        img.className = "drag-image";
        let expansion = "png";
        if (nameMap[index] == "Golden Apple") expansion = "gif";
        img.src = `../images/items/${ver}/${nameMap[index]}.${expansion}`;
        parent.appendChild(img);
    }
}*/

const getJSON = function(ver) {
    let map = new Object();
    $.getJSON("../images/items/items.json", function(data) {
        map = data[ver];
    });
    return map;
}

const getItemMap = function(callback) {
    return callback();
}

function addImgTag() {
    const ver = getVersion();
    const itemMap = getItemMap(function() {
        getJSON(ver);
    });

    for (let key in itemMap) {
        $("#inventory-items").append(`<img class="drag-image" src="../images/items/${ver}/${key}.${extension}">`);
    }
}