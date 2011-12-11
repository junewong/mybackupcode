#!/bin/bash
# e.g.
# 	sh makeRenameScript.sh  result_haming.txt

file=$1
cat $file |grep  "\s.*\s" | while read line
do
	oldname=`echo $line| sed "s/\s/\t/g" |cut -f 2`
	newname=`echo $line| sed "s/\s/\t/g" |cut -f 3`
	newname=`echo $newname| sed "s/\./@x2&/g"`
	echo "mv $oldname $newname\n"
done
