Invoices.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Invoices.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});