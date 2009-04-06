<?php
include_once( "CAnnotation.class.php");
/**
 * test comment explain,
 * now we can test it!
 *
 * @package 
 * @version $id$
 * @copyright 1997-2005 The PHP Group
 * @author Tobias Schlitt <toby@php.net> 
 * @license PHP Version 3.0 {@link http://www.php.net/license/3_0.txt}
 */
class TestClass 
{
	var $p1;
	var $p2;

	function testFunc($a, $b)
	{
	}


}

$oAnnotation = new CAnnotation('TestClass');
$comment = $oAnnotation->getDocComment();

?>
