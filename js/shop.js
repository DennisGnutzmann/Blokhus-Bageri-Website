let cart = [];
let pickupname = "";
let pickupdate = "";
let pickuptime = "";
let paymentmethod = "";
let lang = "";

function generateTable(array, name) {
  let table = document.getElementById(name);
  //Dynamically create and fill a table based on array size
  for (var i = 1; i <= array.length; i++) {
    //Create new tr
    let row = table.insertRow(i);

    //Add and fill td for image
    let imagecell = row.insertCell(0);
    let img = document.createElement("IMG");
    img.src = array[i - 1].imageurl;
    imagecell.appendChild(img);

    //Add and fill td for name
    let namecell = row.insertCell(1);
    namecell.innerHTML = array[i - 1].name;

    //Add and fill td for price
    let pricecell = row.insertCell(2);
    pricecell.innerHTML = array[i - 1].price.toFixed(2) + ' DKK';

    //Add and fill td for button
    let buttoncell = row.insertCell(3);
    if (array[i - 1].orderable) {
      //Add the button with onclick event
      let button = document.createElement("BUTTON");
      button.type = "button";
      button.innerHTML = "+";
      button.setAttribute("onclick", "addProduct('" + array[i - 1].name + "'," + array[i - 1].price + ",1)");
      buttoncell.appendChild(button);
    } else {
      //Put correct text based on htmls lang attribute
      let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
      switch (lang) {
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
  generateTable(rundstykke, "rundstykke");
  generateTable(broed, "broed");
  generateTable(morgenkager, "morgenkager");
  generateTable(eftermiddagskager, "eftermiddagskager");
  generateTable(diverse, "diverse");
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
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].totalprice;
  }
  return total;
}

function getTotalItems() {
  let total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].amount;
  }
  return total;
}

function addProduct(name, price, amount) {
  let product = new Product(name, price, amount);
  let entry = cart.find(element => element.name == name);
  //Add to cart if product type is not yet in the cart
  if (entry == null) {
    cart.push(product);
    //Otherwise add to existing product amount    
  } else {
    entry.amount = entry.amount + amount;
    entry.totalprice = entry.totalprice + amount * price;
  }
  refreshCart(true);
}

function removeProduct(name) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart.splice(i, 1);
    }
  }
  refreshCart(true);
  updateSendButton();
}

function refreshCart(withButtons) {
  let table = document.getElementById("cart-tbody");
  table.innerHTML = "";
  for (var i = 0; i < cart.length; i++) {
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
    if (withButtons) {
      let button = document.createElement("BUTTON");
      button.type = "button";
      button.innerHTML = "X";
      button.setAttribute("onclick", "removeProduct('" + namecell.innerHTML + "')");
      amountcell.appendChild(button);
    }
  }
  //Recalculate total price
  let totalprice = document.getElementById("total-price");
  let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
  switch (lang) {
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
  setCartCookie();
}

function refreshCartAmount() {
  let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
  switch (lang) {
    case "da":
      document.getElementById("cart-name").innerHTML = 'Din kurv (' + getTotalItems() + ')';
      break;
    case "de":
      document.getElementById("cart-name").innerHTML = 'Dein Korb (' + getTotalItems() + ')';
      break;
    case "en":
      document.getElementById("cart-name").innerHTML = 'Your cart (' + getTotalItems() + ')';
      break;
    default:
      document.getElementById("cart-name").innerHTML = 'Your cart (' + getTotalItems() + ')';
  }
}

function init() {
  getCookie();
  refreshCartAmount();
}

function initOrders() {
  generateTables();
  getCookie();
  refreshCart(true);
}

function initProducts() {
  generateTables();
  getCookie();
  refreshCartAmount();
}

function initCheckout() {
  setLanguageCookie();
  getCookie();
  refreshCart(true);
  getFormCookies();
  setAcceptableInput();
  updateSendButton();
}

function initConfirmation() {
  getCookie();
  refreshCart(false);
  setConfirmationMessage();
  setMobilePayMessage();
  deleteAllCookieInformation();
  refreshCartAmount();
}

function deleteAllCookieInformation() {
  cart = [];
  setCartCookie();
  setNameCookie("");
  setDateCookie("");
  setTimeCookie("");
  setPaymentMethodCookie("");
}

function setCartCookie() {
  document.cookie = "cart=" + JSON.stringify(cart);
}

function setNameCookie(name) {
  document.cookie = "pickupname=" + name;
  pickupname = name;
}

function setDateCookie(date) {
  document.cookie = "pickupdate=" + date;
  pickupdate = date;
}

function setTimeCookie(time) {
  document.cookie = "pickuptime=" + time;
  pickuptime = time;
}

function setPaymentMethodCookie(method) {
  document.cookie = "paymentmethod=" + method;
  paymentmethod = method;
}

function setLanguageCookie() {
  let language = document.getElementsByTagName('html')[0].getAttribute('lang');
  document.cookie = "lang=" + language;
  lang = language;
}

function setFormCookies(form) {
  setNameCookie(form.pickupname.value);
  setDateCookie(form.pickupdate.value);
  setTimeCookie(form.pickuptime.value);
  setPaymentMethodCookie(form.paymentmethod.value)
  updateSendButton()
}

function getFormCookies() {
  document.getElementById("pickupname").value = pickupname;
  document.getElementById("pickupdate").value = pickupdate;
  document.getElementById("pickuptime").value = pickuptime;
  if (paymentmethod == "MobilePay") {
    document.getElementById("dip").checked = false
    document.getElementById("mbp").checked = true;
  } else {
    document.getElementById("dip").checked = true;
    document.getElementById("mbp").checked = false;
  }
}

function getCookie() {
  let cookie = document.cookie;
  if (cookie !== null) {
    var cookieArray = cookie.split(/; */);
    for (var i = 0; i < cookieArray.length; i++) {
      var keyValArr = cookieArray[i].split("=");
      if (keyValArr[0] === "cart") {
        cart = JSON.parse(keyValArr[1]);
      }
      if (keyValArr[0] === "pickupname") {
        pickupname = keyValArr[1];
      }
      if (keyValArr[0] === "pickupdate") {
        pickupdate = keyValArr[1];
      }
      if (keyValArr[0] === "pickuptime") {
        pickuptime = keyValArr[1];
      }
      if (keyValArr[0] === "paymentmethod") {
        paymentmethod = keyValArr[1];
      }
      if (keyValArr[0] === "lang") {
        lang = keyValArr[1];
      }
    }
  }
}

function setAcceptableInput() {
  // set acceptable date, minimum is current day
  var mindate = new Date();
  var dd = mindate.getDate();
  var mm = mindate.getMonth() + 1; //January is 0!
  var yyyy = mindate.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  mindate = yyyy + '-' + mm + '-' + dd;
  document.getElementById("pickupdate").setAttribute("min", mindate);

  // may not order more than a week in advance
  var maxdate = new Date();
  var ddmax = maxdate.getDate();
  ddmax += 7;
  if (ddmax < 10) {
    ddmax = '0' + ddmax
  }
  maxdate = yyyy + '-' + mm + '-' + ddmax;
  document.getElementById("pickupdate").setAttribute("max", maxdate);

  // set acceptable time (opening times)
  document.getElementById("pickuptime").setAttribute("min", "06:00");
  document.getElementById("pickuptime").setAttribute("max", "17:00");
}

// validates the form input and disables the button if necessary
function updateSendButton() {
  let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
  let buttonholder = document.getElementById("buttonholder");
  let warningmessage = document.getElementById("warning-message");
  warningmessage.style.color = "red";
  var inpDate = new Date(pickupdate + " " + pickuptime);
  var currDate = new Date();
  currDate.setHours(currDate.getHours() + 1)
  if (cart.length == 0) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Din indkøbskurv er tom!';
        break;
      case "de":
        warningmessage.innerHTML = 'Ihr Einkaufskorb ist leer!';
        break;
      case "en":
        warningmessage.innerHTML = 'Your shopping cart is empty!';
        break;
      default:
        warningmessage.innerHTML = 'Your shopping cart is empty!';
    }
  } else if (pickupname.length == 0) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Indtast venligst dit navn!';
        break;
      case "de":
        warningmessage.innerHTML = 'Bitte geben sie ihren Namen an!';
        break;
      case "en":
        warningmessage.innerHTML = 'Please enter your name!';
        break;
      default:
        warningmessage.innerHTML = 'Please enter your name!';
    }
  } else if (pickupname.length > 30) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Indtast venligst ikke mere end 30 tegn i navnefeltet!';
        break;
      case "de":
        warningmessage.innerHTML = 'Bitte benutzen sie nicht mehr als 30 Zeichen im Namensfeld!';
        break;
      case "en":
        warningmessage.innerHTML = 'Please do not enter more that 30 characters in the name field!';
        break;
      default:
        warningmessage.innerHTML = 'Please do not enter more that 30 characters in the name field!';
    }
  } else if (pickupdate.length == 0) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Indtast venligst en dato!';
        break;
      case "de":
        warningmessage.innerHTML = 'Bitte geben sie ein Datum an!';
        break;
      case "en":
        warningmessage.innerHTML = 'Please enter a date!';
        break;
      default:
        warningmessage.innerHTML = 'Please enter a date!';
    }
  } else if (pickuptime.length == 0) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Indtast venligst et tidspunkt!';
        break;
      case "de":
        warningmessage.innerHTML = 'Bitte geben sie eine Uhrzeit an!';
        break;
      case "en":
        warningmessage.innerHTML = 'Please enter a time!';
        break;
      default:
        warningmessage.innerHTML = 'Please enter a time!';
    }
  } else if (inpDate < currDate) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Den angivne tid skal være mindst en time i fremtiden!';
        break;
      case "de":
        warningmessage.innerHTML = 'Der angegebene Zeitpunkt muss mindestens eine Stunde in der Zukunft liegen!';
        break;
      case "en":
        warningmessage.innerHTML = 'The provided time has to be at least one hour from now!';
        break;
      default:
        warningmessage.innerHTML = 'The provided time has to be at least one hour from now!';
    }
  } else if ((inpDate.getHours() < 6) || (inpDate.getHours() > 16)) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Det angivne tidspunkt skal være mellem 6:00 og 16:59!';
        break;
      case "de":
        warningmessage.innerHTML = 'Die angegebene Zeit muss zwischen 6:00 und 16:59 liegen!';
        break;
      case "en":
        warningmessage.innerHTML = 'The provided time has to be between 6:00 and 16:59!';
        break;
      default:
        warningmessage.innerHTML = 'The provided time has to be between 6:00 and 16:59!';
    }
  } else if (!(document.getElementById("agreement").checked)) {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" disabled>';
    document.getElementById("submit-button").style.backgroundColor = "grey";
    document.getElementById("submit-button").style.color = "black";
    switch (lang) {
      case "da":
        warningmessage.innerHTML = 'Du skal acceptere vores vilkår for at fortsætte!';
        break;
      case "de":
        warningmessage.innerHTML = 'Sie müssen den Geschäftsbedingungen zustimmen um fortzufahren!';
        break;
      case "en":
        warningmessage.innerHTML = 'You have to agree to our terms to proceed!';
        break;
      default:
        warningmessage.innerHTML = 'You have to agree to our terms to proceed!';
    }
  } else {
    buttonholder.innerHTML = '<input id="submit-button" type="submit" value="Send order!" onclick="sendFileToPrinter()">';
    document.getElementById("submit-button").style.backgroundColor = "var(--background)";
    document.getElementById("submit-button").style.color = "var(--font)";
    if (paymentmethod == "MobilePay") {
      warningmessage.style.color = "black";
      switch (lang) {
        case "da":
          warningmessage.innerHTML = 'Sørg venligst for, at det angivne navn stemmer overens med navnet af den MobilePay-konto, du betaler med!';
          break;
        case "de":
          warningmessage.innerHTML = 'Stellen sie bitte sicher, dass der angegebene Name mit dem bezahlenden MobilePay Account übereinstimmt!';
          break;
        case "en":
          warningmessage.innerHTML = 'Please make sure that the given name matches the name of the MobilePay account you will pay with!';
          break;
        default:
          warningmessage.innerHTML = 'Please make sure that the given name matches the name of the MobilePay account you will pay with!';
      }
    } else {
      warningmessage.innerHTML = "";
    }
  }
  switch (lang) {
    case "da":
      document.getElementById("submit-button").value = 'Sende ordre!';
      break;
    case "de":
      document.getElementById("submit-button").value = 'Bestellung absenden!';
      break;
    case "en":
      document.getElementById("submit-button").value = 'Send order!';
      break;
    default:
      document.getElementById("submit-button").value = 'Send order!';
  }
}

function setConfirmationMessage() {
  let div = document.getElementById("confirmation-message");
  let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
  switch (lang) {
    case "da":
      div.innerHTML = "Din ordre er blevet sendt til os. Kom gerne forbi vores butik (Aalborgvej 2, 9492 Blokhus) "
        + "for at afhente den. Datoen og tidspunktet du valgte var " + pickupdate + " " + pickuptime + ".";
      break;
    case "de":
      div.innerHTML = "Ihre Bestellung wurde an uns gesendet. Bitte kommen sie in unserem Geschäft (Aalborgvej 2, 9492 Blokhus) vorbei "
        + "um sie abzuholen. Datum und Zeit, die sie ausgewählt haben, sind " + pickupdate + " " + pickuptime + ".";
      break;
    case "en":
      div.innerHTML = "Your order has been sent to us. Please come by our shop (Aalborgvej 2, 9492 Blokhus) "
        + "to pick it up. The date and time you chose was " + pickupdate + " " + pickuptime + ".";
      break;
    default:
      div.innerHTML = "Your order has been sent to us. Please come by our shop (Aalborgvej 2, 9492 Blokhus) "
        + "to pick it up. The date and time you chose was " + pickupdate + " " + pickuptime + ".";
  }
}

function setMobilePayMessage() {
  let div = document.getElementById("mobilepay-message");
  if (paymentmethod == "MobilePay") {
    let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
    let totalprice = getTotalPrice();
    div.style.padding = "10px 5px";
    switch (lang) {
      case "da":
        div.innerHTML = '<div>Husk venligst at overføre ' + totalprice + ' DKK til vores MobilePay, inden du afhenter din ordre.</div>'
          + '<img id="mobilepay-img" src="images/MobilePayLogo.png">';
        break;
      case "de":
        div.innerHTML = '<div>Bitte denken sie daran ' + totalprice + ' DKK an unser MobilePay zu überweisen, bevor sie ihre Bestellung abholen.</div>'
          + '<img id="mobilepay-img" src="images/MobilePayLogo.png">';
        break;
      case "en":
        div.innerHTML = '<div>Please remember to transfer ' + totalprice + ' DKK to our MobilePay before picking up your order.</div>'
          + '<img id="mobilepay-img" src="images/MobilePayLogo.png">';
        break;
      default:
        div.innerHTML = '<div>Please remember to transfer ' + totalprice + ' DKK to our MobilePay before picking up your order.</div>'
          + '<img id="mobilepay-img" src="images/MobilePayLogo.png">';
    }
  } else {
    div.innerHTML = '';
  }
}

function buildZPLStringFromData() {
  var zplstring = "";
  //zplstring = "^XA^FO50,50^ADN,36,20^FDHello World!^FS^XZ";

  // Label Metadata
  zplstring += "CT~~CD,~CC^~CT~\n"+
  "^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI28^XZ\n";
  // Start of label
  zplstring += "^XA\n";
  // Label-Header
  zplstring += "^MMT\n^PW519\n^LL1423\n^LS0\n"+
  "^FT380,1361^A0I,39,38^FH\^FDBlokhus Bageri^FS\n"+
  "^FO31,1344^GB452,0,8^FS\n"+
  "^FO31,1402^GB452,0,8^FS\n"+
  "^FT367,1309^A0I,28,28^FB202,1,0,C^FH\^FD Aalborgvej 2^FS\n"+
  "^FT367,1275^A0I,28,28^FB202,1,0,C^FH\^FD 9492 Blokhus^FS\n"+
  "^FT367,1241^A0I,28,28^FB202,1,0,C^FH\^FD+45 98 24 85 20^FS\n"+
  "^FO31,1226^GB452,0,8^FS\n"+
  "^FT483,1180^A0I,39,38^FH\^FD"+pickupname+"^FS\n"+
  "^FT483,1132^A0I,39,38^FH\^FDDato: "+new Date(pickupdate).toLocaleDateString()+"     Tid: "+pickuptime+"^FS\n"+
  "^FT483,1084^A0I,39,38^FH\^FDBetaling: "+paymentmethod+"^FS\n"+
  "^FO31,1066^GB452,0,8^FS\n";
  // Label-Body
  var y = 1022; // y-Position of the first product
  var step = 42; // y-difference between products
  var maxitems = 22; // this is how many items fit on the label
  if (cart.length<=maxitems) {
    maxitems = cart.length;
  } else {
    maxitems = 21;
    zplstring += "^FT483,140^A0I,34,33^FH\^FDIkke nok plads, tjek e-mail...^FS\n";
  }
  for (var i = 0; i<maxitems; i++) {
    let product = cart[i];
    zplstring += "^FT483,"+y+"^A0I,34,33^FH\^FD"+product.name+"^FS\n"+
    "^FT65,"+y+"^A0I,34,33^FH\^FD"+product.amount+"^FS\n";
    y -= step;
  }
  // Label-Footer
  zplstring += "^FO31,107^GB452,0,8^FS\n"+
  "^FT400,62^A0I,39,38^FH\^FDTotal: "+getTotalPrice().toFixed(2)+" DKK^FS\n"+
  "^FO31,38^GB452,0,8^FS\n";
  // More Metadata
  zplstring+="^PQ1,0,1,Y";
  // End of label
  zplstring+="^XZ";
  return zplstring;
}

// <button onclick="sendFileToPrinter()">Send File to Printer</button>

function sendFileToPrinter() {

  var tenantid = "4603270a15e1f09d81ba6cd079d8b48f";
  var apikey = "FYXMAed3MujGuCeLGxwi9FbQipQRxNtP";
  var printersn = "D8J221009390";
  var url = "https://stage-api.zebra.com/v2/devices/printers/send";
  var zplstring = buildZPLStringFromData();
  //console.log(zplstring);
  var blob = new Blob([zplstring], { type: 'text/plain' });
  var file = new File([blob], "order.txt", {type: "text/plain"});
  var http = new XMLHttpRequest();

  http.open("POST", url, true);

  // Set the proper header information for the request, including the API Key.
  // Do not specify the Content-Type header here, as it is implied in 
  http.setRequestHeader("apikey", apikey); // Add API key to the header
  http.setRequestHeader("tenant", tenantid); // Add tenant ID

  /* http.onreadystatechange = () => { // Call a function when the state changes.
    // if((http.readyState == 4 || http.readyState == 1) && (http.status == 200 || http.status == 500) ) {
    if ((http.readyState == 4 || http.readyState == 1)) {
      alert(http.responseText);
    }
  } */

  fd = new FormData();
  fd.append("zpl_file", file); // Attach the file to be sent.

  // Append the printer serial number
  fd.append("sn", printersn);

  http.send(fd);
}