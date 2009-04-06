<?php

class CAnnotation
{

	var $className;
	var $oReflection;

	function __construct($className)
	{
		$this->className = $className;
		$this->parse($this->className);
	}

	function parse($className)
	{
		$this->oReflection = new ReflectionClass($className);
	}

	function getDocComment()
	{
		$aComment = array();
		$comment = $this->oReflection->getDocComment();
		print_r("comment are : \n");
		print_r($comment);
		$last_offset = 0;
		preg_match_all("/\*\s*@\w+/", $comment, $match, PREG_OFFSET_CAPTURE);
		print_r($match);///
		for ($i = 0; $i <= count($match[0]); $i++)
		{
			if ($i == count($match[0]))
			{
				$offset = strlen($comment);
				print_r("last offset is : -----------------------------  . $offset \n");///
			}
			else
			{
				$offset = $match[0][$i][1];
			}
			$length = $offset - $last_offset - 2;
			$string = substr($comment, $last_offset, $length);
			print_r("string from $last_offset to $offset: \n");///
			print_r($string . "\n");///
			$last_offset = $offset;
			if (preg_match("/^\s*\*\s*@(\w+)\s+(.*)$/", $string, $param))
			{
				print_r('param is : ');///
				print_r($param);///
				$aComment[$param[1]] = trim($param[2]);
			}
		}
		print_r('commnet result is : ');///
		print_r($aComment);///
		return $aComment;
		
	}

}
?>
