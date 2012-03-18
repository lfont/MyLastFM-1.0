enyo.kind({
    name: "MyLastFM.ArtistTopAlbums",
    kind: "enyo.VFlexBox",
    events: {
        onBack: ""
    },
    published: {
        artistName: ""
    },
    components: [
        {
            name: "pane",
            kind: "enyo.Pane",
            flex: 1,
            components: [
                {
                    name: "search",
                    className: "enyo-bg",
                    layoutKind: "VFlexLayout",
                    components: [
                        {
                            name: "scrim",
                            kind: "MyLastFM.Scrim"
                        },
                        {
                            name: "getArtistTopAlbums",
                            kind: "lastFm.ArtistTopAlbums",
                            onData: "gotArtistTopAlbums",
                            onNoData: "noArtistTopAlbums"
                        },
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
                                    name: "list",
                                    kind: "enyo.VirtualRepeater",
                                    onSetupRow: "setupTopAlbumRow",
                                    components: [
                                        {
                                            kind: "enyo.Item",
                                            layoutKind: "HFlexLayout",
                                            components: [
                                                {
                                                    name: "topAlbumImage",
                                                    kind: "enyo.Image",
                                                    className: "image"
                                                },
                                                {
                                                    name: "topAlbumName",
                                                    flex: 1,
                                                    className: "label"
                                                }
                                            ],
                                            onclick: "topAlbumClicked"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "detail",
                    kind: "MyLastFM.Detail",
                    className: "enyo-bg",
                    lazy: true,
                    onBack: "goBack"
                },
                {
                    name: "artistTopAlbum",
                    kind: "MyLastFM.Album",
                    className: "enyo-bg",
                    lazy: true,
                    onBack: "goBack",
                    onLinkClick: "linkClicked"
                }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.message.hide();
        this.$.getArtistTopAlbums.setScrim(this.$.scrim);
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
            this.$.headerText.setContent(this.artistName + "'s Top Albums");
            this.$.getArtistTopAlbums.search(this.artistName);
            this.artistTopAlbums = {};
            this.page = 1;
        }
    },
    gotArtistTopAlbums: function (inSender, inArtistTopAlbums) {
        var previousTopAlbums = this.artistTopAlbums.topAlbums || [];
        this.artistTopAlbums = inArtistTopAlbums;
        this.artistTopAlbums.topAlbums = previousTopAlbums.concat(inArtistTopAlbums.topAlbums);
        this.$.message.hide();
        this.$.list.show();
        this.$.list.render();
    },
    noArtistTopAlbums: function (inSender, inMessage) {
        this.$.list.hide();
        this.$.message.setContent(inMessage);
        this.$.message.show();
    },
    setupTopAlbumRow: function (inSender, inIndex) {
        var a,
            imageURI;

        if (!this.artistTopAlbums) return;

        a = this.artistTopAlbums.topAlbums[inIndex];

        if (a) {
            imageURI = lastFm.JSONService.getImageURI(a.image, "medium");
            this.$.topAlbumImage.setSrc(imageURI);
            this.$.topAlbumName.setContent(a.name);
            return true;
        } else if (this.page === this.artistTopAlbums.page &&
                   this.page < this.artistTopAlbums.totalPages) {
            this.$.topAlbumName.setContent("Load more...");
            this.page += 1;
            return true;
        }
    },
    topAlbumClicked: function (inSender, inEvent) {
        var a = this.artistTopAlbums.topAlbums[inEvent.rowIndex];

        if (a) {
            this.$.pane.selectViewByName("artistTopAlbum");
            this.$.artistTopAlbum.setAlbumInfo({
                name: a.name,
                artistName: a.artist.name
            });
        } else {
            this.$.getArtistTopAlbums.search(this.artistName, this.page);
        }
    },
    linkClicked: function (inSender, inUrl) {
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(inUrl);
    }
});