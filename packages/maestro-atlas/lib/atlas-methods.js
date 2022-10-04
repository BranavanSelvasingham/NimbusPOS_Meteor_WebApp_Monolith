//import getAggregatedResults from '../server/order-aggregates';

Maestro.Atlas.Dashboard.getDashboardSummary = new ValidatedMethod({
    name: "Maestro.Atlas.Dashboard.getSummary",

    validate: new SimpleSchema({
        businessId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        locationId: {
            type: String,
            optional: true,
            regEx: SimpleSchema.RegEx.Id
        },
        fromDate: {
            type: Date,
            custom: function() {
                if(this.isSet) {
                    if(!moment(this.value).isValid()) {
                        return "From Date is not valid";
                    }
                } else {
                    return "From Date required for dashboard summary";
                }
            }
        },
        toDate: {
            type: Date,
            optional: true,
            custom: function () {
                if (this.isSet) {
                    if (!moment(this.value).isValid()) {
                        return "To Date is not valid";
                    }
                }
            }
        },
        fromDateTimeBucket:{
            type: Object,
            blackbox: true,
            optional: true, 
        },
        toDateTimeBucket:{
            type: Object,
            blackbox: true,
            optional: true, 
        }
    }).validator(),

    applyOptions: {
        noRetry: true
    },

    run({ businessId, locationId, fromDate, toDate, fromDateTimeBucket, toDateTimeBucket}) {
        console.log("@#!@#!@#!@# running dashboard summary ");
        if(!this.isSimulation) {
            return Maestro.Atlas.Dashboard.getAggregatedResults(businessId, locationId, fromDate, toDate, fromDateTimeBucket, toDateTimeBucket);
        }
    }
    
});

Maestro.Atlas.Accounting.getAccountingData = new ValidatedMethod({
    name: "Maestro.Atlas.Accounting.getAccountingData",

    validate: new SimpleSchema({
        businessId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        locationId: {
            type: String,
            optional: true,
            regEx: SimpleSchema.RegEx.Id
        },
        fromDate: {
            type: Date,
            custom: function() {
                if(this.isSet) {
                    if(!moment(this.value).isValid()) {
                        return "From Date is not valid";
                    }
                } else {
                    return "From Date required for dashboard summary";
                }
            }
        },
        toDate: {
            type: Date,
            optional: true,
            custom: function () {
                if (this.isSet) {
                    if (!moment(this.value).isValid()) {
                        return "To Date is not valid";
                    }
                }
            }
        },
        fromDateTimeBucket:{
            type: Object,
            blackbox: true,
            optional: true, 
        },
        toDateTimeBucket:{
            type: Object,
            blackbox: true,
            optional: true, 
        }
    }).validator(),

    applyOptions: {
        noRetry: true
    },

    run({ businessId, locationId, fromDate, toDate, fromDateTimeBucket, toDateTimeBucket}) {
        if(!this.isSimulation) {
            return Maestro.Atlas.Accounting.getAccountingResults(businessId, locationId, fromDate, toDate, fromDateTimeBucket, toDateTimeBucket);
        }
    }
    
});