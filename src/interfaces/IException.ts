export interface IException {

    /**
     * Returns the exception details
     */
    getMessage(): string;

    /**
     * Returns the type of exception
     */
    getName(): string;
}