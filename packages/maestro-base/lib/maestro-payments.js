Maestro.Payment = {};

Maestro.Payment.Methods = [
    { key: "cash", value: "Cash", label: "Cash", icon: "attach_money" },
    { key: "card", value: "Credit Card", label: "Credit Card", icon: "credit_card" },
    { key: "loyalty", value: "Loyalty", label: "Loyalty", icon: "card_giftcard" }
];

Maestro.Payment.MethodsEnum = SEnum(Maestro.Payment.Methods);
