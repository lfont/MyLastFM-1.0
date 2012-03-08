enyo.kind({
    name: "MyLastFM.App",
    kind: "enyo.VFlexBox",
    components: [
        { name: "pane", kind: "enyo.Pane", flex: 1,
            components: [
                    { name: "menu", kind: "enyo.VFlexBox", className: "enyo-bg",
                        components: [
                            { kind: "enyo.PageHeader", content: "Home", layoutKind: "HFlexLayout", pack: "center" },
                            { kind: "enyo.VFlexBox", flex: 1,
                                components: [
                                    { kind: "enyo.Button", onclick: "artistClicked", flex: 1,
                                        layoutKind: "VFlexLayout", pack: "center",
                                        components: [
                                            { content: "Artist" }
                                        ]
                                    },
                                    { kind: "enyo.Button", onclick: "eventsClicked", flex: 1,
                                        layoutKind: "VFlexLayout", pack: "center",
                                        components: [
                                            { content: "Events" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    { name: "preferences", kind: "MyLastFM.Preferences", className: "enyo-bg",
                        onReceive: "preferencesReceived", onSave: "preferencesSaved", onCancel: "goBack" },
                    { name: "artistSearch", kind: "MyLastFM.ArtistSearch", className: "enyo-bg", lazy: true,
                        onBack: "goBack" },
                    { name: "geoEventsSearch", kind: "MyLastFM.GeoEventsSearch", className: "enyo-bg", lazy: true,
                        onBack: "goBack" }
            ]
        },
        { kind: "enyo.AppMenu",
            components: [
                { caption: "Preferences", onclick: "showPreferencesClicked" },
                { caption: "About", onclick: "showAboutClicked" }
            ]
        },
        { name: "about", kind: "enyo.ModalDialog", className: "about", caption: "MyLastFM",
            layoutKind: "VFlexLayout", pack: "end", align: "center",
            components: [
                { layoutKind: "VFlexLayout", pack: "end", align: "center",
                    components: [
                        { content: "Loïc Fontaine - 2012" },
                        { content: "MIT Licensed" }
                    ]
                },
                { kind: "enyo.Button", caption: "Close", onclick: "closeAboutDialogClicked" }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.pane.selectViewByName("menu");
    },
    openAppMenuHandler: function () {
        this.$.appMenu.open();
    },
    closeAppMenuHandler: function () {
        this.$.appMenu.close();
    },
    showPreferencesClicked: function () {
        this.$.pane.selectViewByName("preferences");
    },
    showAboutClicked: function () {
        this.$.about.openAtCenter();
    },
    closeAboutDialogClicked: function (inSender, inEvent) {
        this.$.about.close();
    },
    preferencesReceived: function (inSender, inPreferences) {
        MyLastFM.preferences = inPreferences;
    },
    preferencesSaved: function (inSender, inPreferences) {
        MyLastFM.preferences = inPreferences;
        this.$.pane.back();
    },
    goBack: function (inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    artistClicked: function (inSender, inEvent) {
        this.$.pane.selectViewByName("artistSearch");
    },
    eventsClicked: function (inSender, inEvent) {
        this.$.pane.selectViewByName("geoEventsSearch");
    }
});