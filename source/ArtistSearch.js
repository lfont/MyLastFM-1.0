enyo.kind({
    name: "MyLastFM.ArtistSearch",
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
                        { name: "scrim", kind: "MyLastFM.Scrim" },
                        { name: "getArtist", kind: "MyLastFM.LastFM.ArtistInfo",
                            onData: "gotArtist", onNoData: "noArtist" },
                        { kind: "enyo.PageHeader",
                            components: [
                                { name: "backButton", kind: "enyo.Button", content: "Back",
                                    onclick: "backClicked" },
                                { name: "headerText", layoutKind: "HFlexLayout", pack: "center",
                                    content: "Artist Search", flex: 1 }
                            ]
                        },
                        { kind: "enyo.RowGroup", caption: "Artist Name",
                            components: [
                                { kind: "enyo.InputBox",
                                    components: [
                                        { name: "artistNameInput", kind: "enyo.Input", flex: 1 },
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
                                                { name: "artistNameButton", kind: "enyo.CustomButton", className: "label", flex: 1 }
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
                { name: "detail", kind: "MyLastFM.Detail", className: "enyo-bg", lazy: true,
                    onBack: "goBack" },
                { name: "events", kind: "MyLastFM.ArtistEvents", className: "enyo-bg", lazy: true,
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
    artistNameChanged: function () {
        var input = this.$.artistNameInput;
        if (input.getValue() === "") {
            input.setValue(this.artistName);
        }
    },
    getArtistClicked: function () {
        var artistName = this.$.artistNameInput.getValue();
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

            this.$.similarImage.setSrc(MyLastFM.LastFM.JSONService.getImageURI(
                                       similar.image, "small"));
            this.$.similarName.setContent(similar.name);
            return true;
        }
    },
    similarClicked: function (inSender, inEvent) {
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(this.artist.similar.artist[inEvent.rowIndex].url);
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
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(this.artist.tags.tag[inEvent.rowIndex].url);
    },
    gotArtist: function (inSender, inArtist) {
        this.artist = inArtist;
        this.$.artistImage.setSrc(inArtist.getImageURI("medium"));
        this.$.artistNameButton.setCaption(inArtist.name);
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
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(this.artist.url);
    },
    getArtistEventsClicked: function (inSender, inEvent) {
        this.$.pane.selectViewByName("events");
        this.$.events.setArtistName(this.artist.name);
    },
    artistBioLinkClicked: function (inSender, inURL) {
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(inURL);
    }
});