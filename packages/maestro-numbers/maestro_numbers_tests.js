//Factor 20 - nearest .05 or 5 cents
Tinytest.add('Test Factor 20 / 5 cents - "1.00"', function (test) {
    var value = 1.00;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.00;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.01"', function (test) {
    var value = 1.01;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.02"', function (test) {
    var value = 1.02;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.03"', function (test) {
    var value = 1.03;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.05;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.04"', function (test) {
    var value = 1.04;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.05;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.05"', function (test) {
    var value = 1.05;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.05;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.06"', function (test) {
    var value = 1.06;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.05;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.07"', function (test) {
    var value = 1.07;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.05;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.08"', function (test) {
    var value = 1.08;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.10;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.09"', function (test) {
    var value = 1.09;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.10;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.10"', function (test) {
    var value = 1.10;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.10;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 20 / 5 cents - "1.57"', function (test) {
    var value = 1.57;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.55;
    test.equal(actual, expected);
});

//Factor - 10, nearest .1 or 10 cents
Tinytest.add('Test Factor 10 / 10 cents - "1.00"', function (test) {
    var value = 1.00;
    var actual = MNumbers.Rounding.Cash(value, 20);
    var expected = 1.00;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.01"', function (test) {
    var value = 1.01;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.02"', function (test) {
    var value = 1.02;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.03"', function (test) {
    var value = 1.03;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.04"', function (test) {
    var value = 1.04;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.05"', function (test) {
    var value = 1.05;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "2.05"', function (test) {
    var value = 2.05;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 2;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.06"', function (test) {
    var value = 1.06;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1.1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.07"', function (test) {
    var value = 1.07;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1.1;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.08"', function (test) {
    var value = 1.08;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1.10;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.09"', function (test) {
    var value = 1.09;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1.10;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.10"', function (test) {
    var value = 1.10;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1.10;
    test.equal(actual, expected);
});

Tinytest.add('Test Factor 10 / 10 cents - "1.57"', function (test) {
    var value = 1.57;
    var actual = MNumbers.Rounding.Cash(value, 10);
    var expected = 1.6;
    test.equal(actual, expected);
});
