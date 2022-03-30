let cart = [];

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
        imagecell.appendChild(img);

        //Add and fill td for name
        let namecell = row.insertCell(1);
        namecell.innerHTML = array[i-1].name;

        //Add and fill td for price
        let pricecell = row.insertCell(2);
        pricecell.innerHTML = array[i-1].price.toFixed(2) + ' DKK';

        //Add and fill td for button
        let buttoncell = row.insertCell(3);
        if (array[i-1].orderable) {
           //Add the button with onclick event
           let button = document.createElement("BUTTON");
           button.type = "button";
           button.innerHTML = "+";
           button.setAttribute("onclick","addProduct('"+array[i-1].name+"',"+array[i-1].price+",1)");
           buttoncell.appendChild(button);
        } else {
            //Put correct text based on htmls lang attribute
           let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
           switch(lang) {
            case "da":
            buttoncell.innerHTML = "Kan ikke bestilles."
            break;
            case "de":
            buttoncell.innerHTML = "Nicht bestellbar."
            break;
            case "en":
            buttoncell.innerHTML = "Cannot be ordered."
            break;
            default:
            buttoncell.innerHTML = "Cannot be ordered."
          }
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

function getTotalPrice() {
    let total = 0;
    for (var i=0; i<cart.length; i++) {
        total += cart[i].totalprice;
    }
    return total;
}

function getTotalItems() {
    let total = 0;
    for (var i=0; i<cart.length; i++) {
        total += cart[i].amount;
    }
    return total;
}

function addProduct(name,price,amount) {
    let product = new Product(name,price,amount);
    let entry = cart.find(element => element.name == name);
    //Add to cart if product type is not yet in the cart
    if (entry==null) {
        cart.push(product);
    //Otherwise add to existing product amount    
    } else {
        entry.amount = entry.amount + amount;
        entry.totalprice = entry.totalprice + amount*price;
    } 
    refreshCart();
}

function removeProduct(name) {
    for (var i=0; i<cart.length; i++) {
        if (cart[i].name === name) {
             cart.splice(i,1);
        }
    }
    refreshCart();
}

function refreshCart() {
    let table = document.getElementById("cart-tbody");
    table.innerHTML = "";
    for (var i=0; i<cart.length; i++) {
        //Create new tr
        let row = table.insertRow(i);

        //Add and fill td for name
        let namecell = row.insertCell(0);
        namecell.innerHTML = cart[i].name;

        //Add and fill td for price
        let pricecell = row.insertCell(1);
        pricecell.innerHTML = cart[i].price.toFixed(2) + ' DKK';

        //Add and fill td for price
        let amountcell = row.insertCell(2);
        amountcell.innerHTML = cart[i].amount;
        let button = document.createElement("BUTTON");
        button.type = "button";
        button.innerHTML = "X";
        button.setAttribute("onclick","removeProduct('"+namecell.innerHTML+"')");
        amountcell.appendChild(button);
    }
    //Recalculate total price
    let totalprice = document.getElementById("total-price");
    let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
    switch(lang) {
     case "da":
     totalprice.innerHTML = 'Total: ' + getTotalPrice().toFixed(2) + ' DKK'; 
     break;
     case "de":
     totalprice.innerHTML = 'Gesamt: ' + getTotalPrice().toFixed(2) + ' DKK';
     break;
     case "en":
     totalprice.innerHTML = 'Total: ' + getTotalPrice().toFixed(2) + ' DKK';
     break;
     default:
     totalprice.innerHTML = 'Total: ' + getTotalPrice().toFixed(2) + ' DKK';
   }

    //Recalculate total amount of items
    refreshCartAmount();
    setCookie();
}

function refreshCartAmount() {
    let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
    switch(lang) {
     case "da":
     document.getElementById("cart-name").innerHTML= 'Din kurv ('+getTotalItems()+')'; 
     break;
     case "de":
     document.getElementById("cart-name").innerHTML= 'Dein Korb ('+getTotalItems()+')'; 
     break;
     case "en":
     document.getElementById("cart-name").innerHTML= 'Your cart ('+getTotalItems()+')'; 
     break;
     default:
     document.getElementById("cart-name").innerHTML= 'Your cart ('+getTotalItems()+')'; 
   }
}

function init() {
  getCookie();
  refreshCartAmount();
}

function initOrders() {
  generateTables();
  getCookie();
  refreshCart();
}

function initProducts() {
  generateTables();
  getCookie();
  refreshCartAmount();
}

function initCheckout() {
  getCookie();
  refreshCart();
}

function setCookie() {
  document.cookie = JSON.stringify(cart);
}

function getCookie() {
  let test = document.cookie;
  if (test !== null) {
    cart = JSON.parse(document.cookie);
  }
}

function resetCart() {
  cart = [];
  setCookie();
  //location.reload();
}