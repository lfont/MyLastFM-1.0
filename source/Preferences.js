enyo.kind({
    name: "MyLastFM.Preferences",
    kind: "enyo.VFlexBox",
    events: {
        onReceive: "",
        onSave: "",
        onCancel: ""
    },
    components: [
        {
            name: "getPreferencesCall",
            kind: "enyo.PalmService",
            service: "palm://com.palm.systemservice/",
            method: "getPreferences",
            onSuccess: "getPreferencesSuccess",
            onFailure: "getPreferencesFailure"
        },
        {
            name: "setPreferencesCall",
            kind: "enyo.PalmService",
            service: "palm://com.palm.systemservice/",
            method: "setPreferences",
            onSuccess: "setPreferencesSuccess",
            onFailure: "setPreferencesFailure"
        },
        {
            kind: "enyo.PageHeader",
            content: "Preferences",
            layoutKind: "HFlexLayout",
            pack: "center"
        },
        {
            kind: enyo.VFlexBox,
            flex: 1,
            components: [
                {
                    kind: "enyo.RowGroup",
                    caption: "Default Artist Name",
                    components: [
                        {
                            name: "artistNameInput",
                            kind: "enyo.Input"
                        }
                    ]
                },
                {
                    kind: "enyo.RowGroup",
                    caption: "Default Location",
                    components: [
                        {
                            name: "locationInput",
                            kind: "enyo.Input"
                        }
                    ]
                },
                {
                    kind: "enyo.HFlexBox",
                    components: [
                        {
                            name: "saveButton",
                            kind: "enyo.Button",
                            flex: 1,
                            caption: "Save",
                            onclick: "saveClicked"
                        },
                        {
                            name: "cancelButton",
                            kind: "enyo.Button",
                            flex: 1,
                            caption: "Cancel",
                            onclick: "cancelClicked"
                        }
                    ]
                }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.getPreferencesCall.call({
            "keys": [
                "artistName",
                "location"
            ]
        });
        // Default preferences.
        // Keep this updated with the value that's currently saved to
        // the service.
        this.savedPreferences = {
            artistName: "",
            location: ""
        };
    },
    getPreferencesSuccess: function (inSender, inResponse) {
        enyo.log("got success from getPreferences");
        if (inResponse) {
            // Do not loose the default if it has not been saved.
            enyo.mixin(this.savedPreferences, inResponse);
        }
        this.$.artistNameInput.setValue(this.savedPreferences.artistName);
        this.$.locationInput.setValue(this.savedPreferences.location);
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
        // Reset contents of text input box to last saved value.
        this.$.artistNameInput.setValue(this.savedPreferences.artistName);
        this.$.locationInput.setValue(this.savedPreferences.location);
    },
    saveClicked: function (inSender, inEvent) {
        var prefs = {
            artistName: this.$.artistNameInput.getValue(),
            location: this.$.locationInput.getValue()
        };
        this.$.setPreferencesCall.call(prefs);
        this.savedPreferences.artistName = prefs.artistName;
        this.savedPreferences.location = prefs.location;
        this.doSave(this.savedPreferences);
    },
    cancelClicked: function () {
        this.doCancel();
    }
});