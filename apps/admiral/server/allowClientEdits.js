BusinessUsers.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Customers.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Employees.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Expenses.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Invoices.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Locations.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
LoyaltyPrograms.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Notes.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Orders.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
ProductAddons.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
ProductCategories.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Products.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Reminders.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 
Tables.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

////////////

BusinessUsers.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Customers.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Employees.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Expenses.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Invoices.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Locations.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
LoyaltyPrograms.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Notes.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Orders.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
ProductAddons.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
ProductCategories.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Products.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Reminders.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
Tables.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});