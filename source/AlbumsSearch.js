enyo.kind({
    name: "MyLastFM.AlbumsSearch",
    kind: "enyo.VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        {
            name: "pane",
            kind: "enyo.Pane",
            flex: 1,
            components: [
                {
                    name: "search",
                    layoutKind: "VFlexLayout",
                    components: [
                        {
                            name: "scrim",
                            kind: "MyLastFM.Scrim"
                        },
                        {
                            name: "getAlbums",
                            kind: "MyLastFM.LastFM.AlbumSearch",
                            onData: "gotAlbums",
                            onNoData: "noAlbums"
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
                                    content: "Albums",
                                    flex: 1
                                }
                            ]
                        },
                        {
                            kind: "enyo.RowGroup",
                            caption: "Album Name",
                            components: [
                                {
                                    kind: "enyo.InputBox",
                                    components: [
                                        {
                                            name: "albumInput",
                                            kind: "enyo.Input",
                                            flex: 1
                                        },
                                        {
                                            kind: "enyo.Button",
                                            caption: "Get Albums",
                                            onclick: "getAlbumsClicked"
                                        }
                                    ]
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
                                    onSetupRow: "setupAlbumRow",
                                    components: [
                                        {
                                            kind: "enyo.Item",
                                            layoutKind: "HFlexLayout",
                                            components: [
                                                {
                                                    name: "albumImage",
                                                    kind: "enyo.Image",
                                                    className: "image"
                                                },
                                                {
                                                    kind: "enyo.VFlexBox",
                                                    className: "label",
                                                    flex: 1,
                                                    components: [
                                                        {
                                                            name: "albumName"
                                                        },
                                                        {
                                                            name: "artistName"
                                                        }
                                                    ]
                                                }
                                            ],
                                            onclick: "albumClicked"
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
                    name: "album",
                    kind: "MyLastFM.Album",
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
        this.$.getAlbums.setScrim(this.$.scrim);
        this.$.pane.selectViewByName("search");
    },
    goBack: function (inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    getAlbumsClicked: function () {
        var album = this.$.albumInput.getValue();
        this.$.getAlbums.search(album);
        this.albums = {};
        this.page = 1;
    },
    gotAlbums: function (inSender, inAlbums) {
        var previousAlbums = this.albums.albums || [];
        this.albums = inAlbums;
        this.albums.albums = previousAlbums.concat(inAlbums.albums);
        this.$.message.hide();
        this.$.list.show();
        this.$.list.render();
    },
    noAlbums: function (inSender, inMessage) {
        this.$.list.hide();
        this.$.message.setContent(inMessage);
        this.$.message.show();
    },
    setupAlbumRow: function (inSender, inIndex) {
        var a,
            imageURI;

        if (!this.albums) return;

        a = this.albums.albums[inIndex];

        if (a) {
            imageURI = MyLastFM.LastFM.JSONService.getImageURI(a.image, "medium");
            this.$.albumImage.setSrc(imageURI);
            this.$.albumName.setContent(a.name);
            this.$.artistName.setContent(a.artist);
            return true;
        } else if (this.page === this.albums.page &&
                   this.page < this.albums.totalPages) {
            this.$.albumName.setContent("Load more...");
            this.page += 1;
            return true;
        }
    },
    albumClicked: function (inSender, inEvent) {
        var a = this.albums.albums[inEvent.rowIndex];

        if (a) {
            this.$.pane.selectViewByName("album");
            this.$.album.setAlbumInfo({
                name: a.name,
                artistName: a.artist
            });
        } else {
            this.$.getAlbums.search(this.albums.forName, this.page);
        }
    },
    linkClicked: function (inSender, inUrl) {
        this.$.pane.selectViewByName("detail");
        this.$.detail.setUrl(inUrl);
    }
});