@echo off

set Path=%~dp0\bin\;%Path%
set log_file=%~dp0\Log.txt

echo 进入文件夹：%1
cd /d %1

echo 尝试添加文件夹
find . -type d | sed 's/\\\?CVS$//g' |sort |uniq -c |sed 's/^ \+//g' |grep  "^1" |cut -f 2 | grep -v "^\.$" | xargs cvs add

echo 尝试添加二进制文件:
cvs -n up -d  |grep "^? "  |cut -d " "  -f 2 |grep -E -v -i "Thumbs.db$" |grep -E -i "\.(jpg|jpeg|bmp|png|gif|zip|rar|swf|fla|swc|flv|mp3|wma|wmv|avi|rm|rmvb)$" |grep -v "^\.$" |xargs cvs add -kb 

echo 尝试添加文本文件:
cvs -n up -d  |grep "^? "  |cut -d " "  -f 2 |grep -E -v -i "Thumbs.db$" |grep -v "^\.$" |xargs cvs add

echo 尝试提交所有文件:
cvs -n up -d  |grep -E "^(M|A) "  |cut -d " "  -f 2 |xargs echo  |cvs commit -F %log_file%

echo 提交完毕！
pause
