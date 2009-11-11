@echo off

set Path=%CD%\bin\;%Path%

:type
set /P type="请输入下载的图片类型 a)热门图片 b)最新图片 c)指定标签: "

if "%type%" == "a" (
	set url=http://vi.sualize.us/popular/
	goto page
) 
if "%type%" == "b" (
	set url=http://vi.sualize.us/recent/
	goto page
)
if "%type%" == "c" (
	goto tag
)

:: if type is error
echo 输入类型不正确！
goto type

:tag
set /P tag="请输入标签："
set url=http://vi.sualize.us/tag/%tag%/

:page
set /P page="请输入要下载第几页(一个数字)："

:url
set url=%url%?page=%page%

echo 正在从"%url%"获取图片地址...
curl %url% | grep -E "http://vi\.sualize\.us/view/[a-zA-Z0-9./]+" | sed "s#.*\(http://vi\.sualize\.us/view/[a-zA-Z0-9./]\+\).*#\1#g" |xargs curl > tmp\page.html

cat tmp\page.html |grep "<img" |grep -v -E "thumb[0-9]*.visualizeus.com" | grep -v 'class="avatar"' | grep -v "<h3>" | sed 's/.*src="\(http[^\"]\+\).*/\1/g' | sort |uniq > tmp\url_list.txt

echo 开始下载图片...
cd images
wget -c -i ..\tmp\url_list.txt
cd ..

echo 图片已经全部下载到images文件夹中

pause
