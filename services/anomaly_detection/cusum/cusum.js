const math = require('mathjs');

module.exports = {

	cusum: async function(data, options) {	
		var points = data.map(d => options.attributes.map(a => d[a]));		
		var flattenedPoints = [].concat.apply([],points); // flatten the points array		
		// select first 20% of the elements of the initial dataset to be the training dataset		
		var trainingDataSize=math.round(options.training_data_percentage*flattenedPoints.length);				
		var trainingData=flattenedPoints.slice(0,trainingDataSize);
		
		// compute mean and standard deviation on the training dataset
		var trainingDataAvg = trainingData.reduce((a,b) => a + b, 0) / trainingData.length // compute mean   
		var trainingDataStd = math.std(trainingData); // find std of all points in the array		
		var threshold = math.round(options.threshold_factor*trainingDataStd); // 3 is an empirically chosen value; 5 is proposed in the literature	
				
	//	var scores = discrepancies.slice(); //  the slice() operation clones the array and returns a reference to a new array
		var high_sum = flattenedPoints.slice();
		var low_sum = flattenedPoints.slice();	
	
	// calculate high sum 	
		var high_sum=high_sum.map(function(elem,index,arr)	{			
	    	if (index == 0){
				arr[index]=0;
			}        		  
			else {
				let tmp=arr[index-1]+elem-trainingDataAvg-4*trainingDataStd; // k=4*σ empirically, k=σ, didn'y yield correct outliers           		
				if (tmp > 0){
				   arr[index]=tmp;
				}
				else {
					 arr[index]=0;
				}
		  }		  		
			  return arr[index];
		}	
		) 		
		
	// calculate low sum 
		var low_sum=low_sum.map(function(elem,index,arr)	{
			if (index == 0){
				arr[index]=0;
			}        		  
			else {
				let tmp=arr[index-1]+elem-trainingDataAvg+4*trainingDataStd; // k=4*σ empirically, k=σ, didn'y yield correct outliers           		
				if (tmp < 0){
						arr[index]=tmp;
				}
				else {
						arr[index]=0;
				}
			}		  		
				return arr[index];
		}	
		) 				
		
	/* Compare each score array element with threshold to find if the score is an anomaly or not		  
	*/	
	var dataEnhanced = data.map((d, i) => ({
		...d,
		highsum: high_sum[i],
		lowsum: low_sum[i],				
		anomalyLabel: (high_sum[i] > threshold || low_sum[i] <-threshold) ? "Outlier" : "Normal"
	}));			
	return dataEnhanced; // return data				

 }     
};
