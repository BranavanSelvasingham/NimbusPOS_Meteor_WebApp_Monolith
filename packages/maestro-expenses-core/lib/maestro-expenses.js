Maestro.Expenses = {};

Maestro.Expenses.CreateNewExpense = function(newExpense){
    check(newExpense, Maestro.Schemas.Expense);

    var expenseId;

    expenseId = Expenses.insert(newExpense);

    return expenseId;

};

Maestro.Expenses.RemoveExpense = function(expenseId){
    var updated;

    updated = Expenses.remove(expenseId);

};


Maestro.Expenses.Summary = {};

Maestro.Expenses.Summary.AllExpensesForMonth = function(referenceDate){
	let refDate = new Date(referenceDate);
	return Expenses.find({'timeBucket.year': refDate.getFullYear(), 'timeBucket.month': refDate.getMonth()}, {sort: {expenseDate:1}}).fetch() || [];
};

Maestro.Expenses.Summary.MonthlyCategories = function(refDate){
	timeBucket = {
		year: refDate.getFullYear(),
		month: refDate.getMonth()
	};

	let expensesSet = Expenses.find({'timeBucket.year': timeBucket.year, 'timeBucket.month': timeBucket.month}).fetch();

	let uniqueCategories = _.uniq(_.pluck(expensesSet, 'category'));

	let categorySummary = [];

	_.each(uniqueCategories, function(category){
		let categorySet = _.filter(expensesSet, function(expense){
			return expense.category === category;
		});

		let categoryTotal = _.reduce(categorySet, function(memo, expense){
			return memo + expense.amount;
		}, 0.00);

		categorySummary.push({
			category: category,
			total: categoryTotal
		});
	});

	categorySummary = _.sortBy(categorySummary, 'total');
	categorySummary = categorySummary.reverse();

	return categorySummary;
};