// GROUP MB-D
// color C2, neopixel N2, gate G2
// radio from MB-A

// LAST UPDATE 12/18

// PINOUT
let PIN_NEOPIXEL = DigitalPin.P1;
let PIN_SERVO = AnalogPin.P0;
let PIN_SDA = DigitalPin.P19;
let PIN_SCL = DigitalPin.P20;

// INIT
radio.setGroup(8);
basic.showString("D");
apds9960.Init(11.12);
apds9960.ColorMode();
let NUM_LEDS = 8;
let strip = neopixel.create(PIN_NEOPIXEL, NUM_LEDS, NeoPixelMode.RGB);

// COLORS
let COL_WHITE = 256;
let COL_BLUE = 216;
let COL_GREEN = 150;
let COL_YELLOW = 20;
// let COL_ORANGE = 0;
let COL_PINK = -14;
let COL_NO_COLOR = 60;
let COL_EMPTY = -1000;
let ARR_COL = [COL_BLUE, COL_GREEN, COL_YELLOW, COL_PINK];
let NUM_COLORS = ARR_COL.length;
let ERROR = 20;
let LIGHT_TRESHOLD = 1200;

// NEOPIXEL COLORS
let NEO_BLUE = neopixel.rgb(0, 203, 255);
let NEO_GREEN = neopixel.rgb(28, 238, 0);
let NEO_YELLOW = neopixel.rgb(255, 130, 0);
let NEO_PINK = neopixel.rgb(255, 0, 59);
let NEO_ORANGE = neopixel.rgb(255, 34, 0);

// VARIABLES
let colorCorrect = COL_EMPTY;
let colorMeasured = COL_NO_COLOR;
let colorNeopixel = 0;
let ambientMeasured = 0;
let servo = 45;
let isCorrect = false;

// CONSTANTS
let SERVO_OPEN = 85;
let SERVO_CLOSE = 10;

// RADIO
let RADIO_RESET = 1;
let RADIO_CLOSE = 2;
let RADIO_COLOR_NAME = "COLOR2";

// INTERRUPT
radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber === RADIO_RESET) {
        resetState();
    }
})

radio.onReceivedValue(function (name: string, value: number) {
    if (name === RADIO_COLOR_NAME) {
        colorCorrect = value;
        // basic.showNumber(value);
    }
})

// MAIN
basic.forever(function () {
    if (apds9960.Data_Ready()) {
        colorMeasured = apds9960.ReadColor();
        ambientMeasured = apds9960.Read_Ambient();
    } else {
        //
    }
    if (ambientMeasured <= LIGHT_TRESHOLD) {
        colorNeopixel = NeoPixelColors.White;
        isCorrect = false;
    } else {
        // check if correct
        if (colorMeasured <= colorCorrect + ERROR && colorMeasured >= colorCorrect - ERROR) {
            isCorrect = true;
        } else {
            isCorrect = false;
        }
        // neopixel
        if (colorMeasured <= COL_GREEN + ERROR && colorMeasured >= COL_GREEN - ERROR) {
            colorNeopixel = NEO_GREEN;
        } else if (colorMeasured <= COL_BLUE + ERROR && colorMeasured >= COL_BLUE - ERROR) {
            colorNeopixel = NEO_BLUE;
        } else if (colorMeasured <= COL_YELLOW + ERROR && colorMeasured >= COL_YELLOW - ERROR) {
            colorNeopixel = NEO_YELLOW;
        } else if (colorMeasured <= COL_PINK + ERROR && colorMeasured >= COL_PINK - ERROR) {
            colorNeopixel = NEO_PINK;
        } else {
            colorNeopixel = NeoPixelColors.White;
        }
    }
    strip.showColor(colorNeopixel);
    pause(100);
})

basic.forever(function () {
    if (isCorrect) {
        gateOpen();
    } else {
        gateClose();
    }
    pins.servoWritePin(PIN_SERVO, servo);
})

// FUNCTIONS
function resetState() {
    gateClose();
}

function gateOpen(){
    servo = SERVO_OPEN;
}

function gateClose(){
    servo = SERVO_CLOSE;
}