# calculate the haming distance

import os
import sys

def hamming(h1, h2):
	h, d = 0, h1 ^ h2
	while d:
		h += 1
		d &= d - 1
	return h

if __name__ == '__main__':
	if len(sys.argv) <= 2:
		print "Usage: %s code1, code list file name, [limit code]" % sys.argv[0]
	else:
		hashCode, listFile = sys.argv[1], sys.argv[2]
		limit = '.' if len(sys.argv) < 4 else sys.argv[3]
		f = open(listFile)
		for line in f.readlines():
			info = line.split("\t")
			code, filename = info[0], info[1]
			h = hamming(int(hashCode) , int(code))
			if int(limit) > 0 :
				if h <= int(limit):
					print "%d\t%s" % (h, filename)
			else:
				print "%d\t%s" % (h, filename)

