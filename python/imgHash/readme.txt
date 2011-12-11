参考: http://www.ruanyifeng.com/blog/2011/07/principle_of_similar_image_search.html

具体的代码实现，可以参见Wote用python语言写的imgHash.py。代码很短，只有53行。使用的时候，第一个参数是基准图片，第二个参数是用来比较的其他图片所在的目录，返回结果是两张图片之间不相同的数据位数量（汉明距离）。
