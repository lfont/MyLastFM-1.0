enyo.kind({
    name: "MyLastFM.Preferences",
    kind: enyo.VFlexBox,
    events: {
            onReceive: "",
            onSave: "",
            onCancel: ""
    },
    components: [
            {
                    name: "getPreferencesCall",
                    kind: enyo.PalmService,
                    service: "palm://com.palm.systemservice/",
                    method: "getPreferences",
                    onSuccess: "getPreferencesSuccess",
                    onFailure: "getPreferencesFailure"
            },
            {
                    name: "setPreferencesCall",
                    kind: enyo.PalmService,
                    service: "palm://com.palm.systemservice/",
                    method: "setPreferences",
                    onSuccess: "setPreferencesSuccess",
                    onFailure: "setPreferencesFailure"
            },
            { kind: enyo.PageHeader, content: "MyLastFM - Preferences", layoutKind: "HFlexLayout", pack: "center" },
            { kind: enyo.VFlexBox, flex: 1,
                    components: [
                            { kind: enyo.RowGroup, caption: "Default Location",
                                components: [
                                    {name: "defaultLocationInput", kind: enyo.Input }
                                ]
                            },
                            { kind: enyo.HFlexBox,
                                    components: [
                                            { name: "saveButton", kind: enyo.Button, flex: 1,
                                                caption: "Save", onclick: "saveClicked" },
                                            { name: "cancelButton", kind: enyo.Button, flex: 1,
                                                caption: "Cancel", onclick: "cancelClicked" }
                                    ]
                            }
                    ]
            }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.getPreferencesCall.call(
            {
                "keys": [
                    "defaultLocation"
                ]
            });
        // keep this updated with the value that's currently saved to the service
        this.savedPreferences = {};
    },
    getPreferencesSuccess: function (inSender, inResponse) {
        enyo.log("got success from getPreferences");
        this.savedPreferences = inResponse || {};
        this.savedPreferences.defaultLocation = this.savedPreferences.defaultLocation || "";
        this.$.defaultLocationInput.setValue(this.savedPreferences.defaultLocation);
        this.doReceive(this.savedPreferences);
    },
    getPreferencesFailure: function (inSender, inResponse) {
        enyo.warn("got failure from getPreferences");
    },
    setPreferencesSuccess: function (inSender, inResponse) {
        enyo.log("got success from setPreferences");
    },
    setPreferencesFailure: function (inSender, inResponse) {
        enyo.warn("got failure from setPreferences");
    },
    showingChanged: function () {
        if (!this.savedPreferences) return;
        // reset contents of text input box to last saved value
        this.$.defaultLocationInput.setValue(this.savedPreferences.defaultLocation);
    },
    saveClicked: function (inSender, inEvent) {
        this.savedPreferences.defaultLocation = this.$.defaultLocationInput.getValue();
        this.$.setPreferencesCall.call(this.savedPreferences);
        this.doSave(this.savedPreferences);
    },
    cancelClicked: function () {
        this.doCancel();
    }
});