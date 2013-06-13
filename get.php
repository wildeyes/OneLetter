<?php
$url = isset($_GET['url']) ? $_GET['url'] : "";
$ch = curl_init(url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
$result = curl_exec($ch);
echo $result;
?>