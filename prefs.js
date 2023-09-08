'use strict';
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const DeviceList = Me.imports.lib.deviceList;

const {General} = Me.imports.preferences.general;
const {ThresholdPrimary} = Me.imports.preferences.thresholdPrimary;
const {ThresholdSecondary} = Me.imports.preferences.thresholdSecondary;
const {addMenu} = Me.imports.preferences.menu;

function fillPreferencesWindow(window) {
    let currentDevice = null;
    const settings = ExtensionUtils.getSettings();
    const type = settings.get_int('device-type');

    if (type !== 0) {
        const device = new DeviceList.deviceArray[type - 1](settings);
        if (device.type === type) {
            if (device.isAvailable())
                currentDevice = device;
        }
    }

    window.set_default_size(650, 700);

    addMenu(window);

    window.add(new General(settings, currentDevice));

    if (currentDevice !== null) {
        if (currentDevice.deviceHaveVariableThreshold) // Laptop has customizable threshold
            window.add(new ThresholdPrimary(settings, currentDevice));

        if (currentDevice.deviceHaveDualBattery) // Laptop has dual battery
            window.add(new ThresholdSecondary(settings, currentDevice));
    }
}

function init() {
    ExtensionUtils.initTranslations(Me.metadata.uuid);
}
