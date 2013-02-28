var EventEmitter = require('events').EventEmitter;

function Lexer(content) {
    this.line = content.join(" ").split("");
    this.currentState = "idle";
    this.isRunning = true;
    this.segments = [];
    this.charIndex = 0;
    this.insidePrimitive = {
        type: null,
        index: 0
    };
    this.tokens = [];
    this.ignoreTokens = false;
    this.run();
}

Lexer.prototype = new EventEmitter();

_.extend(Lexer.prototype, {

    run: function() {

        this.currentState = 'nextChar';

        while (this.isRunning) {

            //console.log("State: -> ", this.currentState);

            switch (this.currentState) {
                case "idle":

                    break;
                case "nextChar":
                    this.charIndex++;
                    this.currentState = 'readChar';
                    break;
                case "done":
                    this.seg();
                    console.log(this.segments);
                    this.isRunning = false;
                    break;
                case "readChar":
                    this.readChar();
                    break;
            }

        }

    },


    readChar: function() {
        var ch = this.line[this.charIndex - 1];
        var next = this.line[this.charIndex+1];
        var prev = this.line[this.charIndex-1];

        if (!ch || typeof ch === "undefined") {
            this.currentState = 'done';
            return;
        }

        if (ch.match(/\s/)) {
            this.seg();
            return;
        }
        // Check if were in a string or other primitive:
        if ((ch.match(/[A-Za-z]/) || this.ignoreTokens) && this.insidePrimitive.type === 'string') {

            if (next && !next.match(/[A-Za-z]/)) {
                // End.
                var str = "";
                for (var i = this.insidePrimitive.index - 1; i <= this.charIndex; i++) {
                    str += this.line[i];
                }
                this.insidePrimitive.type = null;
                this.insidePrimitive.index = 0;
                this.tokens.push("STRING:" + str);
            }

        } else if (this.insidePrimitive.type === 'integer') {

        } else {
            this.insidePrimitive.type = null;
            this.insidePrimitive.index = 0;
            // Not inside either of them.
            switch (ch) {
                case ",":
                    this.tokens.push("SCOLON");
                break;
                case "=":
                    this.tokens.push("EQUAL");
                break;
                case "'":
                    this.tokens.push("SQUOTE");
                break;
                case "\"":
                    this.tokens.push("DQUOTE");
                break;
                case "/":
                    this.tokens.push("REGSLASH");

                    if (this.ignoreTokens) {
                        this.ignoreTokens = false;
                        this.insidePrimitive.type = null;
                        this.insidePrimitive.index = 0;
                    } else {
                        this.ignoreTokens = true;
                        this.insidePrimitive.type = 'string';
                        this.insidePrimitive.index = this.charIndex;
                    }
                break;
            }


            if (ch.match(/[A-Za-z]/)) {
                // Look at the next character;
                if (next && next.match(/[A-Za-z]/)) {
                    // Continue;
                    this.insidePrimitive.type = 'string';
                    this.insidePrimitive.index = this.charIndex;
                } else {
                    console.log(ch, next);
                    this.tokens.push("STRING:" + ch);
                }
            }

        }

        this.currentState = 'nextChar';
    },

    seg: function() {
        this.segments.push(this.tokens);
        this.tokens = [];
        this.charIndex++;
        this.currentState = 'nextChar';
    }

});


Lexer.create = function(content) {
    return new Lexer(content);
}


module.exports = Lexer;