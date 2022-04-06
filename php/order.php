<?php
$name = $_POST["pickupname"];

$date = $_POST["pickupdate"];

$time = $_POST["pickuptime"];

$paymentmethod = $_POST["paymentmethod"];

$cart = json_decode($_COOKIE["cart"]);

$cartpretty = "";

$price = 0;

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

$regard = $paymentmethod . " Order: " . $name . " " . $date . " " . $time;

$message = $name . " sent an order for " . $date . " " . $time . ":\n\n" . $cartpretty . "\n" . "Total: " . $price ." DKK" . "\n\n" . "Payment method: " . $paymentmethod;

// use wordwrap() if lines are longer than 70 characters
$message = wordwrap($message,70);

$header = "From: BlokhusBageri" . "\r\n";
$header .= 'Content-type: text/plain; charset=UTF-8' . "\r\n";

// send email
mail("BlokhusBageriOrders@outlook.com",$regard,$message,$header);

// redirect to correct order confirmation page
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

// redirect to home
// header("Location: ../index.html");
// exit();
?>