#!/bin/bash
filename=$1
date=$2
cat $filename |iconv -f utf-8 -t gbk -c  |sed 's/></>\n</g' |grep "completed=\"0\".*$date" | grep -o -E 'title="[^"]+' |sed 's/^title="//g'
