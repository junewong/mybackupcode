#!/usr/bin/env bash

# 输入一个文本名，生成grep需要的正则表达式，将没一行作为一个查找项

file=$1

cat $file | sed -e "/^$/d" -e "s#^#\\\<#" -e "s/$/\\\>/" |tr "\n" "\\|" | sed -e "s/|$//" -e "s#^#\(#" -e "s/$/\)/"

