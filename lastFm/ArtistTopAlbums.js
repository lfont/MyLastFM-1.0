enyo.kind({
    name: "lastFm.ArtistTopAlbums",
    kind: "enyo.Component",
    events: {
        onData: "",
        onNoData: ""
    },
    published: {
        scrim: ""
    },
    components: [
        {
            name: "getArtistTopAlbums",
            kind: "lastFm.JSONService",
            methodName: "artist.getTopAlbums",
            onSuccess: "gotArtistTopAlbums",
            onFailure: "gotArtistTopAlbumsFailure"
        }
    ],
    search: function (artistName, page) {
        this.$.getArtistTopAlbums.call({
            artist: artistName,
            autocorrect: 1,
            limit: 20,
            page: page || 1
        });
        if (this.scrim) this.scrim.showScrim(true);
    },
    gotArtistTopAlbums: function (inSender, inResponse) {
        var result,
            attributes;
            
        if (this.scrim) this.scrim.showScrim(false);
        if (!inResponse) return;

        if (enyo.isArray(inResponse.topalbums.album)) {
            attributes = inResponse.topalbums["@attr"];
            result = {
                totalPages: parseInt(attributes.totalPages, 10),
                page: parseInt(attributes.page, 10),
                artist: attributes.artist,
                topAlbums: inResponse.topalbums.album
            };

            this.doData(result);
        } else {
            this.doNoData("The artist has no top albums at this time.");
        }
    },
    gotArtistTopAlbumsFailure: function (inSender, inResponse) {
        if (this.scrim) this.scrim.showScrim(false);
        if (inResponse.error) {
            this.doNoData(inResponse.message);
        } else {
            this.doNoData("Cannot retrieve artist's top albums at this time.");
        }
    }
});