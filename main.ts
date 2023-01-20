import { Gpio } from "onoff"
import {
    Accessory,
    Categories,
    Characteristic,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback,
    CharacteristicValue,
    Service,
    uuid
} from "hap-nodejs";

const pin = new Gpio(14, "out");

const accessoryUuid = uuid.generate("dev.bene.roller");
const accessory = new Accessory("Rollladen", accessoryUuid);

const rollerService = new Service.Switch("Rollladen");
const onCharacteristic = rollerService.getCharacteristic(Characteristic.On)!;

let currentLightState = false;

onCharacteristic.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
    pin.writeSync(currentLightState ? 1 : 0)
    callback(undefined, currentLightState);
});

onCharacteristic.on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
    currentLightState = value as boolean;
    pin.writeSync(currentLightState ? 1 : 0)
    callback();
});

accessory.addService(rollerService);

accessory.publish({
    username: "17:51:07:F4:BC:8A",
    pincode: "384-28-149",
    port: 47128,
    category: Categories.WINDOW_COVERING,
});