

export class UnaryOpNode {
    constructor(opTok, node) {
        this.opTok = opTok;
        this.node = node;
    }

    toString() {
        return `( ${this.opTok.toString()},${this.node.toString()})`;
    }
}


export class SequentialApprovalNode {
    constructor(level, type, approver) {
        this.level = level;
        this.type = type;
        if (!approver) this.approver = new ApproverNode();
        else this.approver = approver;
    }
}

export class ParrellelApprovalNode {
    constructor(level, type, approver) {
        this.level = level;
        this.type = type;
        if (!approver) this.approver = new Array();
        else this.approver = approver;
    }
}

export class ApproverNode {
    constructor(name) {
        this.name = name;
    }
}