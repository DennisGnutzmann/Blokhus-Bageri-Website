<?php
$name = $_POST["pickupname"];

$date = $_POST["pickupdate"];

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

$regard = "Website Order: " . $name . " " . $date;

$message = $name . " sent an order for " . $date . ":\n\n" . $cartpretty . "\n" . "Total: " . $price ." DKK" . "\n\n" . "Payment method: " . $paymentmethod;

// use wordwrap() if lines are longer than 70 characters
$message = wordwrap($message,70);

// send email
mail("dennisgnutzmann@outlook.de",$regard,$message);

// redirect to home
header("Location: ../index.html");
exit();
?>