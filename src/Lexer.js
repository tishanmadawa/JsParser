import { ApprovalType, TokenType, UserType } from "./type.js"
import { IllegalCommandError, InvalidSyntaxError } from "./Error.js"

class TokenList {
    /**
     * @private
     */
    tokens = [];
    /**
     * @private
     */
    tokensRaw = [];

    constructor() {
        this.tokens = [];
        this.tokensRaw = [];
    }

    /**
     *
     * @param {Token} token
     */
    add(token) {
        this.tokens.push(token);
        if (token.value) this.tokensRaw.push(`${token.type}:${token.value}`)
        else this.tokensRaw.push(`${token.type}`)
    }

    /**
     *
     * @param {Number} index
     */
    remove(index) {
        this.tokens.slice(index, 1);
        this.tokensRaw.slice(index, 1);
    }

    listTokens() {
        return this.tokens;
    }

    list() {
        return this.tokensRaw;
    }
}

class Position {
    constructor(idx, ln, col, fn, ftxt) {
        this.idx = idx;
        this.ln = ln;
        this.col = col;
        this.fn = fn;
        this.ftxt = ftxt;
    }

    advance(currentCharacter) {
        this.idx++;
        this.col++;

        if (currentCharacter == '\n') {
            this.ln++;
            this.col = 0;
        }

        return this;
    }

    copy() {
        return new Position(this.idx, this.ln, this.col, this.fn, this.ftxt);
    }

}

class Token {

    /**
     *
     * @param {TokenType} type
     * @param {String|Number} value
     */
    constructor(type, value, posStart, posEnd, level, subType) {
        this.type = type;
        this.value = value;
        this.subType = subType;
        this.level = level;
        this.posStart = posStart;
        this.posEnd = posEnd;
    }

    toString() {
        if (this.value) return `${this.type}:${this.value}`;
        return this.type;
    }
}

export class Lexer {
    /**
     *
     * @param {String} fn
     * @param {String} data
     */
    constructor(fn, data) {
        this.fn = fn;
        this.count = 0;
        this.data = data.replace(/\n/, " EOF ").split(/[\s,\r]+/);
        // console.log(this.data);
        this.tokens = new TokenList();
        this.currentChar = null;
        this.pos = new Position(-1, 0, -1, fn, data);
        this.advance();
    }

    advance() {
        this.pos.advance(this.currentChar);
        if (this.pos.idx < this.data.length) {
            this.currentChar = this.data[this.pos.idx];
        } else {
            this.currentChar = null;
        }
    }



    /**
     *
     * @returns {Array}
     */
    start() {
        var tokens = [];
        while (this.currentChar != null) {
            if (ApprovalType[this.currentChar] != null) {
                tokens.push(this.makeLevel())
                this.advance();
            } else if (this.currentChar == UserType.Approver) {
                tokens.push(this.approverLevel())
                this.advance();
            } else if (TokenType[this.currentChar] != null) {
                if (this.currentChar == TokenType.EOF) {
                    this.count += 1;
                }
                tokens.push(new Token(TokenType[this.currentChar], null, this.pos));
                this.advance();
            } else if (this.currentChar.includes("\n")) {

                tokens.push(new Token(TokenType.EOF, null, this.pos))
                this.advance();
            } else {
                var posStart = this.pos.copy();
                var char = this.currentChar;
                this.advance();
                new IllegalCommandError(posStart, this.pos, `'${char}'`).log();
                return null;
            }
        }
        tokens.push(new Token(TokenType.EOF, null, this.pos));
        return tokens;
    }

    makeLevel() {
        var approvalTypeChar = this.currentChar;
        var posStart = this.pos.copy();
        this.advance();
        if (this.currentChar == undefined || this.currentChar.toLowerCase() != "level") {
            return new IllegalCommandError(`level command must be included. '${this.currentChar}' is Invalid`);
        }

        this.advance();
        var levelInt = parseInt(this.currentChar);
        return new Token(ApprovalType[approvalTypeChar], levelInt, posStart, this.pos);
    }

    approverLevel() {
        var userType = this.currentChar;
        var posStart = this.pos.copy();
        this.advance();
        var approverName = this.currentChar;
        this.advance();
        if (this.currentChar == undefined || this.currentChar.toLowerCase() != "level") {
            return new IllegalCommandError(`level command must be included. '${this.currentChar}' is Invalid`);
        }
        this.advance();
        var levelInt = parseInt(this.currentChar);
        return new Token(UserType[userType], approverName, this.pos, null, levelInt);
    }
}

;