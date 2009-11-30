#---------------------------------------------------------------------------------------------
# this will found the relaction between two tv media.
#
# e.g.:
# 	awk -f tvrelation.awk collection_id.txt
#
# and the collection_id.txt include list for user and collection_id, as "113.109.160.22 11429"
#---------------------------------------------------------------------------------------------

BEGIN {
	NF=" ";
	OFS="\t"
	last="";
	#values;
}

{
	user=$1
	col_id=$2
	#print user, col_id

	#if it's the same user, treact this user's info:
	if (user != last) {
		#record key1:key2 and value:
		for (i in usercols) {
			for (j in usercols) {
				if (i == j)
					continue
				else if ( i < j )
					key =  usercols[i] "," usercols[j]
				else
					key =  usercols[j] "," usercols[i]

				if (key in values)
					values[key] ++
				else
					values[key] = 1
			}
		}

		#and then reset array, and push new user info into array:
		split("", usercols)
		usercols[n] = col_id
		
	} else {
		#push into array
		usercols[n++] = col_id
	}
	last=user;
}

END {
	for (key in values) {
		print key, values[key]
	}
}
