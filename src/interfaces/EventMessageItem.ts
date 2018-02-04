export interface IEventMessageItem {
    getId(): string|null;
    setId(uuid: string): void;
}

export class EventMessageItem implements IEventMessageItem {
    private id: string|null = null;

    getId(): string|null {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }
}