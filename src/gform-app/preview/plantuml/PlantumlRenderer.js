define(
    [
        "dojo/_base/declare",
        "./deflater"
    ], function (declare, deflate) {
        return declare([],{
            id: 0,
            render: function (source) {
                source = unescape(encodeURIComponent(source));
                return "http://www.plantuml.com/plantuml/img/" + this.encode64(deflate(source, 9));
            },
            nextId: function () {
                return this.id++;
            },
            encode64: function (data) {
                r = "";
                for (i = 0; i < data.length; i += 3) {
                    if (i + 2 == data.length) {
                        r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
                    } else if (i + 1 == data.length) {
                        r += this.append3bytes(data.charCodeAt(i), 0, 0);
                    } else {
                        r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1),
                            data.charCodeAt(i + 2));
                    }
                }
                return r;
            },

            append3bytes: function (b1, b2, b3) {
                c1 = b1 >> 2;
                c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
                c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
                c4 = b3 & 0x3F;
                r = "";
                r += this.encode6bit(c1 & 0x3F);
                r += this.encode6bit(c2 & 0x3F);
                r += this.encode6bit(c3 & 0x3F);
                r += this.encode6bit(c4 & 0x3F);
                return r;
            },

            encode6bit: function (b) {
                if (b < 10) {
                    return String.fromCharCode(48 + b);
                }
                b -= 10;
                if (b < 26) {
                    return String.fromCharCode(65 + b);
                }
                b -= 26;
                if (b < 26) {
                    return String.fromCharCode(97 + b);
                }
                b -= 26;
                if (b == 0) {
                    return '-';
                }
                if (b == 1) {
                    return '_';
                }
                return '?';
            }


        });
    }
);
