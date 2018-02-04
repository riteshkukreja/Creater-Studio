import { IException } from "../interfaces/IException";

export class Exception implements IException {
    private _message: string;
    private _name: string;

    constructor(name: string, message: string) {
        this._name = name;
        this._message = message;
    }

    getMessage(): string {
        return this._message;
    }

    getName(): string {
        return this._name;
    }
    
}