#!/bin/bash

#--------------------------------------------------------------------
#
# Download one book from book.ifeng.com and convert into a txt file.
#
#
# usage:
# 		./ifengbooks.sh  [url] [start_index] [end_index] 
#
# e.g.:
# 		./ifengbooks.sh  http://book.ifeng.com/lianzai/detail_2010_03/02/357910_0.shtml 1 3
#--------------------------------------------------------------------

url=$1
start=$2
end=$3

filename=`echo $url |grep -E -o "[^/]+.shtml" |sed 's/\.shtml$/\.txt/g'`
d_url=`echo $url |sed "s/[0-9]\+\.shtml/\[$start-$end]\.shtml/g"`

echo "downloading $filename from $d_url ..."

curl $d_url |\
	sed -e 's/<div class="article/<div class="mainText" id="artical_real"/g' -e 's/<\/h1>/<\/div>/g' |\
		sed -n  '/<div class="mainText" id="artical_real"/,/<\/div>/p' |\
			sed -e 's#</p>#\n#g' -e 's/<[^>]\+>//g' -e '/^\s*$/d'  -e 's///g' \
				> $filename
