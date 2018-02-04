import { IClonableItem } from "./IClonableItem";
import { IEventMessageItem } from "./EventMessageItem";

export interface IManagerItem<T> extends IClonableItem<T>, IEventMessageItem {}