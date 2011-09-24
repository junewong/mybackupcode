#!/bin/bash

# This shell script can convert the file with Chinese name into the name with pinyin.
# It can convert as Upper and lower objects, and genator an txt file as mappping list.
# And then ,it will tar an "tar.gz" file for two type of diretory.
# So enjoy it!
# @author junewong

upper="upper"
lower="lower"
mapping="mapping.txt"

if [ ! -f "$upper" ]; then
	mkdir $upper
fi

if [ ! -f "$lower" ]; then
	mkdir $lower
fi

echo "Try to convert upper files ..."
for i in `ls *.png`; 
do 
	name=`php ~/mybash/pinyin $(echo $i|sed -e 's/\S\+_//g' -e 's/\.\S*$//g') |tr 'a-z' 'A-Z'`;
	echo "$i : $name.png";
	cp $i $upper/$name.png;
done |tee $upper/$mapping
unix2dos $upper/$mapping


echo "Try to convert lower files ..."
for i in `ls *.png`; 
do 
	name=`php ~/mybash/pinyin $(echo $i|sed -e 's/\S\+_//g' -e 's/\.\S*$//g') |tr 'A-Z' 'a-z' `;
	echo "$i : $name.png";
	cp $i $lower/$name.png;
done |tee $lower/$mapping
unix2dos $lower/$mapping

if [ $? = 0 ]; then
	tar -zcvf "$upper.tar.gz" $upper
	tar -zcvf "$lower.tar.gz" $lower
fi
