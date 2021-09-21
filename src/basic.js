import { Lexer } from "./Lexer.js"
import { Parser } from "./Parser.js"
import { evaluate } from "./Evaluate.js"
import { ApprovalType, TokenType } from "./type.js"
import { IllegalCommandError, InvalidFileError, InvalidSyntaxError } from "./Error.js"
import fs from "fs"
// const Lexer = require('./Lexer');
// const fs = require('fs');


// function stringWithArrow(text, posStart, posEnd) {
//     var result = '';
// }




Object.freeze(TokenType);


/**
 *
 * @param {Array} args
 */

function main(args) {
    args.shift();
    args.shift();
    if (args[0] === "compile") {
        var path = args[1];
        if (fs.existsSync(path)) {
            var val = fs.readFileSync(path, { encoding: "utf-8" });
            var lexer = new Lexer(path, val);
            // console.log(lexer.start().list());
            var returns = lexer.start();

            if (!(returns == null)) {
                var parser = null;
                var lineCount = lexer.count;
                var returnObject = {};
                console.log(returns);
                while (lineCount > -1) {
                    if (!parser) parser = new Parser(returns, lexer.count, -1);
                    else parser = new Parser(returns, lexer.count, parser.tokIdx);
                    var ast = parser.parse();
                    if (ast.error) return ast.error.log();
                    returnObject = new evaluate(returnObject).Expression(ast.node);
                    lineCount -= 1;
                }
                console.log(Object.values(returnObject));

            }
        } else {
            return new InvalidFileError(`file '${path}' could not be found!`).log();
        }
    } else {
        return new IllegalCommandError(`Command '${args[0]}' could not be found!`).log();
    }
}


main(process.argv);