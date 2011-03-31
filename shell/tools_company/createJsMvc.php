#!/usr/local/bin/php
<?php
$tpl=<<<EOF
/**
 *
 */
Apps.extend( [mode], {

	_name : '[name]',

	load : function()
	{
		this.[action](this._name);
	},

	run : function([message])
	{
	},

	unload : function()
	{
	}
});
EOF;

$param = $argv[1];
if ($param == '-v') {
	$mode = 'IView';
	$action = 'regView';
	$message = '';
} else if ($param == '-c') {
	$mode = 'ICtrl';
	$action = 'regCtrl';
	$message = 'message';
} else if ($param == '-m') {
	$mode = 'IModel';
	$action = 'regModel';
	$message = 'message';
} else if ($param == '-m') {
}

for ($i = 2; $i < count($argv); $i++)
{
	$maps = array(
		'[name]' => $argv[$i],
		'[mode]' => $mode,
		'[action]' => $action,
		'[message]' => $message,
	);
	$result = str_replace(array_keys($maps), array_values($maps), $tpl);
	echo $result;
	echo "\n\n\n";
}

?>
