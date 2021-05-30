function getPriceByName(name,array) {
    return array.find(element => element.name = name).price;
}

function getUrlByName(name,array) {
    return array.find(element => element.name = name).imageurl;
}

function generateTable(array,name) {
    let table = document.getElementById(name);
    //Dynamically create and fill a table based on array size
    for (var i=1; i<=array.length; i++) {
        //Create new tr
        let row = table.insertRow(i);
        
        //Add and fill td for image
        let imagecell = row.insertCell(0);
        let img = document.createElement("IMG");
        img.src = array[i-1].imageurl;
        imagecell = img;

        //Add and fill td for name
        let namecell = row.insertCell(1);
        namecell.innerHTML = array[i-1].name;

        //Add and fill td for price
        let pricecell = row.insertCell(2);
        pricecell.innerHTML = array[i-1].price;

        //Add and fill td for button
        let buttoncell = row.insertCell(3);
        if (array[i-1].orderable) {
           //Add the button with onclick event
           buttoncell.innerHTML = '<button type="button" onclick=addProduct("'+array[i-1].name+'",'+array[i-1].price+',1) >+</button>';
        } else {
           buttoncell.innerHTML = "Cannot be ordered."
        }
    }
}

function generateTables() {
    generateTable(rundstykke,"rundstykke");
    generateTable(broed,"broed");
    generateTable(morgenkager,"morgenkager");
    generateTable(eftermiddagskager,"eftermiddagskager");
    generateTable(diverse,"diverse");
} 

class Product {
    constructor(name, price, amount) {
      this.name = name;
      this.price = price;
      this.amount = amount;
      this.totalprice = this.price * this.amount;
    }
  }

let cart = [];

function addProduct(name,price,amount) {
    let product = new Product(name,price,amount);
    let entry = cart.find(element => element.name == name);
    if (entry==null) {
        cart.push(product);
    } else {
        entry.amount = entry.amount + amount;
        entry.totalprice = entry.totalprice + amount*price;
    } 
    refreshCart();
}

function refreshCart() {
    document.getElementById("cartlist").innerHTML = "";
    for (var i = 0; i<cart.length;i++) {
        let li = document.createElement("LI");
        var text = document.createTextNode(cart[i].name + "   " + cart[i].amount + "   " + cart[i].totalprice);
        li.appendChild(text);
        document.getElementById("cartlist").appendChild(li);
    }
}
