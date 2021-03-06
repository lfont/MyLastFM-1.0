enyo.kind({
	name: "lastFm.ArtistInfo",
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
            name: "getArtistInfo",
            kind: "lastFm.JSONService",
            methodName: "artist.getInfo",
            onSuccess: "gotArtistInfo",
            onFailure: "gotArtistInfoFailure"
        }
	],
	search: function (artistName) {
		this.$.getArtistInfo.call({
            artist: artistName,
            autocorrect: 1
        });
        if (this.scrim) this.scrim.showScrim(true);
	},
	gotArtistInfo: function (inSender, inResponse) {
		var result;
      
        if (this.scrim) this.scrim.showScrim(false);
        if (!inResponse) return;
    
        if (inResponse.artist) {
            result = inResponse.artist;
            result.getImageURI = enyo.bind(this,
                lastFm.JSONService.getImageURI,
                result.image);
        }
          
        this.doData(result);
	},
	gotArtistInfoFailure: function (inSender, inResponse) {
        if (this.scrim) this.scrim.showScrim(false);
        if (inResponse.error) {
            this.doNoData(inResponse.message);
        } else {
			this.doNoData("Cannot retrieve artist's info at this time.");
		}
	}
});