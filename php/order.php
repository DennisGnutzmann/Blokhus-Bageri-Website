<?php

// ---READ DATA---

$name = $_POST["pickupname"];

$date = $_POST["pickupdate"];

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

exit(); */



// ---EMAIL---

$regard = $paymentmethod . " Order: " . $name . " " . $date . " " . $time;

$message = $name . " sent an order for " . $date . " " . $time . ":\n\n" . $cartpretty . "\n" . "Total: " . $price ." DKK" . "\n\n" . "Payment method: " . $paymentmethod;

// use wordwrap() if lines are longer than 70 characters
$message = wordwrap($message,70);

$header = "From: BlokhusBageri" . "\r\n";
$header .= 'Content-type: text/plain; charset=UTF-8' . "\r\n";

// send email
mail("BlokhusBageriOrders@outlook.com",$regard,$message,$header);

// ---REDIRECT TO CHECKOUT---

$lang = $_COOKIE["lang"];
if (strcmp($lang, "de") == 0) {
    header("Location: ../DE-bestellbestätigung.html");
    exit();
} else if (strcmp($lang, "da") == 0) {
    header("Location: ../DK-ordrebekræftelse.html");
    exit();
} else {
    header("Location: ../EN-orderconfirmation.html");
    exit();
}
?>