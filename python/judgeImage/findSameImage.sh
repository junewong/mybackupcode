#!/bin/bash

file1=$1
file2=$2

cat $file1 |while read line
do 
	code=`echo "$line" |cut -f1`
	name=`echo "$line" |cut -f2`
   	haming=`python haming.py $code $file2 4`
	echo $haming	$name
done
