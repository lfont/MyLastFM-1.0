enyo.kind({
    name: "App.ArtistEvents",
    kind: "enyo.VFlexBox",
    events: {
        onBack: ""
    },
    published: {
        artistName: ""
    },
    components: [
        { name: "pane", kind: "enyo.Pane", flex: 1,
            components: [
                { name: "search", className: "enyo-bg", layoutKind: "VFlexLayout",
                    components: [
                        { name: "scrim", kind: "App.Scrim" },
                        { name: "getArtistEvents", kind: "App.LastFM.ArtistEvents",
                            onData: "gotArtistEvents", onNoData: "noArtistEvents" },
                        { kind: "enyo.PageHeader",
                            components: [
                                { name: "backButton", kind: "enyo.Button", content: "Back",
                                    onclick: "backClicked" },
                                { name: "headerText", layoutKind: "HFlexLayout", pack: "center", flex: 1 }
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
                                                { kind: "enyo.VFlexBox", flex: 1, className: "label",
                                                    components: [
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
                { name: "detail", kind: "App.Detail", className: "enyo-bg", lazy: true,
                    onBack: "goBack" },
                { name: "artistEvent", kind: "App.Event", className: "enyo-bg", lazy: true,
                    onBack: "goBack", onLinkClick: "linkClicked" }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.message.hide();
        this.$.getArtistEvents.setScrim(this.$.scrim);
        this.$.pane.selectViewByName("search");
    },
    goBack: function (inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    artistNameChanged: function (inPreviousArtistName) {
        this.$.pane.selectViewByName("search");
        if (inPreviousArtistName !== this.artistName) {
            this.$.headerText.setContent("MyLastFM - " + this.artistName + "'s Events");
            this.$.getArtistEvents.search(this.artistName);
            this.artistEvents = {};
            this.page = 1;
        }
    },
    gotArtistEvents: function (inSender, inArtistEvents) {
        var previousEvents = this.artistEvents.events || [];
        this.artistEvents = inArtistEvents;
        this.artistEvents.events = previousEvents.concat(inArtistEvents.events);
        this.$.message.hide();
        this.$.list.show();
        this.$.list.render();
    },
    noArtistEvents: function (inSender, inMessage) {
        this.$.list.hide();
        this.$.message.setContent(inMessage);
        this.$.message.show();
    },
    setupEventRow: function (inSender, inIndex) {
        var e,
            imageURI;

        if (!this.artistEvents) return;

        e = this.artistEvents.events[inIndex];

        if (e) {
            imageURI = App.LastFM.GetDataService.getImageURI(e.venue.image, "medium") ||
                App.LastFM.GetDataService.getImageURI(e.image, "medium");
            this.$.venueImage.setSrc(imageURI);
            this.$.venueName.setContent(e.venue.name);
            this.$.startDate.setContent(e.startDate);
            return true;
        } else if (this.page === this.artistEvents.page &&
                   this.page < this.artistEvents.totalPages) {
            this.$.venueName.setContent("Load more...");
            this.page += 1;
            return true;
        }
    },
    eventClicked: function (inSender, inEvent) {
        var e = this.artistEvents.events[inEvent.rowIndex];

        if (e) {
            this.$.artistEvent.setEventItem(e);
            this.$.pane.selectViewByName("artistEvent");
        } else {
            this.$.getArtistEvents.search(this.artistName, this.page);
        }
    },
    linkClicked: function (inSender, inUrl) {
        this.$.detail.setUrl(inUrl);
        this.$.pane.selectViewByName("detail");
    }
});