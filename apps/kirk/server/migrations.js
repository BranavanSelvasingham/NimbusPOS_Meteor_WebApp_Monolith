Migrations.add({
	version: 1,
	up: function() {
		//code to migrate up to version 1
		let count = 0;
		Orders.find({},{sort: {createdAt: -1}}).forEach(order => {
			// console.log('order date', order.createdAt);
			if(!order.payment.hasOwnProperty('giftCardTotal')){
				let totalRedeemed = null;

				if(!!order.payment.giftCards){
					totalRedeemed = _.reduce(order.payment.giftCards, function(memo, card){
						return memo + card.redeemedAmount;
					}, 0.00);
				}

				Orders.update(order._id, {$set: {'payment.giftCardTotal': totalRedeemed}} );

				count ++;

				if(count%100 == 0){
					console.log(count);
				}
			}
		});
		console.log(count);
	} 
});

Migrations.add({
	version: 2,
	up: function() {
		//code to migrate up to version 1
		let count = 0;
		Expenses.find({},{sort: {expenseDate: -1}}).forEach(expense => {
			// console.log('expense date', expense.createdAt);
			if(!expense.hasOwnProperty('timeBucket')){
				let refDate = new Date(expense.expenseDate);

				let timeBucket = {
					year: refDate.getFullYear(),
					month: refDate.getMonth(),
					day: refDate.getDate(),
					hour: refDate.getHours(),
				};

				Expenses.update(expense._id, {$set: {timeBucket: timeBucket}} );

				count ++;

				console.log(count);
			}
		});
	} 
});

Migrations.add({
	version: 3,
	up: function() {
		//code to migrate up to version 1
		let count = 0;
		Expenses.find({},{sort: {expenseDate: -1}}).forEach(expense => {
			// console.log('expense date', expense.createdAt);
			
			let refDate = new Date(expense.expenseDate);

			let timeBucket = {
				year: refDate.getFullYear(),
				month: refDate.getMonth(),
				day: refDate.getDate(),
				hour: refDate.getHours(),
			};

			Expenses.update(expense._id, {$set: {timeBucket: timeBucket}} );

			count ++;

			console.log(count);

		});
	} 
});

