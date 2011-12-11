# 用于比较两组图片是否相同，并把其中一组在对应的名称上加上后缀，批量改名
# 下面是使用例子

# 生成大图的hash标识
python hashCode.py ~/study/html/research_shangshe/images/* |tee  big.txt

# 生成缩略图图的hash标识
python hashCode.py ~/study/html/research_shangshe/images/thumb/* | thumbs.txt 

# 批量比较汉明距离，找出相同的图片
sh findSameImage.sh big.txt thumbs.txt  |tee result_haming.txt

# 生成改名脚本
sh makeRenameScript.sh  result_haming.txt 

# 如果要测试，可生成html直接查看，后面两个是各自目录的前缀
sh makeHtmlForTest.sh  result_haming.txt  "file:///home/june/study/html/research_shangshe/images/"  ""file:///home/june/study/html/research_shangshe/images/thumb/"

