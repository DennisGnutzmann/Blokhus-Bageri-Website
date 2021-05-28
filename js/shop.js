let rundstykke = [
    {"name" : "testrundstyk",
     "price" : 10,
     "imageurl": ""
    }
]

let broed = [
    {"name" : "testbroed",
     "price" : 20,
     "imageurl": ""
    }
]

let morgenkager = [
    {"name" : "testkage",
     "price" : 15,
     "imageurl": ""
    }
]

let eftermiddagskager = [
    {"name" : "testkage",
     "price" : 25,
     "imageurl": ""
    }
]

let diverse = [
    {"name" : "sandwich",
     "price" : 27,
     "imageurl": ""
    }
]

function getPriceByName(name,array) {
    return array.find(element => element.name = name).price;
}

function getUrlByName(name,array) {
    return array.find(element => element.name = name).imageurl;
}

function fillTable(array,name) {
    let table = document.getElementById(name);
    for (var i=1; i<=array.length; i++) {
        let row = table.rows[i];
        row.cells[0].innerHTML = array[i-1].imageurl;
        row.cells[1].innerHTML = array[i-1].name;
        row.cells[2].innerHTML = array[i-1].price;
    }
}

function fillTables() {
    fillTable(rundstykke,"rundstykke");
    fillTable(broed,"broed");
    fillTable(morgenkager,"morgenkager");
    fillTable(eftermiddagskager,"eftermiddagskager");
    fillTable(diverse,"diverse");
}

