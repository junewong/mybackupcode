<?php
// This script will exchange two number:

$a = 2;
$b =4;
echo $a, '|', $b, "\n"; // 2|4

$a = $a ^ $b;
$b = $a ^ $b;
$a = $a ^ $b;
echo $a, '|', $b, "\n"; // 4|2

$a = $a ^ ($b = ( $a = $a ^ $b) ^ $b);
echo $a, '|', $b, "\n"; // 2|4



?>
