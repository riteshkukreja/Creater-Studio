export interface IConverter<T, U> {

    /**
     * Convert a particular type of message to another type
     * 
     * @param obj: Source message in first format
     * @returns message in second format
     */
    convert(obj: T): U;

}