#!/bin/bash

url=$1
start=$2
end=$3

id=`echo $url | sed 's/.*\/\([0-9]\+\)_[0-9]\+\.shtml$/\1/g'`
d_url=`echo $url | sed "s/_[0-9]\+\.shtml/_\[$start-$end\]\.shtml/g"`
filename="$id.txt"

echo "Downloading $filename from $d_url ..."

curl $d_url |\
	sed -e 's/<div class="article">/<div id="artical_real">/g' -e 's/<\/h1>/<\/div>/g' |\
		sed -n '/<div.*id="artical_real"/,/<\/div>/p' |\
			sed -e 's/\r//g' -e '/^\s*$/d' -e 's/<\/p>/\n\n/g' -e 's/<[^>]\+>//g' \
				> $filename
