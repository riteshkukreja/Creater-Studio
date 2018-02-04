import { Exception } from "./Exception";

export class ItemNotFoundException extends Exception {

    constructor(message: string) {
        super("Item Not Found Exception", message);
    }

}