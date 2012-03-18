enyo.kind({
    name: "MyLastFM.Album",
    kind: "enyo.VFlexBox",
    events: {
        onLinkClick: "",
        onBack: ""
    },
    published: {
        albumInfo: {
            name: "",
            artistName: ""
        }
    },
    components: [
        {
            name: "scrim",
            kind: "MyLastFM.Scrim"
        },
        {
            name: "getAlbum",
            kind: "lastFm.AlbumInfo",
            onData: "gotAlbum",
            onNoData: "noAlbum"
        },
        {
            layoutKind: "VFlexLayout",
            flex: 1,
            components: [
                {
                    kind: "enyo.PageHeader",
                    components: [
                        {
                            name: "backButton",
                            kind: "enyo.Button",
                            content: "Back",
                            onclick: "backClicked"
                        },
                        {
                            name: "headerText",
                            layoutKind: "HFlexLayout",
                            pack: "center",
                            content: "Album",
                            flex: 1
                        }
                    ]
                },
                {
                    kind: "enyo.Scroller",
                    flex: 1,
                    autoHorizontal: false,
                    horizontal: false,
                    components: [
                        {
                            name: "message"
                        },
                        {
                            name: "albumInfo",
                            components: [
                                {
                                    kind: "enyo.HFlexBox",
                                    onclick: "albumClicked",
                                    components: [
                                        {
                                            name: "albumImage",
                                            kind: "enyo.Image",
                                            className: "image"
                                        },
                                        {
                                            name: "albumNameButton",
                                            kind: "enyo.CustomButton",
                                            className: "label",
                                            flex: 1
                                        }
                                    ]
                                },
                                {
                                    kind: "enyo.Group",
                                    caption: "Artist",
                                    components: [
                                        {
                                            name: "artist",
                                            kind: "enyo.Item"
                                        }
                                    ]
                                },
                                {
                                    kind: "enyo.RowGroup",
                                    caption: "Release Date",
                                    components: [
                                        {
                                            name: "releaseDate"
                                        }
                                    ]
                                },
                                {
                                    kind: "enyo.RowGroup",
                                    caption: "Wiki",
                                    components: [
                                        {
                                            name: "wiki",
                                            kind: "enyo.HtmlContent",
                                            onLinkClick: "doLinkClick"
                                        }
                                    ]
                                },
                                {
                                    kind: "enyo.RowGroup",
                                    caption: "Tracks",
                                    components: [
                                        {
                                            name: "tracks",
                                            kind: "enyo.VirtualRepeater",
                                            onSetupRow: "setupTrackRow",
                                            components: [
                                                {
                                                    name: "track",
                                                    kind: "enyo.Item",
                                                    onclick: "trackClicked",
                                                    layoutKind: "VFlexLayout",
                                                    components: [
                                                        {
                                                            name: "trackName"
                                                        },
                                                        {
                                                            name: "trackDuration"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.message.hide();
        this.$.albumInfo.hide();
        this.$.getAlbum.setScrim(this.$.scrim);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    albumInfoChanged: function (inPreviousAlbumInfo) {
        if (this.albumInfo &&
            (!inPreviousAlbumInfo ||
             inPreviousAlbumInfo.name !== this.albumInfo.name ||
             inPreviousAlbumInfo.artistName !== this.albumInfo.artistName)) {
            this.$.getAlbum.search(this.albumInfo.artistName, this.albumInfo.name);
        }
    },
    setupTrackRow: function (inSender, inIndex) {
        var tracks,
            track;

        if (!this.album) return;

        tracks = this.album.tracks.track;
        track = tracks[inIndex];
        if (track) {
            if (inIndex === 0) {
                this.$.track.addClass("enyo-first");
            } else if (inIndex === tracks.length - 1) {
                this.$.track.addClass("enyo-last");
            }

            this.$.trackName.setContent(track.name);
            this.$.trackDuration.setContent((track.duration / 60).toFixed(2) +
                                            " min");
            return true;
        }
    },
    gotAlbum: function (inSender, inAlbum) {
        this.album = inAlbum;
        this.$.albumImage.setSrc(inAlbum.getImageURI("medium"));
        this.$.albumNameButton.setCaption(inAlbum.name);
        this.$.artist.setContent(inAlbum.artist);
        this.$.releaseDate.setContent(inAlbum.releasedate);

        if (inAlbum.wiki) {
            this.$.wiki.setContent(inAlbum.wiki.content);
        } else {
            this.$.wiki.setContent("");
        }

        this.$.tracks.render();
        this.$.message.hide();
        this.$.albumInfo.show();
    },
    noAlbum: function (inSender, inMessage) {
        this.$.albumInfo.hide();
        this.$.message.setContent(inMessage);
        this.$.message.show();
    },
    albumClicked: function (inSender, inEvent) {
        this.doLinkClick(this.album.url);
    },
    trackClicked: function (inSender, inEvent) {
        var track = this.album.tracks.track[inEvent.rowIndex];
        this.doLinkClick(track.url);
    }
});