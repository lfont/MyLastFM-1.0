enyo.kind({
    name: "MyLastFM.LastFM.AlbumInfo",
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
            name: "getAlbumInfo",
            kind: "MyLastFM.LastFM.JSONService",
            methodName: "album.getInfo",
            onSuccess: "gotAlbumInfo",
            onFailure: "gotAlbumInfoFailure"
        }
    ],
    search: function (artistName, albumName) {
        this.$.getAlbumInfo.call({
            album: albumName,
            artist: artistName,
            autocorrect: 1
        });
        if (this.scrim) this.scrim.showScrim(true);
    },
    gotAlbumInfo: function (inSender, inResponse) {
        var result;
      
        if (this.scrim) this.scrim.showScrim(false);
        if (!inResponse) return;
    
        if (inResponse.album) {
            result = inResponse.album;
            result.getImageURI = enyo.bind(this,
                MyLastFM.LastFM.JSONService.getImageURI,
                result.image);
        }
          
        this.doData(result);
    },
    gotAlbumInfoFailure: function (inSender, inResponse) {
        if (this.scrim) this.scrim.showScrim(false);
        if (inResponse.error) {
            this.doNoData(inResponse.message);
        } else {
            this.doNoData("Cannot retrieve album's info at this time.");
        }
    }
});