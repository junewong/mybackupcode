@echo off

set Path=%CD%\bin\;%Path%

:type
set /P type="���������ص�ͼƬ���� a)����ͼƬ b)����ͼƬ c)ָ����ǩ: "

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
echo �������Ͳ���ȷ��
goto type

:tag
set /P tag="�������ǩ��"
set url=http://vi.sualize.us/tag/%tag%/

:page
set /P page="������Ҫ���صڼ�ҳ(һ������)��"

:url
set url=%url%?page=%page%

echo ���ڴ�"%url%"��ȡͼƬ��ַ...
curl %url% | grep -E "http://vi\.sualize\.us/view/[a-zA-Z0-9./]+" | sed "s#.*\(http://vi\.sualize\.us/view/[a-zA-Z0-9./]\+\).*#\1#g" |xargs curl > tmp\page.html

cat tmp\page.html |grep "<img" |grep -v -E "thumb[0-9]*.visualizeus.com" | grep -v 'class="avatar"' | grep -v "<h3>" | sed 's/.*src="\(http[^\"]\+\).*/\1/g' | sort |uniq > tmp\url_list.txt

echo ��ʼ����ͼƬ...
cd images
wget -c -i ..\tmp\url_list.txt
cd ..

echo ͼƬ�Ѿ�ȫ�����ص�images�ļ�����

pause
