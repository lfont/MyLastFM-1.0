enyo.kind({
    name: "MyLastFM.LastFM.AlbumSearch",
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
            name: "getAlbums",
            kind: "MyLastFM.LastFM.JSONService",
            methodName: "album.search",
            onSuccess: "gotAlbums",
            onFailure: "gotAlbumsFailure"
        }
    ],
    search: function (albumName, page) {
        this.$.getAlbums.call({
            album: albumName,
            limit: 20,
            page: page || 1
        });
        if (this.scrim) this.scrim.showScrim(true);
    },
    gotAlbums: function (inSender, inResponse) {
        var result,
            attributes,
            query;
            
        if (this.scrim) this.scrim.showScrim(false);
        if (!inResponse) return;
        
        if (enyo.isArray(inResponse.results.albummatches.album)) {
            attributes = inResponse.results["@attr"];
            query = inResponse.results["opensearch:Query"];
            query.totalResults = inResponse.results["opensearch:totalResults"];
            query.itemsPerPage = inResponse.results["opensearch:itemsPerPage"];

            result = {
                totalPages: parseInt(
                    query.totalResults / query.itemsPerPage, 10) + 1,
                page: parseInt(query.startPage, 10),
                forName: attributes["for"],
                albums: inResponse.results.albummatches.album
            };

            this.doData(result);
        } else {
            this.doNoData("There is no album at this time.");
        }
    },
    gotAlbumsFailure: function (inSender, inResponse) {
        if (this.scrim) this.scrim.showScrim(false);
        if (inResponse.error) {
            this.doNoData(inResponse.message);
        } else {
            this.doNoData("Cannot retrieve albums at this time.");
        }
    }
});