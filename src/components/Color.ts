export class Color {
    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;

    constructor(r: number, g: number, b: number, a: number) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a || 1;
    }

    toString(): string {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + (this.alpha) + ")";
    }

    clone(): Color {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }
    
    get Red(): number {
        return this.red;
    }
    
    get Blue(): number {
        return this.blue;
    }
    
    get Green(): number {
        return this.green;
    }
    
    get Alpha(): number {
        return this.alpha;
    }
    
    set Alpha(alpha: number) {
        this.alpha = alpha;
    }
}