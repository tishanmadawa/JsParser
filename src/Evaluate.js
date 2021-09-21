import { UnaryOpNode, ParrellelApprovalNode, SequentialApprovalNode, ApproverNode } from "./Node.js"
import { ApprovalType, TokenType } from "./type.js"

export class evaluate {
    constructor(returnObject) {
        this.returnObject = returnObject;
    }

    Expression(node) {
        if (node instanceof UnaryOpNode) {
            if (node.opTok.type == TokenType.ADD) {
                switch (node.node.tok.type) {
                    case ApprovalType.SequentialApproval:
                        var token = node.node.tok;
                        var seqApproval = new SequentialApprovalNode(token.value, token.type);
                        var seqApprovalJson = JSON.stringify(seqApproval);
                        this.returnObject[seqApproval.level] = JSON.parse(seqApprovalJson);
                        break;
                    case ApprovalType.ParallelApproval:
                        var token = node.node.tok;
                        var seqApproval = new ParrellelApprovalNode(token.value, token.type);
                        var seqApprovalJson = JSON.stringify(seqApproval);
                        this.returnObject[seqApproval.level] = JSON.parse(seqApprovalJson);
                        break;
                    default:
                        null
                        break;
                }
            }
        }


        return this.returnObject;
    }
}