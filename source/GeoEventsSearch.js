enyo.kind({
    name: "MyLastFM.GeoEventsSearch",
    kind: "enyo.VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        { name: "pane", kind: "enyo.Pane", flex: 1,
            components: [
                { name: "search", className: "enyo-bg", layoutKind: "VFlexLayout",
                    components: [
                        {
                            name: "getLocationCall",
                            kind: "enyo.PalmService",
                            service: "palm://com.palm.location/",
                            method: "getCurrentPosition",
                            onSuccess: "gotLocation",
                            onFailure: "locationFailure"
                        },
                        {
                            name: "getRevLocationCall",
                            kind: "enyo.PalmService",
                            service: "palm://com.palm.location/",
                            method: "getReverseLocation",
                            onSuccess: "gotRevLocation",
                            onFailure: "revLocationFailure"
                        },
                        { name: "scrim", kind: "MyLastFM.Scrim" },
                        { name: "getGeoEvents", kind: "MyLastFM.LastFM.GeoEvents",
                            onData: "gotGeoEvents", onNoData: "noGeoEvents" },
                        { kind: "enyo.PageHeader",
                            components: [
                                { name: "backButton", kind: "enyo.Button", content: "Back",
                                    onclick: "backClicked" },
                                { name: "headerText", layoutKind: "HFlexLayout", pack: "center",
                                    content: "Events", flex: 1 },
                                { name: "locationButton", kind: "enyo.Button", content: "Location",
                                    onclick: "locationButtonClicked" }
                            ]
                        },
                        { kind: "enyo.RowGroup", caption: "Location",
                            components: [
                                { kind: "enyo.InputBox",
                                    components: [
                                        { name: "location", kind: "enyo.Input", flex: 1 },
                                        { kind: "enyo.Button", caption: "Get Events", onclick: "getEventsClicked" }
                                    ]
                                }
                            ]
                        },
                        { kind: "enyo.Scroller", flex: 1, autoHorizontal: false, horizontal: false,
                            components: [
                                { name: "message" },
                                { name: "list", kind: "enyo.VirtualRepeater", onSetupRow: "setupEventRow",
                                    components: [
                                        { kind: "enyo.Item", layoutKind: "HFlexLayout",
                                            components: [
                                                { name: "venueImage", kind: "enyo.Image", className: "image" },
                                                { kind: "enyo.VFlexBox", className: "label", flex: 1,
                                                    components: [
                                                        { name: "artist" },
                                                        { name: "venueName" },
                                                        { name: "startDate" }
                                                    ]
                                                }
                                            ],
                                            onclick: "eventClicked"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { name: "detail", kind: "MyLastFM.Detail", className: "enyo-bg", lazy: true,
                    onBack: "goBack" },
                { name: "geoEvent", kind: "MyLastFM.Event", className: "enyo-bg", lazy: true,
                    onBack: "goBack", onLinkClick: "linkClicked" }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.message.hide();
        this.$.getGeoEvents.setScrim(this.$.scrim);
        this.$.pane.selectViewByName("search");
    },
    showingChanged: function () {
        if (!MyLastFM.preferences) return;

        if (this.$.location.getValue() === "") {
            this.$.location.setValue(MyLastFM.preferences.defaultLocation);
        }
    },
    goBack: function (inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    locationButtonClicked: function (inSender, inEvent) {
        this.$.scrim.showScrim(true);
        this.$.getLocationCall.call();
        this.geoEvents = {};
    },
    gotLocation: function (inSender, inResponse) {
        enyo.log("got success from getLocation");
        this.$.getRevLocationCall.call({
            latitude: inResponse.latitude,
            longitude: inResponse.longitude
        });
    },
    locationFailure: function (inSender, inResponse) {
        enyo.warn("got failure from getLocation");
        this.$.scrim.showScrim(false);
    },
    gotRevLocation: function (inSender, inResponse) {
        enyo.log("got success from getRevLocation");
        this.$.location.setValue(inResponse.city + ", " + inResponse.country);
        this.$.scrim.showScrim(false);
    },
    revLocationFailure: function (inSender, inResponse) {
        enyo.warn("got failure from getRevLocation");
        this.$.scrim.showScrim(false);
    },
    getEventsClicked: function () {
        var location = this.$.location.getValue();
        this.$.getGeoEvents.search(location);
        this.geoEvents = {};
        this.page = 1;
    },
    gotGeoEvents: function (inSender, inGeoEvents) {
        var previousEvents = this.geoEvents.events || [];
        this.geoEvents = inGeoEvents;
        this.geoEvents.events = previousEvents.concat(inGeoEvents.events);
        this.$.message.hide();
        this.$.location.setValue(inGeoEvents.location);
        this.$.list.show();
        this.$.list.render();
    },
    noGeoEvents: function (inSender, inMessage) {
        this.$.list.hide();
        this.$.message.setContent(inMessage);
        this.$.message.show();
    },
    setupEventRow: function (inSender, inIndex) {
        var e,
            imageURI;

        if (!this.geoEvents) return;

        e = this.geoEvents.events[inIndex];

        if (e) {
            imageURI = MyLastFM.LastFM.JSONService.getImageURI(e.venue.image, "medium") ||
                MyLastFM.LastFM.JSONService.getImageURI(e.image, "medium");
            this.$.venueImage.setSrc(imageURI);
            this.$.artist.setContent(e.artists.headliner);
            this.$.venueName.setContent(e.venue.name);
            this.$.startDate.setContent(e.startDate);
            return true;
        } else if (this.page === this.geoEvents.page &&
                   this.page < this.geoEvents.totalPages) {
            this.$.venueName.setContent("Load more...");
            this.page += 1;
            return true;
        }
    },
    eventClicked: function (inSender, inEvent) {
        var e = this.geoEvents.events[inEvent.rowIndex];

        if (e) {
            this.$.pane.selectViewByName("geoEvent");
            this.$.geoEvent.setEventItem(e);
        } else {
            this.$.getGeoEvents.search(this.geoEvents.location, this.page);
        }
    },
    linkClicked: function (inSender, inUrl) {
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(inUrl);
    }
});