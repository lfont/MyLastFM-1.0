enyo.kind({
    name: "MyLastFM.LastFM.ArtistEvents",
    kind: "enyo.Component",
    events: {
        onData: "",
        onNoData: ""
    },
    published: {
        scrim: ""
    },
    components: [
        { name: "getArtistEvents", kind: "MyLastFM.LastFM.JSONService", methodName: "artist.getevents",
            onSuccess: "gotArtistEvents", onFailure: "gotArtistEventsFailure" }
    ],
    search: function (artistName, page) {
        this.$.getArtistEvents.call({
            artist: artistName,
            autocorrect: 1,
            limit: 20,
            page: page || 1
        });
        if (this.scrim) this.scrim.showScrim(true);
    },
    gotArtistEvents: function (inSender, inResponse) {
        var result,
            attributes;
            
        if (this.scrim) this.scrim.showScrim(false);
        if (!inResponse) return;

        if (inResponse.events.event) {
            attributes = inResponse.events["@attr"];
            result = {
                totalPages: parseInt(attributes.totalPages, 10),
                page: parseInt(attributes.page, 10),
                artist: attributes.artist,
                events: inResponse.events.event
            };

            this.doData(result);
        } else {
            this.doNoData("The artist has not events at this time.");
        }
    },
    gotArtistEventsFailure: function (inSender, inResponse) {
        if (this.scrim) this.scrim.showScrim(false);
        if (inResponse.error) {
            this.doNoData(inResponse.message);
        } else {
            this.doNoData("Cannot retrieve artist's events at this time.");
        }
    }
});