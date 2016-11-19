#!/usr/bin/env bash

# 从一个关键词列表中过滤出指定文件的数据
#
# e.g.:
#     过滤包含的数据
#     grep-by-dict.sh pack_games_data_id.txt disable_english.csv 
#
#     过滤出没有包含数据
#     grep-by-dict.sh -v pack_games_data_id.txt disable_english.csv 


param="-E"

dict=$1
if [[ "$dict" = "-v" ]]; then
	param="-Ev"
	shift
	dict=$1
fi

shift
file=$*
grep $param `create-grep-dict.sh $dict` $file
