import { ApprovalType, TokenType, UserType } from "./type.js"
import { UnaryOpNode } from "./Node.js"



class TokenNode {
    constructor(tok) {
        this.tok = tok;
        this.name = "TokenNode";

    }

    toString() {
        return this.tok.toString();
    }
}

class BinOpNode {
    constructor(leftNode, opTok, rightNode) {
        this.leftNode = leftNode;
        this.opTok = opTok;
        this.rightNode = rightNode;

        this.name = "BinOpNode";
    }

    toString() {
        return `( ${this.leftNode.toString()},${this.opTok.toString()},${this.rightNode.toString()})`;
    }
}



class ParseResult {
    constructor() {
        this.error = null;
        this.node = null;
    }

    register(res) {
        if (res.error) this.error = res.error;
        return res.node
    }

    success(node) {
        this.node = node;
        return this;
    }
    failure(error) {
        if (!this.error) {
            this.error = error;
        }
        return this;
    }

}

export class Parser {
    constructor(tokens, count, tokIdx) {
        this.tokens = tokens;
        this.count = count;
        this.tokIdx = tokIdx;
        this.advance();
    }

    advance() {
        this.tokIdx++;
        if (this.tokIdx < this.tokens.length) {
            this.currentTok = this.tokens[this.tokIdx];
        }
        return this.currentTok;
    }

    parse() {
        var countVal = this.count;
        var res = this.expr();
        if (!res.error && this.currentTok.type != TokenType.EOF) {
            return res.failure(new InvalidSyntaxError(
                this.currentTok.posStart, this.currentTok.posEnd,
                "Expected Approal Type"
            ))
        }
        // countVal -= 1;
        return res;
    }

    factor() {
        var res = new ParseResult();
        var tok = this.currentTok;
        if ([TokenType.ADD].includes(tok.type)) {
            res.register(this.advance());
            var factor = res.register(this.factor());
            if (res.error) return res;
            return res.success(new UnaryOpNode(tok, factor))
        } else if ([ApprovalType.SequentialApproval, ApprovalType.ParallelApproval, UserType.Approver].includes(tok.type)) {
            res.register(this.advance());
            return res.success(new TokenNode(tok))
        }
        return res.failure(new InvalidSyntaxError(
            tok.posStart, tok.posEnd,
            "Expected int or float"
        ).log())
    }

    term() {
        return this.binOp(this.factor.bind(this), [ApprovalType.SequentialApproval, ApprovalType.ParallelApproval])
    }

    expr() {
        return this.binOp(this.factor.bind(this), [TokenType.ADD])
        // return this.binOp(this.term.bind(this), [TokenType.ADD])
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
        return tokens;
    }


    /**
     *
     * @param {Function} func
     * @param {Array} ops
     * @returns
     */
    binOp(func, ops) {
        var res = new ParseResult();
        var left = res.register(func())
        if (res.error) return res;

        while (ops.includes(this.currentTok.type)) {
            var opTok = this.currentTok;
            res.register(this.advance());
            var right = res.register(func());
            if (res.error) return res;
            left = new BinOpNode(left, opTok, right);
        }

        return res.success(left);
    }
}
