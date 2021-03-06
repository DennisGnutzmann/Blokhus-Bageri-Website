let cart = [];
let pickupname = "";
let pickupdate = "";
let pickuptime = "";
let paymentmethod = "";
let lang = "";
let openinghours = "6:00-18:00";
let cookiesaccepted = false;

function setOpeningHours() {
  let div = document.getElementById("openinghours");
  let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
  switch (lang) {
    case "da":
      div.innerHTML = '<h3>Åbningstider</h3>'+'<span>Hver dag: '+openinghours+'</span>';
      break;
    case "de":
      div.innerHTML = '<h3>Öffnungszeiten</h3>'+'<span>Jeden Tag: '+openinghours+'</span>';
      break;
    case "en":
      div.innerHTML = '<h3>Opening hours</h3>'+'<span>Every day: '+openinghours+'</span>';
      break;
    default:
      div.innerHTML = '<h3>Opening hours</h3>'+'<span>Every day: '+openinghours+'</span>';
  }
}

function generateTable(array, name) {
  let table = document.getElementById(name);
  //Dynamically create and fill a table based on array size
  for (var i = 1; i <= array.length; i++) {
    //Create new tr
    let row = table.insertRow(i);

    //Add and fill td for image
    let imagecell = row.insertCell(0);
    if (array[i - 1].imageurl!=="images/products/") {
      imagecell.innerHTML='<a href="'+array[i - 1].imageurl+'.jpg" target="_blank"><img src="'+array[i - 1].imageurl+' optimized.jpg"></a>';
    } else {
      let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
  switch (lang) {
    case "da":
      imagecell.innerHTML = 'Billedet kommer snart.';
      break;
    case "de":
      imagecell.innerHTML = 'Das Bild folgt bald.';
      break;
    case "en":
      imagecell.innerHTML = 'The picture is coming soon.';
      break;
    default:
      imagecell.innerHTML = 'The picture is coming soon.';
  }
    }

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
      let button1 = document.createElement("BUTTON");
      button1.type = "button";
      button1.innerHTML = "+1";
      button1.setAttribute("onclick", "addProduct('" + array[i - 1].name + "'," + array[i - 1].price + ",1)");
      buttoncell.appendChild(button1);
      let button5 = document.createElement("BUTTON");
      button5.type = "button";
      button5.innerHTML = "+5";
      button5.setAttribute("onclick", "addProduct('" + array[i - 1].name + "'," + array[i - 1].price + ",5)");
      buttoncell.appendChild(button5);
    } else {
      //Put correct text based on htmls lang attribute
      let lang = document.getElementsByTagName('html')[0].getAttribute('lang');
      switch (lang) {
        case "da":
          buttoncell.innerHTML = "Kan ikke bestilles online."
          break;
        case "de":
          buttoncell.innerHTML = "Nicht online bestellbar."
          break;
        case "en":
          buttoncell.innerHTML = "Cannot be ordered online."
          break;
        default:
          buttoncell.innerHTML = "Cannot be ordered online."
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
  if (!cookiesaccepted) {
    return;
  }
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
  setOpeningHours()
  getCookie();
  refreshCartAmount();
  updateAcceptCookieBox();
}

function initOrders() {
  setOpeningHours()
  generateTables();
  getCookie();
  refreshCart(true);
  updateAcceptCookieBox();
}

function initProducts() {
  setOpeningHours()
  generateTables();
  getCookie();
  refreshCartAmount();
  updateAcceptCookieBox();
}

function initCheckout() {
  setOpeningHours()
  setLanguageCookie();
  getCookie();
  refreshCart(true);
  getFormCookies();
  setAcceptableInput();
  updateSendButton();
  updateAcceptCookieBox();
}

function initConfirmation() {
  setOpeningHours()
  getCookie();
  refreshCart(false);
  setConfirmationMessage();
  setMobilePayMessage();
  deleteAllCookieInformation();
  refreshCartAmount();
  updateAcceptCookieBox();
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
  if (!cookiesaccepted) {
    return;
  }
  setNameCookie(form.pickupname.value);
  setDateCookie(form.pickupdate.value);
  setTimeCookie(form.pickuptime.value);
  setPaymentMethodCookie(form.paymentmethod.value);
  updateSendButton();
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
      if (keyValArr[0] === "cookiesaccepted") {
        cookiesaccepted = keyValArr[1];
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
    buttonholder.innerHTML = '<input id="submit-button" type="submit" value="Send order!">';
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
      document.getElementById("submit-button").value = 'Send ordre!';
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
  let date = new Date(pickupdate);
  let datestring = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
  switch (lang) {
    case "da":
      div.innerHTML = "Din ordre er blevet sendt til os. Kom gerne forbi vores butik (Aalborgvej 2, 9492 Blokhus) "
        + "for at afhente den. Datoen og tidspunktet du valgte var " + datestring + " " + pickuptime + ".";
      break;
    case "de":
      div.innerHTML = "Ihre Bestellung wurde an uns gesendet. Bitte kommen sie in unserem Geschäft (Aalborgvej 2, 9492 Blokhus) vorbei "
        + "um sie abzuholen. Datum und Zeit, die sie ausgewählt haben, sind " + datestring + " " + pickuptime + ".";
      break;
    case "en":
      div.innerHTML = "Your order has been sent to us. Please come by our shop (Aalborgvej 2, 9492 Blokhus) "
        + "to pick it up. The date and time you chose was " + datestring + " " + pickuptime + ".";
      break;
    default:
      div.innerHTML = "Your order has been sent to us. Please come by our shop (Aalborgvej 2, 9492 Blokhus) "
        + "to pick it up. The date and time you chose was " + datestring + " " + pickuptime + ".";
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

function setAcceptCookie() {
  document.cookie = "cookiesaccepted=true; expires=Tue, 19 Jan 2038 04:14:07 GMT";
  cookiesaccepted = true;
  updateAcceptCookieBox();
}

function updateAcceptCookieBox() {
  if (cookiesaccepted) {
    let box = document.getElementById("cookieacceptbox");
    box.style.display="none";
    let warning = document.getElementById("activatecookiesinfo");
    warning.style.display="none";
  }
}