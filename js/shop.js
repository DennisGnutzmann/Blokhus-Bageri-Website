function getPriceByName(name,array) {
    return array.find(element => element.name = name).price;
}

function getUrlByName(name,array) {
    return array.find(element => element.name = name).imageurl;
}

function generateTable(array,name) {
    let table = document.getElementById(name);
    //Dynamically create a table based on array size
    for (var i=1; i<=array.length; i++) {
        let row = table.insertRow(i);
        row.insertCell(0);
        row.insertCell(1);
        row.insertCell(2);
        let buttoncell = row.insertCell(3);
        //Add the button (no functionality yet)
        buttoncell.innerHTML = '<button type="button">+</button>';
    }
    //Fill the table with values from array
    for (var i=1; i<=array.length; i++) {
        let row = table.rows[i];
        row.cells[0].innerHTML = array[i-1].imageurl;
        row.cells[1].innerHTML = array[i-1].name;
        row.cells[2].innerHTML = array[i-1].price;
    }
}

function generateTables() {
    generateTable(rundstykke,"rundstykke");
    generateTable(broed,"broed");
    generateTable(morgenkager,"morgenkager");
    generateTable(eftermiddagskager,"eftermiddagskager");
    generateTable(diverse,"diverse");
}

