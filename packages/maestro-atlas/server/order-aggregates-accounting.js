function getDateRange(fromDate, toDate = null, fromDateTimeBucket, toDateTimeBucket) {
    check(fromDate, Match.OneOf(Date, String));
    check(toDate, Match.Optional(Match.OneOf(Date, String, null)));

    let dateRange = {};
    let filter = {};
    let group = {
        year: "$year",
        // dayOfYear: "$dayOfYear"
    };
    let isSingleDate = false;

    let startDate = moment(fromDate);
    let endDate = null;

    if(!toDate){
        endDate = startDate;
        isSingleDate = true;
    } else {
        endDate = moment(toDate);

        if(!endDate.isValid()) {
            throw new Meteor.Error("invalid_date", "If provided, end date must be a valid date!");
        }
    }
     
    if(!startDate.isValid()) {
        throw new Meteor.Error("invalid_date", "Start date must be a valid date!");
    }

    if(Math.abs(startDate.diff(endDate, 'days', true)) <= 1) {
        isSingleDate = true;
    }

    //a date range has been provided
    // let firstDate = moment.min(startDate, endDate).utc().startOf('day').toDate();
    // let lastDate = moment.max(startDate, endDate).utc().endOf('day').toDate();

    let firstDate = startDate.startOf('day').toDate();
    let lastDate = endDate.endOf('day').toDate();

    // console.log('start date: ', fromDateTimeBucket);
    // console.log('last date: ', toDateTimeBucket);

    // console.log('start date ', moment(firstDate).year(), moment(firstDate).month(), moment(firstDate).date());
    // console.log('end date ', moment(endDate).year(), moment(endDate).month(), moment(endDate).date());

    if(isSingleDate){
        filter = { 
                'timeBucket.year': {$gte: fromDateTimeBucket.year, $lte: toDateTimeBucket.year},
                'timeBucket.month' : {$gte: fromDateTimeBucket.month, $lte: toDateTimeBucket.month},
                'timeBucket.day' : {$gte: fromDateTimeBucket.date, $lte: toDateTimeBucket.date},
                'timeBucket.hour' : {$gte: fromDateTimeBucket.hour, $lte: toDateTimeBucket.hour}
            };
    } else {
        filter.createdAt = {$gte: firstDate, $lte: lastDate};
    }
    

    if(isSingleDate === true)  {
        group.hour = "$hour";
    }

    dateRange.filter = filter;
    dateRange.group = group;
    dateRange.includeHoursDetails = isSingleDate;

    return dateRange;
}

const flattenOrder = {
    $unwind: "$items"
};

const sortResults = {
    $sort: {
        "createdAt": 1
    }
};

const projectFields = {
    $project: {
        "_id:": 1,
        "uniqueOrderNumber": 1,
        "createdAt": 1,
        "businessId": 1,
        "locationId": 1,
        "customerId": 1,
        "items.product": 1,
        "items.quantity": 1,
        "items.total": 1,
        "subtotals": 1,
        "payment": 1,
        "status": 1,
        year: "$timeBucket.year",
        month: "$timeBucket.month",
        day: "$timeBucket.day",
        hour: "$timeBucket.hour",
        // year: {$year: "$createdAt"},
        // month: {$month: "$createdAt"},
        // day: {$dayOfMonth: "$createdAt"},
        // hour: {$hour: "$createdAt"},
        // week: {$week: "$createdAt"},
        // dayOfYear: {$dayOfYear: "$createdAt"}
    }
};

function getOrderResults(orderFilter, includeHoursDetails) {
    let groupByFields = {
        "businessId": "$businessId",
        "locationId": "$locationId",
        year: "$year",
        month: "$month",
        // week: "$week",
        day: "$day"
    };

    if(includeHoursDetails) {
        _.extend(groupByFields,
            { hour: "$hour" }
        );
    }

    let groupDetails = {
        // _id: groupByFields,
        count: {"$sum": 1},
        subtotal: {"$sum": "$subtotals.subtotal"},
        discount: {"$sum": "$subtotals.discount"},
        adjustments: {"$sum": "$subtotals.adjustments"},
        tax: {"$sum": "$subtotals.tax"},
        hst: {"$sum": "$subtotals.taxComponents.hst"},
        gst: {"$sum": "$subtotals.taxComponents.gst"},
        pst: {"$sum": "$subtotals.taxComponents.pst"},
        total: {"$sum": "$subtotals.total"},
        cashRoundedAmount: {"$sum": "$payment.rounding"},
        amountCollected: {"$sum": "$payment.received"},
        giftCardTotal: {"$sum": "$payment.giftCardTotal"}
    };

    let aggregationPipeline = prepareOrdersAggregationPipeline(orderFilter, groupDetails);

    // console.log("+++ PIPELINE ++ ORDERS :: ", aggregationPipeline);

    return Orders.aggregate(aggregationPipeline);
}

// function getCategoryResults(orderFilter, includeHoursDetails) {
//     let groupByFields = {
//         "businessId": "$businessId",
//         "locationId": "$locationId",
//         "categoryId": "$items.product.categoryId",
//         year: "$year",
//         month: "$month",
//         week: "$week",
//         day: "$day"
//     };

//     if(includeHoursDetails) {
//         _.extend(groupByFields,
//             { hour: "$hour" }
//         );
//     }

//     let groupDetails = {
//         _id: groupByFields,
//         count: {"$sum": "$items.quantity"},
//         redeemed: {"$sum": "$items.redeemed"},
//         amount: {"$sum": "$items.total"}
//     };

//     let aggregationPipeline = prepareFlattenedOrdersAggregationPipeline(orderFilter, groupDetails);

//     // console.log("+++ PIPELINE ++ CATEGORIES :: ", aggregationPipeline);

//     return Orders.aggregate(aggregationPipeline);
// }

// function getProductResults(orderFilter, includeHoursDetails) {
//     let groupByFields = {
//         "businessId": "$businessId",
//         "locationId": "$locationId",
//         "productId": "$items.product._id",
//     };

//     let groupDetails = {
//         _id: groupByFields,
//         count: {"$sum": "$items.quantity"},
//         amount: {"$sum": "$items.total"}
//     };

//     let aggregationPipeline = prepareFlattenedOrdersAggregationPipeline(orderFilter, groupDetails);

//     // console.log("+++ PIPELINE ++ PRODUCTS :: ", aggregationPipeline);

//     return Orders.aggregate(aggregationPipeline);
// }

// function getCustomerResults(orderFilter, includeHoursDetails) {
//     let groupByFields = {
//         "businessId": "$businessId",
//         "customerId": "$customerId"
//     };

//     let groupDetails = {
//         _id: groupByFields,
//         count: {"$sum": 1},
//         subtotal: {"$sum": "$subtotals.subtotal"},
//         discount: {"$sum": "$subtotals.discount"},
//         adjustments: {"$sum": "$subtotals.adjustments"},
//         tax: {"$sum": "$subtotals.tax"},
//         hst: {"$sum": "$subtotals.taxComponents.hst"},
//         gst: {"$sum": "$subtotals.taxComponents.gst"},
//         total: {"$sum": "$subtotals.total"},
//         cashRoundedAmount: {"$sum": "$payment.rounding"},
//         amountCollected: {"$sum": "$payment.received"},
//         giftCardTotal: {"$sum": "$payment.giftCardTotal"} 
//     };

//     let aggregationPipeline = prepareOrdersAggregationPipeline(orderFilter, groupDetails);

//     // console.log("+++ PIPELINE ++ PRODUCTS :: ", aggregationPipeline);

//     return Orders.aggregate(aggregationPipeline);
// }

function prepareOrdersAggregationPipeline(filter, group) {
    let pipeline = [];

    pipeline.push({ $match: filter });
    // pipeline.push(flattenOrder);
    pipeline.push(projectFields); //todo add $lookup for categories
    // pipeline.push({ $group: group });
    pipeline.push(sortResults);

    return pipeline;
}

// function prepareFlattenedOrdersAggregationPipeline(filter, group) {
//     let pipeline = [];

//     pipeline.push({ $match: filter });
//     pipeline.push(flattenOrder);
//     pipeline.push(projectFields); //todo add $lookup for categories
//     pipeline.push({ $group: group });
//     pipeline.push(sortResults);

//     return pipeline;
// }

Maestro.Atlas.Accounting.getAccountingResults = function(businessId, locationId, fromDate, toDate = null, fromDateTimeBucket, toDateTimeBucket) {
    let dateRange = getDateRange(fromDate, toDate, fromDateTimeBucket, toDateTimeBucket);

    // console.log("DATE RANGE::: ", dateRange);

    let orderFilter = {
        businessId: businessId
    };

    if(locationId) {
        orderFilter.locationId = locationId;
    }

    let filter = _.extend(orderFilter, dateRange.filter);

    let orders = getOrderResults(filter, dateRange.includeHoursDetails);
    // let categories = getCategoryResults(filter, dateRange.includeHoursDetails);
    // let products = getProductResults(filter, dateRange.includeHoursDetails);

    // let customerFilter = filter;
    // customerFilter.customerId = {$ne: null};

    // let customers = getCustomerResults(customerFilter, dateRange.includeHoursDetails);

    return {
        orders: orders,
        // categories: categories,
        // products: products,
        // customers: customers,
        processedAt: new Date()
    };

};
