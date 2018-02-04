import { Exception } from "./Exception";

export class InvalidArgException extends Exception {

    constructor(message: string) {
        super("Invalid Argument Exception", message);
    }

}