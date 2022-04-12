<script type="text/javascript">
    let cart = [];
    let pickupname = "";
    let pickupdate = "";
    let pickuptime = "";
    let paymentmethod = "";
    let lang = "";

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

    function getTotalPrice() {
        let total = 0;
        for (var i = 0; i < cart.length; i++) {
            total += cart[i].totalprice;
        }
        return total;
    }

    var zplstring = "";
    //zplstring = "^XA^FO50,50^ADN,36,20^FDHello World!^FS^XZ";

    // Label Metadata
    zplstring += "CT~~CD,~CC^~CT~\n" +
        "^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD15^JUS^LRN^CI28^XZ\n";
    // Start of label
    zplstring += "^XA\n";
    // Label-Header
    zplstring += "^MMT\n^PW519\n^LL1423\n^LS0\n" +
        "^FT380,1361^A0I,39,38^FH\^FDBlokhus Bageri^FS\n" +
        "^FO31,1344^GB452,0,8^FS\n" +
        "^FO31,1402^GB452,0,8^FS\n" +
        "^FT367,1309^A0I,28,28^FB202,1,0,C^FH\^FD Aalborgvej 2^FS\n" +
        "^FT367,1275^A0I,28,28^FB202,1,0,C^FH\^FD 9492 Blokhus^FS\n" +
        "^FT367,1241^A0I,28,28^FB202,1,0,C^FH\^FD+45 98 24 85 20^FS\n" +
        "^FO31,1226^GB452,0,8^FS\n" +
        "^FT483,1180^A0I,39,38^FH\^FD" + pickupname + "^FS\n" +
        "^FT483,1132^A0I,39,38^FH\^FDDato: " + new Date(pickupdate).toLocaleDateString() + "     Tid: " + pickuptime + "^FS\n" +
        "^FT483,1084^A0I,39,38^FH\^FDBetaling: " + paymentmethod + "^FS\n" +
        "^FO31,1066^GB452,0,8^FS\n";
    // Label-Body
    var y = 1022; // y-Position of the first product
    var step = 42; // y-difference between products
    var maxitems = 22; // this is how many items fit on the label
    if (cart.length <= maxitems) {
        maxitems = cart.length;
    } else {
        maxitems = 21;
        zplstring += "^FT483,140^A0I,34,33^FH\^FDIkke nok plads, tjek e-mail...^FS\n";
    }
    for (var i = 0; i < maxitems; i++) {
        let product = cart[i];
        zplstring += "^FT483," + y + "^A0I,34,33^FH\^FD" + product.name.slice(0, 29) + "^FS\n" +
            "^FT65," + y + "^A0I,34,33^FH\^FD" + product.amount + "^FS\n";
        y -= step;
    }
    // Label-Footer
    zplstring += "^FO31,107^GB452,0,8^FS\n" +
        "^FT400,62^A0I,39,38^FH\^FDTotal: " + getTotalPrice().toFixed(2) + " DKK^FS\n" +
        "^FO31,38^GB452,0,8^FS\n";
    // More Metadata
    zplstring += "^PQ1,0,1,Y";
    // End of label
    zplstring += "^XZ";

    var tenantid = "4603270a15e1f09d81ba6cd079d8b48f";
    var apikey = "FYXMAed3MujGuCeLGxwi9FbQipQRxNtP";
    var printersn = "D8J221009390";
    var url = "https://api.zebra.com/v2/devices/printers/send";
    //console.log(zplstring);
    var blob = new Blob([zplstring], { type: "text/plain" });
    var file = new File([blob], "order.txt", { type: "text/plain" });
    var http = new XMLHttpRequest();

    http.open("POST", url, true);

    // Set the proper header information for the request, including the API Key.
    // Do not specify the Content-Type header here, as it is implied in 
    http.setRequestHeader("apikey", apikey); // Add API key to the header
    http.setRequestHeader("tenant", tenantid); // Add tenant ID

    http.onreadystatechange = () => { // Call a function when the state changes.
        // if((http.readyState == 4 || http.readyState == 1) && (http.status == 200 || http.status == 500) ) {
        if ((http.readyState == 4 || http.readyState == 1)) {
            //console.log(http.responseText);
            switch (lang) {
                case "da":
                    window.location.replace("../DK-ordrebekræftelse.html");
                    break;
                case "de":
                    window.location.replace("../DE-bestellbestätigung.html");
                    break;
                case "en":
                    window.location.replace("../EN-orderconfirmation.html");
                    break;
                default:
                    window.location.replace("../EN-orderconfirmation.html");
            }
        }
    }

    fd = new FormData();
    fd.append("zpl_file", file); // Attach the file to be sent.

    // Append the printer serial number
    fd.append("sn", printersn);

    http.send(fd);
</script>

<?php
// ---READ DATA---

echo "Sending your order, please be patient...";

$name = $_POST["pickupname"];
$date = date_create($_POST["pickupdate"]);
$date = date_format($date,"d.m.Y");
$time = $_POST["pickuptime"];
$paymentmethod = $_POST["paymentmethod"];
$cart = json_decode($_COOKIE["cart"]);
$cartpretty = "";
$price = 0;
// create String for email and calculate total price
foreach($cart as $jsonDataKey => $jsonDataValue){
    foreach($jsonDataValue as $jsonArrayKey => $jsonArrayValue){
        if ($jsonArrayKey == "name") {
            $cartpretty.= $jsonArrayValue . " ";
        }
        if ($jsonArrayKey == "price") {
            $cartpretty.= $jsonArrayValue . " DKK * ";
        }
        if ($jsonArrayKey == "amount") {
            $cartpretty .= $jsonArrayValue . "\n";
        }
        if ($jsonArrayKey == "totalprice") {
            $price += $jsonArrayValue;
        }
    }
}
$price = number_format((float)$price, 2, '.', '');

// ---SENDFILETOPRINTER API USAGE--- DOES NOT WORK

/* $tenantid = "4603270a15e1f09d81ba6cd079d8b48f";

$apikey = "FYXMAed3MujGuCeLGxwi9FbQipQRxNtP";

$printersn = "D8J221009390";

$url = "https://stage-api.zebra.com/v2/devices/printers/send";

$zplstring = "^XA^FO50,50^ADN,36,20^FDHello World!^FS^XZ";

$zplfile = "order.txt";
file_put_contents($zplfile,$zplstring);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$headers = array("apikey" => "FYXMAed3MujGuCeLGxwi9FbQipQRxNtP","tenant" => "4603270a15e1f09d81ba6cd079d8b48f");
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$dataarray = array("sn"=>"D8J221009390","zpl_file"=>"@order.txt;type=text/plain");
$data = http_build_query($dataarray);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
$resp = curl_exec($curl);
echo $resp;
curl_close($curl); 
exit();
*/

// ---EMAIL---

$regard = $paymentmethod . " bestilling: " . $name . " " . $date . " " . $time;

$message = $name . " sendt en ordre til " . $date . " " . $time . ":\n\n" . $cartpretty . "\n" . "Total: " . $price ." DKK" . "\n\n" . "Betaling: " . $paymentmethod;

// use wordwrap() if lines are longer than 70 characters
$message = wordwrap($message,70);

$header = "From: BlokhusBageri" . "\r\n";
$header .= 'Content-type: text/plain; charset=UTF-8' . "\r\n";

// send email
mail("BlokhusBageriOrders@outlook.com",$regard,$message,$header);

// ---REDIRECT TO CHECKOUT--- Is now handled by Javascript

/* $lang = $_COOKIE["lang"];
if (strcmp($lang, "de") == 0) {
    header("Location: ../DE-bestellbestätigung.html");
    exit();
} else if (strcmp($lang, "da") == 0) {
    header("Location: ../DK-ordrebekræftelse.html");
    exit();
} else {
    header("Location: ../EN-orderconfirmation.html");
    exit();
} */
?>