export interface IClonableItem<T> {

    /**
     * Creates a deep clone of the original object
     * 
     * @returns clone of calling object
     */
    clone(): T;
}