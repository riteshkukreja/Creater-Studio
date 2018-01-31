export interface IManager<T> {
    add(obj: T): void;
    update(obj: T): void;
    delete(_id: string): T;
    get(_id: string): T;
}