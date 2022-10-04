Maestro.Schemas.BusinessProductSize = new SimpleSchema({
    code: {
        type: String,
        allowedValues: _.pluck(Maestro.Products.Sizes, "code")
    },
    label: {
        type: String
    },
    preferred: {
        type: Boolean
    },
    available: {
        type: Boolean
    },
    order: {
        type: Number
    }
});

Maestro.Schemas.BusinessConfiguration = new SimpleSchema({
    sizes: {
        type: [Maestro.Schemas.BusinessProductSize]
    }, 

    emailHoursReminder: {
        type: Boolean,
        optional: true
    },

    disableEmployeeTimeAdjust: {
        type: Boolean,
        optional: true
    },

    enableWaiterPinLock: {
        type: Boolean,
        optional: true
    },

    adminPin: {
        type: String,
        optional: true,
    },

    allowPOSAddOnCreation: {
        type: Boolean,
        optional: true
    },

    allowPOSSubsitutionCreation: {
        type: Boolean,
        optional: true
    },

    trackTips: {
        type: Boolean,
        optional: true
    },

    autoEnrollNewDevices: {
        type: Boolean,
        optional: true,
    }
});

Maestro.Schemas.BusinessPayroll = new SimpleSchema({
    referenceStartDate: {
        type: Date
    },
    frequencyType: {
        type: String // weekly, biweekly, monthly
    }
});

Maestro.Schemas.DeviceSession = new SimpleSchema({
    appId: {
        type: String
    },
    deviceInfo: {
        type: Object,
        optional: true,
        blackbox: true
    },
    label: {
        type: String,
        optional: true
    },
    posEnabled: {
        type: Boolean,
        optional: true
    },
    selectedLocation:{
        type: String,
        optional: true
    }
});

Maestro.Schemas.BusinessBilling = new SimpleSchema({
    stripeCustomerId: {
        type: String,
        optional: true
    }
});

Maestro.Schemas.Business = new SimpleSchema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    description: {
        type: String,
        optional: true,
        defaultValue: ''
    },
    phone: {
        type: Number,
        optional: true
    },
    email: {
        type: String,
        optional: true
    },
    configuration: {
        type: Object,
        optional: true,
        defaultValue: {},
        blackbox: true
    },
    payroll: {
        type: Maestro.Schemas.BusinessPayroll,
        optional: true
    },
    devices: {
        type: [Maestro.Schemas.DeviceSession],
        optional: true
    },
    billing: {
        type: Maestro.Schemas.BusinessBilling,
        optional: true
    }
});

