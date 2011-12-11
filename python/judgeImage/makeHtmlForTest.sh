#!/bin/bash

file=$1
preURL1=$2
preURL2=$3

cat $file |while read line
do
	oldname=`echo $line| sed "s/\s/\t/g" |cut -f 2`
	newname=`echo $line| sed "s/\s/\t/g" |cut -f 3`
	echo "<div>"
	echo "<span>"
	echo "<img src='$preURL1$oldname' height='150'/>"
	echo "$oldname"
	echo "<img src='$preURL2$newname' height='150'/>"
	echo "$newname"
	echo "</span>"
	echo "</div>"
done
