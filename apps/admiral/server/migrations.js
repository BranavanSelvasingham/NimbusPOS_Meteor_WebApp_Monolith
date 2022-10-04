Migrations.add({
	version: 1,
	up: function() {
		//code to migrate up to version 1
		let count = 0;
		Orders.find({},{sort: {createdAt: -1}}).forEach(order => {
			// console.log('order date', order.createdAt);
			if(!order.timeBucket){
				let createdDate = new Date(order.createdAt);
				// console.log('ref server date', createdDate);

				let timeBucket = {
					year: createdDate.getFullYear(),
					month: createdDate.getMonth(),
					day: createdDate.getDate(),
					hour: createdDate.getHours(),
				}

				// console.log('timeBucket ', timeBucket);	

				Orders.update(order._id, {$set: {timeBucket: timeBucket}} );

				count ++;
				if(count%100 == 0){
					console.log(count);
				}
			}
		});
		console.log(count);
	} 
});

// console.log('local server date', new Date());

