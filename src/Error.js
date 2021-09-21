class BasicError {
    constructor(name, details) {
        this.name = name;
        this.details = details;
    }

    log() {
        var result = `${this.name}:${this.details}`;
        console.log(result);
        // return result;
    }
}

export class IllegalCommandError extends BasicError {
    constructor(details) {
        super("Illegal Command", details);
    }
}

export class InvalidFileError extends BasicError {
    constructor(details) {
        super("Invalid file", details);
    }
}

export class InvalidSyntaxError extends BasicError {
    constructor(details) {
        super("Invalid file", details);
    }
}