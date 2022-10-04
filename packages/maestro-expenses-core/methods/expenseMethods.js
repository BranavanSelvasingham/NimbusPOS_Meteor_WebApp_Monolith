//expenses methods

Meteor.methods({
	createNewExpense: function(newExpense){
        check(newExpense, Maestro.Schemas.Expense);

        var expenseId;

        try{
            expenseId = Expenses.insert(newExpense);
        } catch(e){
            console.log("Error creating expense: " + e);
        }

    },

    removeExpense: function(expenseId, expenseDetails){
        var updated;

        try {
            updated = Expenses.remove(expenseId);
        } catch(e){
            console.log("Error removing expense: " + e);
        }
    },	
});