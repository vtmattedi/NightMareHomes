import ServerVariables from "./ServerVariables";

/**
 * Inserts the owner into the topic if it is not already present.
 * @param owner - The owner to insert.
 * @param topic - The topic to insert the owner into.
 * @returns The updated topic with the owner inserted.
 */
const insertOwner = (owner: string, topic: string): string => {
    if (topic.indexOf(owner) === 0) {
        return topic;
        //Topic already has the owner.
    }
    if (topic.indexOf('/') != 0) {
        topic = '/' + topic;
    }
    topic = owner + topic;
    return topic;
}

/*Constants defining values for second, minute and hour in milliseconds*/
const SEC = 1000; // 1 second
const MIN = 60 * SEC; // 1 minute
const HOUR = 60 * MIN; // 1 hour

/**
 * Gets the time left between the current time and the provided date or number.
 * @param dateInfo - The date or number representing the target time. (number in seconds)
 * @param future - Optional. Specifies whether the target time is in the future. Default is false.
 * @returns A string representing the time left in the format "HH:mm".
 */
const getTime = (dateInfo: Date | number, future: boolean = false): string => {
    var usedTime: number = 0;
    var now = new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;
    if (dateInfo instanceof Date) {
        usedTime = dateInfo.getTime();
    }
    else if (typeof (dateInfo) === "number") {
        usedTime = dateInfo * 1000;
    }
    const negative = future ? now > usedTime : now < usedTime;
    const ms_diff = Math.abs(usedTime - now);

    var finalTime: string = "";
    if (negative)
        finalTime = "-";

    //Add the HH:mm of the time left to the usedTime.
    if (ms_diff / HOUR < 10)
        finalTime += "0";
    finalTime += Math.floor(ms_diff / HOUR).toString() + ":";
    if ((ms_diff % HOUR) / MIN < 10)
        finalTime += "0";
    finalTime += Math.floor((ms_diff % HOUR) / MIN).toString()
    return finalTime;
}

/**
 * Returns the maximum value between two numbers, handling undefined and null values.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The maximum value between `a` and `b`. If both `a` and `b` are undefined or null, returns 0.
 */
const safeMax = (a: number | undefined | null, b: number | undefined | null): number => {
    if (a === undefined || a === null) {
        if (b === undefined || b === null) {
            return 0;
        }
        return b;
    }
    if (b === undefined || b === null) {
        return a;
    }
    return Math.max(a, b);

}

/*Light Controller Class for JavaScript/TypeScript */
class LightController {
    constructor(hostName: string) {
        this.#hostName = hostName;
    }

    #state: ServerVariables = new ServerVariables("Light State", "boolean");
    #automationRestore: ServerVariables = new ServerVariables("Automation Restore", "number");
    #hostName: string;
    publishFn: Function = null;
    assert(mqtt_string: string) {
        const data = JSON.parse(mqtt_string);
        this.#state.HandleServer(data.State);
        this.#automationRestore.HandleServer(data.Automation);
    }
    toString(): string {
        return JSON.stringify({ "hostName": this.#hostName, "State": this.#state, "Automation": this.#automationRestore });
    }
    #send(topic: string, payload: string): boolean {
        if (this.publishFn) {
            var result = this.publishFn(insertOwner(this.#hostName, topic), payload);
            if (typeof (result) !== "boolean")
                return true;
            if (!result) {
                console.log("LightController.toggle: Failed to publish to the mqtt broker.");
            }
            return result;
        }
        else {
            console.log("LightController.toggle: publishFn is null, please define how to publish to the mqtt broker.");
            return false;
        }
    }
    toggle(force: boolean = false): void {
        this.#state.change(!this.#state.value);
        if (force) {
            this.#send("/Light", "toggle-force");
            this.#automationRestore.change((new Date().getTime() + 2 * HOUR) / 1000);
        }
        else {
            this.#send("/Light", "toggle");
        }
        //  this.#mqttclient.send("Mycroft/Light", "Toggle", 0, false);
    }
    setState(state: boolean): void {
        this.#state.change(state);
        this.#send("/Light", state ? "on" : "off");
    }
    syncServerVariables(): void {
        this.#state.sync();
        this.#automationRestore.sync();
    }
    restoreAutomation() {
        this.#automationRestore.change(0);
        this.#send("/Light", "auto");
    }
    get state() {
        return this.#state.value;
    }
    get stale() {
        return this.#state.stale;
    }
    get automationRestore() {
        return this.#automationRestore.value;
    }
}

//Not doing polymorphism here, for the lack of protectected members.
//Do not wan't to expose the state to the outside world.
class LightColorController {
    constructor(hostName: string) {
        this.#hostName = hostName;
        this.#color.debug = true;
    }
    publishFn: Function = null;
    #hostName: string;
    #color = new ServerVariables("Color", "number");
    #brightness = new ServerVariables("Brightness", "number");
    #state = new ServerVariables("State", "boolean");
    #automationRestore = new ServerVariables("Automation Restore", "number");
    #send = (topic: string, message: string) => {
        if (this.publishFn) {
            var result = this.publishFn(insertOwner(this.#hostName, topic), message);
            if (typeof (result) !== "boolean")
                return true;
            if (!result) {
                console.log("LightColorController.send: Failed to publish to the mqtt broker.");
            }
            return result;
        }
        else {
            console.log("LightController.toggle: publishFn is null, please define how to publish to the mqtt broker.");
            return false;
        }
    }
    restoreAutomation() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0);
        if (now >= start && now <= end) {
            this.#state.change(true);
        }
        else {
            this.#state.change(false);
        }
        this.#automationRestore.change(0);

        this.#send("/Lights", "auto");
    }
    setColor(color: number): void {
        if (color !== this.#color.value) {
            this.#color.change(color);
            this.#send("/Color", `${color}`);
        }
    }
    assert(mqtt_string: string) {
        //Sherlock/state {"Automation":0,"State":false,"Color":32768,"Brightness":127}
        const data = JSON.parse(mqtt_string);
        this.#automationRestore.HandleServer(data.Automation);
        this.#state.HandleServer(data.State);
        this.#color.HandleServer(data.Color);
        console.log("[Colordebug]", mqtt_string, data.Color);
        this.#brightness.HandleServer(data.Brightness);
    }
    syncServerVariables(): void {
        this.#color.sync();
        this.#brightness.sync();
        this.#state.sync();
        this.#automationRestore.sync();

    }
    toggle(force: boolean = false): void {
        /*
            u0 = light off
            u1 = light on
            u2 = toggle
        */
        this.#state.change(!this.#state.value);
        if (force) {

            this.#send("/Lights", this.#state ? "u1" : "u0");
        }
        else {
            this.#send("/Lights", "u2");
        }
        this.#automationRestore.change((new Date().getTime() - new Date().getTimezoneOffset() * MIN + HOUR) / 1000);
    }
    get color() {
        return this.#color.value;
    }

    get brightness() {
        return this.#brightness.value;
    }
    get state() {
        return this.#state.value;
    }
    get automationRestore() {
        return this.#automationRestore.value;
    }
    get stale() {
        return this.#state.stale;
    }

}

class AcController {
    constructor(hostName: string) {
        this.#hostName = hostName;
    }
    #hostName: string;
    #AcTemperature = new ServerVariables("AcTemperature", "number");
    #SetTemperature = new ServerVariables("SetTemperature", "number");
    #Temperature = 0xff;
    #SleepIn = new ServerVariables("SleepIn", "boolean");
    #DoorState = new ServerVariables("DoorState", "number");
    #SwSleep = new ServerVariables("SwSleep", "number");
    #HwSleep = new ServerVariables("HwSleep", "number");
    #modifiedTime = new Date().getTime();
    publishFn: Function = null;
    #send(topic: string, payload: string): boolean {
        if (this.publishFn) {
            var result = this.publishFn(insertOwner("Adler", topic), payload);
            if (typeof (result) !== "boolean")
                return true;
            if (!result) {
                console.log("AcController.toggle: Failed to publish to the mqtt broker.");
            }
            return result;
        }
        else {
            console.log("AcController.toggle: publishFn is null, please define how to publish to the mqtt broker.");
            return false;
        }
    }
    assert(mqtt_string: string) {
        const data = JSON.parse(mqtt_string);
        //Adler/state {"Control":"-1","Temp":23,"Ssleep":0,"Hsleep":0,"Settemp":-24,"Door":0,"SleepIn":false,"CurrTemp":24.5}
        this.#AcTemperature.HandleServer(data.Temp);
        this.#SetTemperature.HandleServer(data.Settemp);
        this.#SleepIn.HandleServer(data.SleepIn);
        this.#DoorState.HandleServer(data.Door);
        this.#SwSleep.HandleServer(data.Ssleep);
        this.#HwSleep.HandleServer(data.Hsleep);
        this.#Temperature = data.CurrTemp;
    }

    setTarget(temp: number): void {
        if (temp !== this.#SetTemperature.value) {
            this.#SetTemperature.change(parseFloat(temp.toFixed(1)));
            this.#send("/console/in", `TARGET ${this.#SetTemperature.value}`);
        }
    }

    toggleAc(): void {

    }
    toggleSet(): void {
        this.#SetTemperature.change(-this.#SetTemperature.value);
        this.#send("/console/in", `TARGET ${this.#SetTemperature.value}`);
    }
    setTemperature(temp: number): void {
        if (temp < 18 || temp > 30) {
            console.log("Temperature out of range.");
        }
        if (temp === this.#AcTemperature.value) {
            console.log("Same temperature as before. Not sending.");
            this.#AcTemperature.change(Math.floor(temp) - 1);
            return;
        }
        this.#AcTemperature.change(Math.round(temp));
        this.#send("/console/in", `SETTEMP ${this.#AcTemperature.value}`);
    }
    syncServerVariables(): void {
        this.#AcTemperature.sync();
        this.#SetTemperature.sync();
        this.#SleepIn.sync();
        this.#DoorState.sync();
        this.#SwSleep.sync();
        this.#HwSleep.sync();
    }

    setPower(state: boolean): void {
        if (state !== this.#AcTemperature.value > 0) {
            this.togglePower();
        }
    }

    togglePower(): void {
        this.#AcTemperature.change(-this.#AcTemperature.value);
        this.#send("/console/in", `SEND POWER`);
    }

    ignoreDoor(): void {
        this.#DoorState.change(0);
        this.#send("/console/in", `dooropen 0`);
    }

    setSleepIn(state: boolean | undefined): void {
        if (state === undefined) {
            this.#SleepIn.change(!this.#SleepIn.value);
        }
        else {
            this.#SleepIn.change(state);
        }
        this.#send("/console/in", `SLEEP-IN ${this.#SleepIn.value ? 1 : 0}`);
    }


    get AcTemperature() {
        return Math.abs(this.#AcTemperature.value);
    }
    get AcIsOn() {
        return this.#AcTemperature.value > 0;
    }
    get AcIsSet() {
        return this.#SetTemperature.value > 0;
    }
    get SetTemperature() {
        return Math.abs(this.#SetTemperature.value);
    }
    get RoomTemperature() {
        return this.#Temperature;
    }
    get stale() {
        return this.#AcTemperature.stale;
    }
    get doorState() {
        return this.#DoorState.value;
    }
    get SleepIn() {
        return this.#SleepIn.value;
    }
}


export { safeMax, getTime, LightController, LightColorController, AcController };
