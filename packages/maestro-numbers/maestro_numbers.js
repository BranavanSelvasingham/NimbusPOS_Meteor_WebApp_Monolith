import accounting from './lib/accounting';

const accountingLib = {};

accounting(accountingLib);

Maestro.Numbers = {
    Accounting: accountingLib.accounting
};

Maestro.Numbers.Rounding = {};

var _sign = function (number) {
    if (_.isNaN(number)) {
        return NaN;
    }

    if (number < 0) {
        return -1;
    }

    if (number > 0) {
        return 1;
    }

    return 0;
};

var _cashRounding = function (amount, factor) {
    //convert factor to positive
    if (factor < 0) {
        factor = factor * _sign(factor);
    }

    //default to .01 as minimum resolution needed in absence of factor
    factor = factor || 100;

    //temps
    let temp = amount * factor;
    let intTemp = parseInt(temp + .5 * _sign(amount));

    //special handling for 0.5
    if (((temp - parseInt(temp)) === .5) && ((intTemp / 2) != (parseInt(intTemp / 2)))) { //is 'temp' odd
        //reduce magnitude by 1 to make it even
        intTemp = intTemp - _sign(amount);
    }

    return Number(accountingLib.accounting.toFixed(intTemp / factor, 2));
};

Maestro.Numbers.Rounding.Cash = _cashRounding;

