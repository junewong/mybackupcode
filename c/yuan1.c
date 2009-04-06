float compareNum(int compare, float score, int success, int time)
{
	float nums[31] = {7904.14, 8724.27, 9837.65, 11531.2, 51960, 10156.06, 16041.32, 9288.94, 23836.56, 2424.33, 4101, 71128.27, 13435.89, 7196.37, 4344.23, 18022, 9003.19, 7998.71, 2657.50, 8105.93, 9719.81, 8885.47, 9003.19, 2657.50, 6647.56, 9719.81, 2784.33, 8105.93, 2768.87, 8399.54, 7998.71};

	float offset = 100;

	int i;

	if (time < 5)
	{   
		for (i=0; i < 31; i++)
		{
			score = score + nums[i];
			/*printf("%f+%f%f\n", score, nums[i], score);*/
			/*printf("score: %f and num is: %f and success is : %d and time is: %d\n", score, nums[i], success, time);*/
			int j = score - compare;
			if ( (j > 0 && j <= offset) || (j < 0 && j >= -1 * offset))
			{
				printf("\tcompare %f and score %f\n", score, compare);
				success = 1;
			}
			else
			{
				compareNum(score, compare, success, time++);
			}
			if (success == 1)
			{
				printf("%f\t", nums[i]);
			}
		}
	}   

}

