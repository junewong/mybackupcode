<?php
$lines = file($argv[1]);

$num = 0;
$small_num = 1;
$expression;
foreach ($lines as $line_num => $line) {
	$line = preg_replace("/$/", "", $line);
	if (preg_match("/^\d+\.*([-,a-z]+)/", $line,  $matchs)) {
		$num = preg_replace("/[^\d]/", "", $line);
		$small_num = 1;
		$expression = $matchs[1];
		if (!preg_match("/^\d+\.*、*[- ,a-z]+$/", $line)) {
			print $line . "\n";
		}

	} else if(preg_match("/^[①②③ ]/", $line)){
		printf("%d.%d %s %s", $num, $small_num, $expression, $line);
		$small_num++;
	} else {
		print $line;
	}
}

?>
