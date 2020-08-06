class RouterError {
    name: string
    message: string
    status: number
    constructor(name: string, message :string, status :number) {
        this.name = name;
        this.message = message;
        this.status = status;
    }
};

export class InvalidPath extends RouterError {
    constructor(method: string) {
        super(method, 'Invalid Path', 400);
    }
}

export class InvalidInput extends RouterError {
    constructor() {
        super('Input', 'Invalid Input', 400);
    }
}