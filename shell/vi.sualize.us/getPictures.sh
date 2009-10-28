#!/bin/bash

usage()
{
	cat <<EOF
This shell can download picutres from visualizeus website.
Usage:
	./getPictures.sh [options] page
	options:
		-p or --popular : the popular picutres
		-r or --recent  : the recent picutres
		-t or --tag tagName : the picutres of the tag
		-u or --user userName : the picutres of anyone 
		-d or --target-dir : the diretory for storing picutres
EOF
}

usage_and_exit()
{
	usage
	exit
}


# start
if [ $# -lt 1 ];then
	usage_and_exit
fi

while test $# -gt 1
do
	case $1 in
		-p | --popular )
			url=http://vi.sualize.us/popular/
			;;
		-t | --tag )
			shift
			tag=$1
			url=http://vi.sualize.us/search/all/$tag/
			;;
		-r | --recent )
			url=http://vi.sualize.us/recent/
			;;
		-u | --user )
			shift
			username=$1
			url=http://vi.sualize.us/$username/
			;;
		-d | --target-dir )
			shift
			targetdir=$1
			;;
		-h | --help )
			usage_and_exit
			;;
		-* )
			echo "unknow option '$1' !"
			usage_and_exit
			;;
		*)
			break
			;;
	esac
	shift
done

if [ "$url" = "" ];then
	echo "No url options!"
	usage_and_exit
fi

url="$url?page=$1"

echo "try to load $url"
curl $url |grep -E -o http://vi\\.sualize\\.us/view/[a-zA-Z0-9./]+ |xargs curl > page.html

echo "try to get all pirtures page in this page"
cat page.html |grep "<img" |grep -v -E "thumb[0-9]*.visualizeus.com" |grep -E -o '<img src="[^\\"]+"' |grep -E -o 'http://[^"]+' |sort |uniq > url_list.txt


if [ "$targetdir" = "" ];then
	targetdir="images"
fi

currentdir=`pwd`

echo "try to download all images into '$targetdir'"
cd $targetdir
wget -c -i $currentdir/url_list.txt
