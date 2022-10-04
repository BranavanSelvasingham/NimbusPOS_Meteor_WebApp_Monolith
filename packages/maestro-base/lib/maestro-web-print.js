Maestro.Print = {};

Maestro.Print.LINE_LENGTH_NARROW = 42;
Maestro.Print.LINE_LENGTH_MEDIUM = 45;
Maestro.Print.LINE_LENGTH_WIDE = 48;

Maestro.Print.Job = class {
    constructor(lineWidth=Maestro.Print.LINE_LENGTH_MEDIUM) {
        this.commandSet = '';
        this.lineWidth = lineWidth;
    }

    build() {
        return this.commands();
    }

    commands() {
        return this.commandSet;
    }

    _baseCommand(cmd, data) {
        return {
            cmd: cmd,
            data: data
        }
    }
    
    _addCommand(command) {
        this.commandSet += JSON.stringify(command);
    }

    qr(text) {
        let command = this._baseCommand('qr', text);

        this._addCommand(command);
        return this;
    }

    barcode(text, barcode_type='CODE39', width=4, height=64, position='below', font='a', align_ct=true, function_type='a') {
        let command = this._baseCommand('barcode', String(text));

        command.bc = barcode_type;
        command.width = width;
        command.height = height;
        command.posiiton = position;
        command.font = font;
        command.align_ct = align_ct;
        command.function_type = function_type;

        this._addCommand(command);
        return this;
    }

    cut(mode='full') {
        let command = this._baseCommand('cut', mode);

        this._addCommand(command);
        return this;
    }

    cashdraw(pin=2) {
        let command = this._baseCommand('cashdraw', pin);

        this._addCommand(command);
        return this;
    }

    hw(operation) {
        let command = this._baseCommand('hw', operation);

        this._addCommand(command);
        return this;
    }

    control(align, pos=4) {
        let command = this._baseCommand('control', align);

        command.pos = pos;

        this._addCommand(command);
        return this;
    }

    style(text_type='normal', align='left', font='a', width=1, height=1, invert=false, smooth=true, flip=false) {
        let command = this._baseCommand('style', null);

        command.text_type = text_type;
        command.align = align;
        command.font = font;
        command.width = width;
        command.height = height;
        command.invert = invert;
        command.smooth = smooth;
        command.flip = flip;

        this._addCommand(command);
        return this;
    }

    text(text) {
        let command = this._baseCommand('text', text);

        this._addCommand(command);
        return this;
    }

    textStyled(text, text_type='normal', align='left', font='a', width=1, height=1, invert=false, smooth=true, flip=false) {
        return this.style(text_type, align, font, width, height, invert, smooth, flip)
            .text(text)
            .style();
    }

    textNormal(text) {
        return this.textStyled(text);
    }

    textDouble(text) {
        return this.textStyled(text, undefined, undefined, undefined, 2, 2, undefined, undefined, undefined);
    }

    textDoubleWidth(text) {
        return this.textStyled(text, undefined, undefined, undefined, 2, undefined, undefined, undefined, undefined);
    }

    textDoubleHeight(text) {
        return this.textStyled(text, undefined, undefined, undefined, undefined, 2, undefined, undefined, undefined);
    }

    textInverted(text) {
        return this.textStyled(text, undefined, undefined, undefined, undefined, undefined, true, undefined, undefined);
    }

    textBold(text) {
        return this.textStyled(text, 'B');
    }

    textUnderlined(text) {
        return this.textStyled(text, 'U');
    }

    lineBreak() {
        return this.text('\n');
    }

    textPadded(leftText, rightText, align='left', padCharacter, width=1, height=1, text_type='normal', font='a', invert=false, smooth=true, flip=false){
        let defaultWidth = this.lineWidth;

        let leftValue = leftText || '';
        let rightValue = rightText || '';
        let padValue = padCharacter || ' ';

        let leftLength = leftValue.length;
        let rightLength = rightValue.length;

        let lineWidth = parseInt(defaultWidth / (width || 1));

        let paddingLength = lineWidth - leftLength - rightLength;
        let padding = paddingLength < 1 ? padValue : new Array(paddingLength).join(padValue);

        let text = leftValue + padding + rightValue;

        return this.textStyled(text, text_type, align, font, width, height, invert, smooth, flip);
    }

    alignLeftAndRight(leftText, rightText, align, padCharacter, width, height, text_type, font, invert, smooth, flip){
        return this.textPadded(leftText, rightText, padCharacter, width, height, text_type, align, font, invert, smooth, flip);
    }

};