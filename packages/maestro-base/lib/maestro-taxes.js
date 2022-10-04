Maestro.Tax = {};

// Tax Rules 
Maestro.Tax.Rules = {
    taxed: function(orderItem) {
        return true;
    },
    notTaxed: function(orderItem) {
        return false;
    },
    minimumQuantity: function(orderItem) {

    }
};

var addToSubtotal = function(subtotal, orderItem) {
    return subtotal + Maestro.POS.Tools.getItemTotal(orderItem);
};

var addToQuantity = function(quantity, orderItem){
    return quantity + orderItem.quantity;
};

var getTaxableItems = function(orderItemsList) {
    return _.filter(orderItemsList, isProductTaxable);
};

var isProductTaxable = function(orderItem) {
    let taxRule = orderItem.product.taxRule;
    if(taxRule == "TAXED"){ return true;} // temporary measure to deal with old tax classification
    return Maestro.Tax.Types.get(taxRule, "taxable", false);
};

var isProductRetailTaxed_Standard = function(orderItem) { 
    let taxRule = orderItem.product.taxRule;
    let ruleKey = Maestro.Tax.Types.get(taxRule, "rule", false);
    return (ruleKey == "retailTax") || (ruleKey == "preparedMeal") || (ruleKey == "wholesalePastry") || (taxRule == "TAXED");  //taxRule = TAXED check is to allow for older categorization of taxation
};

var determineTax_Standard = function (template, allItems, discountPercent, adjustment) {
    let orderItemsTaxable = getTaxableItems(allItems);
    let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
    
    let gstTaxRate = Maestro.Tax.GetLocalTaxRateForKey("gst");
    let pstTaxRate = Maestro.Tax.GetLocalTaxRateForKey("pst") || 0;
    let retailTax = Maestro.Tax.GetLocalTaxRateForKey("hst") || (gstTaxRate + pstTaxRate);

    // console.log("standard tax function: ", gstTaxRate, pstTaxRate, retailTax);

    let gstTax = 0.00;
    let hstTax = 0.00;
    let pstTax = 0.00;
    let totalTax = 0.00;

    
    //gst only items
        let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];

        if(!!gstTaxItems){
            let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
            gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
            // console.log('gst tax items: ', gstTaxItems);
            totalTax += gstTax ;
        }
    //

    //retail tax items
        let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
        let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
        // console.log('retail tax items: ', retailTaxItems);
        totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);
    //

    //ON only
        let preparedMealItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.ON.taxFunctions.isProductPreparedMeal) || [];
        let preparedMealSubtotal = Maestro.Payment.RoundedNumber(_.reduce(preparedMealItems, addToSubtotal, 0.00), 2);
        // console.log('prepared meal items: ', preparedMealItems);

        let wholesalePastryItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.ON.taxFunctions.isProductWholesalePastry) || [];
        let wholesalePastrySubtotal = Maestro.Payment.RoundedNumber(_.reduce(wholesalePastryItems, addToSubtotal, 0.00), 2);
        let wholesalePastryQuantity = _.reduce(wholesalePastryItems, addToQuantity, 0);
        // console.log('wholesale pastry items: ', wholesalePastryItems);

        if (subtotalAllTaxable < 4.00){
            //prepared meals and wholesale pastry are taxed at 5%
            taxAdd = preparedMealSubtotal * (1.00 - (discountPercent/100)) * (1.00 - (adjustment/100)) * ( gstTaxRate / 100);
            gstTax += taxAdd;
            totalTax += taxAdd;

            if(wholesalePastryQuantity < 6){
                taxAdd = wholesalePastrySubtotal * (1.00 - (discountPercent/100)) *(1.00 - (adjustment/100))* ( gstTaxRate / 100);
                gstTax += taxAdd;
                totalTax += taxAdd;
            }
        } else {
            totalTax += preparedMealSubtotal * (1.00 - (discountPercent/100)) * (1.00 - (adjustment/100)) * ( retailTax / 100);

            if(wholesalePastryQuantity < 6){
                totalTax += wholesalePastrySubtotal * (1.00 - (discountPercent/100)) *(1.00 - (adjustment/100))* ( retailTax / 100);
            }
        }
    //

    hstTax = totalTax - gstTax;

    return {
        total: Maestro.Payment.RoundedNumber(totalTax,2),
        breakdown: {
            gst: Maestro.Payment.RoundedNumber(gstTax,2),
            hst: Maestro.Payment.RoundedNumber(hstTax,2)
        }
    };
};

Maestro.Tax.AllTaxCategories = [
    {key: "NOT_TAXED", value: "notTaxed", label: "Not Taxed", rule: "notTaxed", taxable: false, country: "CA", state: "ALL", description: "This item is non-taxable, whether sold idividually or as a larger order."},
    {key: "GST_TAX", value: "gstTax", label: "GST Tax", rule: "gstTax", taxable: true, country: "CA", state: "ALL", description: "This item is gst-taxable (5%), whether sold idividually or as a larger order. No further (provincial) taxes will be applied for these items."},
    {key: "RETAIL_TAX", value: "retailTax", label: "Retail Tax", rule: "retailTax", taxable: true, country: "CA", state: "ALL", description: "This is a retail item and will be taxed at the standard retail tax rate."},
    {key: "PREPARED_MEAL", value: "preparedMeal", label: "Prepared Food and Beverages", rule: "preparedMeal", taxable: true,  country: "CA", state: "ON", description: "This item is considered a prepared meal or beverage and a total order amount of less than $4 will only carry a GST (5%). Orders larger than $4 will be taxed at standard retail tax (HST 13%)."},
    {key: "WHOLESALE_PASTRY", value: "wholesalePastry", label: "Wholesale Pastry", rule: "wholesalePastry", taxable: true,  country: "CA", state: "ON", description: "This is a pastry item and is applicable for the wholesale pastry rule where an order of 6 or more quantity of these items will be tax free. An order of less than $4 will also be tax free. Anything else will be taxed at retail tax rate."}
];

Maestro.Tax.Types = SEnum([
    {key: "NOT_TAXED", value: "notTaxed", label: "Not Taxed", rule: "notTaxed", taxable: false, country: "CA", state: "ALL", description: "This item is non-taxable, whether sold idividually or as a larger order."},
    {key: "GST_TAX", value: "gstTax", label: "GST Tax", rule: "gstTax", taxable: true, country: "CA", state: "ALL", description: "This item is gst-taxable (5%), whether sold idividually or as a larger order. No further (provincial) taxes will be applied."},
    {key: "RETAIL_TAX", value: "retailTax", label: "Retail Tax", rule: "retailTax", taxable: true, country: "CA", state: "ALL", description: "This is a retail item and will be taxed at the standard retail tax rate."},
    {key: "PREPARED_MEAL", value: "preparedMeal", label: "Prepared Food and Beverages", rule: "preparedMeal", taxable: true,  country: "CA", state: "ON", description: "This item is considered a prepared meal or beverage and a total order amount of less than $4 will only carry a GST (5%). Orders larger than $4 will be taxed at standard retail tax (HST 13%)."},
    {key: "WHOLESALE_PASTRY", value: "wholesalePastry", label: "Wholesale Pastry", rule: "wholesalePastry", taxable: true,  country: "CA", state: "ON", description: "This is a pastry item and is applicable for the wholesale pastry rule where an order of 6 or more quantity of these items will be tax free. An order of less than $4 will also be tax free. Anything else will be taxed at retail tax rate."}
]);

Maestro.Tax.GetTaxCategoriesForLocation = function(){
    if(!!Maestro.Business){
        if(!!Maestro.Business.getLocation){    
            let thisLocation = Maestro.Business.getLocation();
            if(!!thisLocation){
                let countryCode = thisLocation.address.country;
                let subRegionCode = thisLocation.address.state;

                // console.log('all categories: ', Maestro.Tax.AllTaxCategories);
                let allCountryKeys = _.filter(Maestro.Tax.AllTaxCategories, function(key){return key.country == countryCode;});

                // console.log('country keys: ', allCountryKeys);
                let allStateKeys = _.filter(allCountryKeys, function(key){return key.state == "ALL" || key.state == subRegionCode;});
                // console.log('state keys: ', allStateKeys);

                return allStateKeys;
            }
        }
    }

    return Maestro.Tax.Types.keys();
}; 

Maestro.Tax.GetTaxKeysForLocation = function(){
    // console.log('all keys: ', _.pluck(Maestro.Tax.GetTaxCategoriesForLocation(), "key"));
    return _.pluck(Maestro.Tax.GetTaxCategoriesForLocation(), "key");
};

Maestro.Tax.DetermineTax = function(template, allItems, discountPercent, adjustment){
    if(!!Maestro.Business){
        if(!!Maestro.Business.getLocation){    
            let thisLocation = Maestro.Business.getLocation();
            if(!!thisLocation){
                let countryCode = thisLocation.address.country;
                let subRegionCode = thisLocation.address.state;

                return Maestro.Tax.CountryRules[countryCode][subRegionCode].determineTax(template, allItems, discountPercent, adjustment); 
            }
        }
    }

    return determineTax_Standard(template, allItems, discountPercent, adjustment);
};

Maestro.Tax.GetTaxComponentKeysForLocation = function(){
    if(!!Maestro.Business){
        if(!!Maestro.Business.getLocation){    
            let thisLocation = Maestro.Business.getLocation();
            if(!!thisLocation){
                let countryCode = thisLocation.address.country;
                let subRegionCode = thisLocation.address.state;
                return Maestro.Tax.CountryRules[countryCode][subRegionCode].taxComponentKeys; 
            }
        } 
    }
};

Maestro.Tax.GetTaxComponentKeysForAllLocations = function(){
    let allStateKeys = [];
    let allTaxComponentKeys = [];

    if(!!Maestro.Business){
        _.each(Maestro.Business.getAllLocations(), function(thisLocation){
            let countryCode = thisLocation.address.country;
            let subRegionCode = thisLocation.address.state;
            allStateKeys.push(Maestro.Tax.CountryRules[countryCode][subRegionCode].taxComponentKeys);
        });

        allStateKeys = _.flatten(allStateKeys);
        allStateKeys = _.uniq(allStateKeys);

        let allKeys = _.pluck(allStateKeys, "key");
        allKeys = _.uniq(allKeys);

        _.each(allKeys, function(thisKey){
            allLabels = _.pluck(
                _.filter(allStateKeys, function(component){
                return component.key == thisKey;
                }),
                "label");
            allLabels = _.uniq(allLabels);
            allTaxComponentKeys.push({
                key: thisKey,
                label: allLabels.join(" & ")
            });
        });
    }

    return allTaxComponentKeys;
};

Maestro.Tax.GetLocalTaxRateForKey = function(givenKey){
    if(!!Maestro.Business){
        if(!!Maestro.Business.getLocation){    
            let thisLocation = Maestro.Business.getLocation();
            if(!!thisLocation){
                let countryCode = thisLocation.address.country;
                let subRegionCode = thisLocation.address.state;

                let allTaxKeys = Maestro.Tax.CountryRules[countryCode][subRegionCode].taxComponentKeys; 
                let thisKey = _.find(allTaxKeys, function(taxKey){ return taxKey.key == givenKey}) || {};
                return thisKey.rate;
            }
        }
    }
};

Maestro.Tax.GetTaxRate = function(countryCode, subRegionCode, givenKey){
    let allTaxKeys = Maestro.Tax.CountryRules[countryCode][subRegionCode].taxComponentKeys; 
    let thisKey = _.find(allTaxKeys, function(taxKey){ return taxKey.key == givenKey}) || {};
    return thisKey.rate;
};


Maestro.Tax.CountryRules = {
    CA: {
            countryName: "Canada",
            countryTaxFunctions: {
                isProductGSTTaxable: function(orderItem){
                    let taxRule = orderItem.product.taxRule;
                    return (Maestro.Tax.Types.get(taxRule, "rule", false) == "gstTax");  //taxRule = TAXED check is to allow for older categorization of taxation
                },
            },
            allTaxLabels: ["GST", "PST", "HST"],
            AB: {
                    stateName: "Alberta",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "AB", "gst");
                        let retailTax = gstTaxRate;
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);

                        let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                        let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    

                        totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);

                        // console.log("Tax: Alberta");
                        // console.log("all items: ", )
                        // console.log("gst tax: ", gstTax);
                        // console.log("hst tax: ", hstTax);
                        // console.log("totalTax: ", totalTax);

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(totalTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}]
                },
            BC: {
                    stateName: "British Columbia",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "BC", "gst");
                        let pstTaxRate = Maestro.Tax.GetTaxRate("CA", "BC", "pst");
                        let retailTax = gstTaxRate + pstTaxRate;

                        let gstTax = 0.00;
                        let pstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];

                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                                // console.log('gst tax items: ', gstTaxItems);
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            // console.log('retail tax items: ', retailTaxItems);

                            gstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100);
                            pstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( pstTaxRate / 100);

                        totalTax += gstTax + pstTax;
                        
                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                pst: Maestro.Payment.RoundedNumber(pstTax,2),
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"pst", label: "PST", rate: 7}]
                },
            MB: {
                    stateName: "Manitoba",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "MB", "gst");
                        let pstTaxRate = Maestro.Tax.GetTaxRate("CA", "MB", "pst");
                        let retailTax = gstTaxRate + pstTaxRate;

                        let gstTax = 0.00;
                        let pstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];

                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                                // console.log('gst tax items: ', gstTaxItems);
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            // console.log('retail tax items: ', retailTaxItems);

                            gstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100);
                            pstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( pstTaxRate / 100);

                        totalTax += gstTax + pstTax;
                        
                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                pst: Maestro.Payment.RoundedNumber(pstTax,2),
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"pst", label: "PST", rate: 8}]
                },
            NB: {
                    stateName: "New Brunswick",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);
                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        // let retailTax = Maestro.Tax.GetTaxRate("CA", "NB", "hst");
                        let hstTaxRate = Maestro.Tax.GetTaxRate("CA", "NB", "hst");
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "NB", "gst");
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];
                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            hstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( hstTaxRate / 100);
                        //

                        totalTax += hstTax + gstTax;

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                hst: Maestro.Payment.RoundedNumber(hstTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"hst", label:"HST", rate: 15}]
                },
            NL: {
                    stateName: "Newfoundland and Labrador",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);
                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        // let retailTax = Maestro.Tax.GetTaxRate("CA", "NL", "hst");
                        let hstTaxRate = Maestro.Tax.GetTaxRate("CA", "NL", "hst");
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "NL", "gst");
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];
                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            hstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( hstTaxRate / 100);
                        //

                        totalTax += hstTax + gstTax;

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                hst: Maestro.Payment.RoundedNumber(hstTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"hst", label:"HST", rate: 15}]
                },
            NS: {
                    stateName: "Nova Scotia",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);
                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        // let retailTax = Maestro.Tax.GetTaxRate("CA", "NS", "hst");
                        let hstTaxRate = Maestro.Tax.GetTaxRate("CA", "NS", "hst");
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "NS", "gst");
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];
                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            hstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( hstTaxRate / 100);
                        //

                        totalTax += hstTax + gstTax;

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                hst: Maestro.Payment.RoundedNumber(hstTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"hst", label:"HST", rate: 15}]
                },
            NT: {
                    stateName: "Northwest Territories",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "NT", "gst");
                        let retailTax = gstTaxRate;
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);

                        let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                        let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    

                        totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(totalTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}]
                },
            NU: {
                    stateName: "Nunavut",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "NU", "gst");
                        let retailTax = gstTaxRate;
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);

                        let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                        let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    

                        totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(totalTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}]
                },
            ON: {
                    stateName: "Ontario",
                    taxFunctions: {
                        // Maestro.Tax.CountryRules.CA.ON.taxFunctions...
                        isProductRetailTaxed_ON: function(orderItem) { 
                            let taxRule = orderItem.product.taxRule;
                            return (Maestro.Tax.Types.get(taxRule, "rule", false) == "retailTax") || (taxRule == "TAXED");  //taxRule = TAXED check is to allow for older categorization of taxation
                        },
                        isProductPreparedMeal: function(orderItem) {
                            let taxRule = orderItem.product.taxRule;
                            return Maestro.Tax.Types.get(taxRule, "rule", false) == "preparedMeal";
                        },

                        isProductWholesalePastry: function(orderItem) {
                            let taxRule = orderItem.product.taxRule;
                            return Maestro.Tax.Types.get(taxRule, "rule", false) == "wholesalePastry";
                        },
                    },
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);
                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        let retailTax = Maestro.Tax.GetTaxRate("CA", "ON", "hst");
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "ON", "gst");
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];

                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                                // console.log('gst tax items: ', gstTaxItems);
                                totalTax += gstTax ;
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.ON.taxFunctions.isProductRetailTaxed_ON) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            // console.log('retail tax items: ', retailTaxItems);
                            totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);
                        
                        //ON specific tax rules
                            let preparedMealItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.ON.taxFunctions.isProductPreparedMeal) || [];
                            let preparedMealSubtotal = Maestro.Payment.RoundedNumber(_.reduce(preparedMealItems, addToSubtotal, 0.00), 2);
                            // console.log('prepared meal items: ', preparedMealItems);

                            let wholesalePastryItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.ON.taxFunctions.isProductWholesalePastry) || [];
                            let wholesalePastrySubtotal = Maestro.Payment.RoundedNumber(_.reduce(wholesalePastryItems, addToSubtotal, 0.00), 2);
                            let wholesalePastryQuantity = _.reduce(wholesalePastryItems, addToQuantity, 0);
                            // console.log('wholesale pastry items: ', wholesalePastryItems);

                            // if (subtotalAllTaxable < 4.00){
                            if((preparedMealSubtotal + wholesalePastrySubtotal) <= 4.00){
                                //prepared meals and wholesale pastry are taxed at 5%
                                taxAdd = preparedMealSubtotal * (1.00 - (discountPercent/100)) * (1.00 - (adjustment/100)) * ( gstTaxRate / 100);
                                gstTax += taxAdd;
                                totalTax += taxAdd;

                                if(wholesalePastryQuantity < 6){
                                    taxAdd = wholesalePastrySubtotal * (1.00 - (discountPercent/100)) *(1.00 - (adjustment/100))* ( gstTaxRate / 100);
                                    gstTax += taxAdd;
                                    totalTax += taxAdd;
                                }
                            } else {
                                totalTax += preparedMealSubtotal * (1.00 - (discountPercent/100)) * (1.00 - (adjustment/100)) * ( retailTax / 100);

                                if(wholesalePastryQuantity < 6){
                                    totalTax += wholesalePastrySubtotal * (1.00 - (discountPercent/100)) *(1.00 - (adjustment/100))* ( retailTax / 100);
                                }
                            }
                        //

                        hstTax = totalTax - gstTax;

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                hst: Maestro.Payment.RoundedNumber(hstTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"hst", label:"HST", rate: 13}]
                },
            PE: {
                    stateName: "Prince Edward Island",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);
                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        // let retailTax = Maestro.Tax.GetTaxRate("CA", "PE", "hst");
                        let hstTaxRate = Maestro.Tax.GetTaxRate("CA", "PE", "hst");
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "PE", "gst");
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];
                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            hstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( hstTaxRate / 100);
                        //

                        totalTax += hstTax + gstTax;

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                hst: Maestro.Payment.RoundedNumber(hstTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"hst", label:"HST", rate: 15}]
                },
            QC: {
                    stateName: "Quebec",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "QC", "gst");
                        let pstTaxRate = Maestro.Tax.GetTaxRate("CA", "QC", "pst");
                        let retailTax = gstTaxRate + pstTaxRate;

                        let gstTax = 0.00;
                        let pstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];

                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                                // console.log('gst tax items: ', gstTaxItems);
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            // console.log('retail tax items: ', retailTaxItems);

                            gstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100);
                            pstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( pstTaxRate / 100);

                        totalTax += gstTax + pstTax;
                        
                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                pst: Maestro.Payment.RoundedNumber(pstTax,2),
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"pst", label: "QST", rate: 9.975}]
                },
            SK: {
                    stateName: "Saskatchewan",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);
                        
                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "SK", "gst");
                        let pstTaxRate = Maestro.Tax.GetTaxRate("CA", "SK", "pst");
                        let retailTax = gstTaxRate + pstTaxRate;

                        let gstTax = 0.00;
                        let pstTax = 0.00;

                        let totalTax = 0.00;

                        //gst only items
                            let gstTaxItems = _.filter(orderItemsTaxable, Maestro.Tax.CountryRules.CA.countryTaxFunctions.isProductGSTTaxable) || [];

                            if(!!gstTaxItems){
                                let gstTaxItemsSubtotal = Maestro.Payment.RoundedNumber(_.reduce(gstTaxItems, addToSubtotal, 0.00), 2) || 0.00;
                                gstTax += gstTaxItemsSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100); 
                                // console.log('gst tax items: ', gstTaxItems);
                            }
                        //

                        //retail items                        
                            let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                            let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    
                            // console.log('retail tax items: ', retailTaxItems);

                            gstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( gstTaxRate / 100);
                            pstTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( pstTaxRate / 100);

                        totalTax += gstTax + pstTax;
                        
                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(gstTax,2),
                                pst: Maestro.Payment.RoundedNumber(pstTax,2),
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}, {key:"pst", label: "PST", rate: 5}]
                },
            YT: {
                    stateName: "Yukon",
                    taxFunctions: {},
                    determineTax: function (template, allItems, discountPercent, adjustment) {
                        let orderItemsTaxable = getTaxableItems(allItems);

                        let gstTaxRate = Maestro.Tax.GetTaxRate("CA", "YT", "gst");
                        let retailTax = gstTaxRate;
                        
                        let gstTax = 0.00;
                        let hstTax = 0.00;

                        let totalTax = 0.00;

                        let subtotalAllTaxable = Maestro.Payment.RoundedNumber(_.reduce(orderItemsTaxable, addToSubtotal, 0.00), 2);

                        let retailTaxItems = _.filter(orderItemsTaxable, isProductRetailTaxed_Standard) || [];
                        let retailSubtotal = Maestro.Payment.RoundedNumber(_.reduce(retailTaxItems, addToSubtotal, 0.00), 2);    

                        totalTax += retailSubtotal * (1.00 - (discountPercent/100))*(1.00 - (adjustment/100)) * ( retailTax / 100);

                        return {
                            total: Maestro.Payment.RoundedNumber(totalTax,2),
                            breakdown: {
                                gst: Maestro.Payment.RoundedNumber(totalTax,2)
                            }
                        };
                    },
                    taxComponentKeys: [{key:"gst", label: "GST", rate: 5}]
                },
        },
};
