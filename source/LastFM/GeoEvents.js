enyo.kind({
    name: "MyLastFM.LastFM.GeoEvents",
    kind: "enyo.Component",
    events: {
        onData: "",
        onNoData: ""
    },
    published: {
        scrim: ""
    },
    components: [
        { name: "getGeoEvents", kind: "MyLastFM.LastFM.JSONService", methodName: "geo.getevents",
            onSuccess: "gotGeoEvents", onFailure: "gotGeoEventsFailure" }
    ],
    search: function (latitude, longitude, page) {
        var params = {
            limit: 20
        };

        if (typeof(latitude) === "number") {
            params.latitude = latitude;
            params.longitude = longitude;
            params.page = page || 1;
        } else {
            params.location = latitude;
            params.page = longitude || 1;
        }

        this.$.getGeoEvents.call(params);
        if (this.scrim) this.scrim.showScrim(true);
    },
    gotGeoEvents: function (inSender, inResponse) {
        var result,
            attributes;
            
        if (this.scrim) this.scrim.showScrim(false);
        if (!inResponse) return;
        
        if (inResponse.events.event) {
            attributes = inResponse.events["@attr"];
            result = {
                totalPages: parseInt(attributes.totalPages, 10),
                page: parseInt(attributes.page, 10),
                location: attributes.location,
                events: inResponse.events.event
            };

            this.doData(result);
        } else {
            this.doNoData("There is no event at this time.");
        }
    },
    gotGeoEventsFailure: function (inSender, inResponse) {
        if (this.scrim) this.scrim.showScrim(false);
        if (inResponse.error) {
            this.doNoData(inResponse.message);
        } else {
            this.doNoData("Cannot retrieve events at this time.");
        }
    }
});