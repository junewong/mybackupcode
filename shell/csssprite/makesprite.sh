#!/bin/bash

#--------------------------------------------------------
# make a css sprite picture.
# e.g.
# 	sh mergeimage.sh oldimages/*jpg images/2.jpg > 2.html
#--------------------------------------------------------

pics=""
allSize=""
while [ $# -gt 1 ]
do
	size=`identify $1 |awk -F' ' -v OFS=x '{print $1,$3}'`
	allSize="$allSize ${size##*/}"
	pics="$pics $1"
	shift
done

#make sprite image:
targetpic=$1
convert +append $pics $targetpic

if [ $? = 0 ];then
	#write css:
	offset=0
	echo "<style>"
	for size in $allSize
	do
		filename=${size%%x*}
		width=`echo $size |cut -dx -f 2`
		heigth=${size#*x*x}
		class=${filename%.*}
		#echo $filename $width $heigth $class $offset
		cat <<EOF
	.$class {
		background-image: url($targetpic);
		background-position: -$offset 0;
		width: $width;
		height: $heigth;
	}
EOF
		offset=$(( $offset + $width ))
	done
	echo "</style>"
	#wirte div:
	for size in $allSize
	do
		filename=${size%%x*}
		class=${filename%.*}
		echo "<div class=\"$class\"></div>"
	done

fi
