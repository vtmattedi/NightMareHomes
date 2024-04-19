
/* Milliseconds to go stale */
const TIME_TO_STALE_MS = 300 * 1000; // 5 minutes
/* check for type by default? */
const DEFAULT_TYPE_CHECK = true;
/* Milliseconds before reversing back to server value */
const TIME_BEFORE_ASSERT_MS = 30 * 1000; // 1 minute

export default class ServerVariable {
    constructor(label: string, type: string = "any") {
        this.#type = type;
        this.#label = label;
    }
    #value: any; // value from client
    #serverValue: any; // value from the server
    onValueChanged(value: any): void { }; // callback when value changes
    #enableTypeCheck: boolean = DEFAULT_TYPE_CHECK; // enable type checking when receiving from client or server
    #label: string; // label of the variable
    #type: string;  // type of the variable
    #stale: boolean = true; // sets the stale flag
    #assertHandled: boolean = false; // controls if the last assertion has been handled
    #serverTimestamp: number = 0; // timestamp of the last server update
    #debug: boolean = false; // set to true to enable debug messages
    #timeToAssert_ms: number = 0; // time to assert the server value in ms

    // Debug print function
    #debugPrint(message: string): void {
        if (this.#debug) {
            console.log(`[${this.#label}]: ${message}`);
        }
    }
    /**
     * Syncronizes the client value with the server value.
     * Also sets variable as stale if the time since last server update is greater than `TIME_TO_STALE_MS` milliseconds.
    */
    sync(): void {
        if (new Date().getTime() - this.#serverTimestamp > TIME_TO_STALE_MS && !this.#stale) {
            this.#stale = true;
            this.#debugPrint("going stale.");
        }
        // timeToAssert_ms have elapsed since last assertion
        if (new Date().getTime() > this.#timeToAssert_ms && !this.#assertHandled) {
            if (this.#serverValue !== this.#value) {
                this.#value = this.#serverValue;
                this.onValueChanged(this.#value);
            }
            this.#value = this.#serverValue;
            this.#debugPrint(`Asserting server value.`);
            this.#debugPrint(`Server: ${this.#serverValue}, Client: ${this.#value}`);
            this.#assertHandled = true;
        }
    }

    /**
     * Checks if the given value matches the expected type.
     * @param value - The value to be checked.
     * @param force - If `true`, the type check will be forced, regardless of the `enableTypeCheck` setting.
     * @returns Returns `true` if the value matches the expected type, otherwise `false`.
     */
    #typeCheck(value: any, force: boolean = false): boolean {
        if ((this.#enableTypeCheck && this.#type !== "any" && this.#type !== "undefined") || force) {
            if (typeof value !== this.#type) {
                this.#debugPrint(`Type mismatch: expected ${this.#type}, got ${typeof value}`);
                return false;
            }
        }
        return true;
    }

    /**
     * Handles the server value and updates the client value accordingly.
     * @param value - The value received from the server.
     */
    HandleServer(value: any): void {
        this.#typeCheck(value);
        this.#serverValue = value;
        this.#serverTimestamp = new Date().getTime();
        this.#stale = false;
        // if the client havent changed the value since last assertion, update the client value directly
        // from the server value.
        // if (this.#debug)
            // console.log(this.#label, this.#assertHandled, this.#serverValue, this.#value, this.#serverValue !== this.#value, value);
        if (this.#assertHandled) {
            if (this.#serverValue !== this.#value) {
                this.#value = this.#serverValue;
            }
        }
    }

    // Change the value from the client side.
    // TODO: implement a send function to send the value to the server.
    change(value: any): boolean {
        if (this.#typeCheck(value)) {
            this.#timeToAssert_ms =  new Date().getTime() + TIME_BEFORE_ASSERT_MS; // time to assert the server value in ms
            this.#assertHandled = false;
            if (this.#value !== value) {
                this.#value = value;
                this.onValueChanged(value);
            }
            return true;
        }
        else {
            this.#debugPrint("Type mismatch changing client value.");
            return false;
        }

    }

    get value() {
        return this.#value;
    }
    get stale() {
        return this.#stale;
    }
    set debug(debug: boolean) {
        this.#debug = debug;
    }
}