<?php
$string = "* @license PHP Version 3.0 {@link http://www.php.net/license/3_0.txt}";
if (preg_match("/^\s*\*\s*@(\w+)\s+(.*)$/", $string, $param))
{
print_r($param);
}

?>
