enyo.kind({
    name: "App.ArtistSearch",
    kind: "enyo.VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        { name: "pane", kind: "enyo.Pane", flex: 1,
            components: [
                { name: "search", className: "enyo-bg", layoutKind: "VFlexLayout",
                    components: [
                        { name: "scrim", kind: "App.Scrim" },
                        { name: "getArtist", kind: "App.LastFM.ArtistInfo",
                            onData: "gotArtist", onNoData: "noArtist" },
                        { kind: "enyo.PageHeader",
                            components: [
                                { name: "backButton", kind: "enyo.Button", content: "Back",
                                    onclick: "backClicked" },
                                { name: "headerText", layoutKind: "HFlexLayout", pack: "center",
                                    content: "MyLastFM - Artist Search", flex: 1 }
                            ]
                        },
                        { kind: "enyo.RowGroup", caption: "Artist Name",
                            components: [
                                { kind: "enyo.InputBox",
                                    components: [
                                        { name: "artist", kind: "enyo.Input", flex: 1 },
                                        { kind: "enyo.Button", caption: "Get Artist", onclick: "getArtistClicked" }
                                    ]
                                }
                            ]
                        },
                        { kind: "enyo.Scroller", flex: 1, autoHorizontal: false, horizontal: false,
                            components: [
                                { name: "message" },
                                { name: "artistInfo",
                                    components: [
                                        { kind: "enyo.HFlexBox", onclick: "artistClicked",
                                            components: [
                                                { name: "artistImage", kind: "enyo.Image", className: "image" },
                                                { name: "artistName", kind: "enyo.CustomButton", className: "label", flex: 1 }
                                            ]
                                        },
                                        { kind: "enyo.RowGroup", caption: "Bio",
                                            components: [
                                                { name: "artistBio", kind: "enyo.HtmlContent",
                                                    onLinkClick: "artistBioLinkClicked" }
                                            ]
                                        },
                                        { kind: "enyo.Group", caption: "Similar",
                                            components: [
                                                { name: "similars", kind: "enyo.VirtualRepeater", onSetupRow: "setupSimilarRow",
                                                    components: [
                                                        { name: "similar", kind: "enyo.Item", onclick: "similarClicked",
                                                            layoutKind: "HFlexLayout",
                                                            components: [
                                                                { name: "similarImage", kind: "enyo.Image", className: "image" },
                                                                { name: "similarName", className: "label" }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        { kind: "enyo.Group", caption: "Tags",
                                            components: [
                                                { name: "tags", kind: "enyo.VirtualRepeater", onSetupRow: "setupTagRow",
                                                    components: [
                                                        { name: "tag", kind: "enyo.Item", onclick: "tagClicked" }
                                                    ]
                                                }
                                            ]
                                        },
                                        { name: "getArtistEvents", kind: "enyo.Button", caption: "Events",
                                            onclick: "getArtistEventsClicked" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { name: "detail", kind: "App.Detail", className: "enyo-bg", lazy: true,
                    onBack: "goBack" },
                { name: "events", kind: "App.ArtistEvents", className: "enyo-bg", lazy: true,
                    onBack: "goBack" }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.message.hide();
        this.$.artistInfo.hide();
        this.$.getArtist.setScrim(this.$.scrim);
        this.$.pane.selectViewByName("search");
    },
    getArtistClicked: function () {
        var artistName = this.$.artist.getValue();
        this.$.getArtist.search(artistName);
    },
    setupSimilarRow: function (inSender, inIndex) {
        var similars,
                similar;

        if (!this.artist) return;

        similars = this.artist.similar.artist;
        similar = similars[inIndex];
        if (similar) {
            if (inIndex === 0) {
                this.$.similar.addClass("enyo-first");
            } else if (inIndex === similars.length - 1) {
                this.$.similar.addClass("enyo-last");
            }

            this.$.similarImage.setSrc(App.LastFM.GetDataService.getImageURI(
                                                                similar.image, "small"));
            this.$.similarName.setContent(similar.name);
            return true;
        }
    },
    similarClicked: function (inSender, inEvent) {
        this.$.detail.setUrl(this.artist.similar.artist[inEvent.rowIndex].url);
        this.$.pane.selectViewByName("detail");
    },
    setupTagRow: function (inSender, inIndex) {
        var tags,
                tag;

        if (!this.artist) return;

        tags = this.artist.tags.tag;
        tag = tags[inIndex];
        if (tag) {
            if (inIndex === 0) {
                this.$.tag.addClass("enyo-first");
            } else if (inIndex === tags.length - 1) {
                this.$.tag.addClass("enyo-last");
            }

            this.$.tag.setContent(tag.name);
            return true;
        }
    },
    tagClicked: function (inSender, inEvent) {
        this.$.detail.setUrl(this.artist.tags.tag[inEvent.rowIndex].url);
        this.$.pane.selectViewByName("detail");
    },
    gotArtist: function (inSender, inArtist) {
        this.artist = inArtist;
        this.$.artistImage.setSrc(inArtist.getImageURI("medium"));
        this.$.artistName.setCaption(inArtist.name);
        this.$.artistBio.setContent(inArtist.bio.summary);
        this.$.similars.render();
        this.$.tags.render();
        this.$.message.hide();
        this.$.artistInfo.show();
    },
    noArtist: function (inSender, inMessage) {
        this.$.artistInfo.hide();
        this.$.message.setContent(inMessage);
        this.$.message.show();
    },
    goBack: function (inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    artistClicked: function (inSender, inEvent) {
        this.$.detail.setUrl(this.artist.url);
        this.$.pane.selectViewByName("detail");
    },
    getArtistEventsClicked: function (inSender, inEvent) {
        this.$.events.setArtistName(this.artist.name);
        this.$.pane.selectViewByName("events");
    },
    artistBioLinkClicked: function (inSender, inURL) {
        this.$.detail.setUrl(inURL);
        this.$.pane.selectViewByName("detail");
    }
});