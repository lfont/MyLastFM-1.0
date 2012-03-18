enyoGoogle.Map.credentials = "AIzaSyAtDkAgyml1VHrvhvbFNtCqJo7MyH3c-Xk";
enyoGoogle.Map.forceDegradedMode = false;
enyoGoogle.Map.sensor = true;

enyo.kind({
    name: "MyLastFM.Map",
    kind: "enyo.VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        { kind: "enyo.PageHeader",
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
                    content: "Map",
                    flex: 1
                }
            ]
        },
        {
            name: "map",
            kind: "enyoGoogle.Map",
            flex: 1,
            zoom: 16,
            onLoaded: "mapLoaded",
            onLoadFailure: "mapLoadFailure",
            onMarkerClick: "mapMarkerClicked"
        }
    ],
    setCenter: function (inLatitude, inLongitude, inInfo) {
        this.latitude = inLatitude;
        this.longitude = inLongitude;
        this.info = inInfo || "No information.";
        if (this.alreadyLoaded) {
            this.$.map.setCenter(this.latitude, this.longitude);
            this.$.map.setShowMarker(true);
            this.showInformation();
        }
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    mapLoaded: function (inSender, inEvent) {
        enyo.log("Map loaded successfully.");
        this.alreadyLoaded = true;
        this.infoWindow = new google.maps.InfoWindow();
        this.setCenter(this.latitude, this.longitude, this.info);
    },
    mapLoadFailure: function (inSender, inEvent) {
        enyo.error("Load failure from map.");
    },
    showInformation: function () {
        this.infoWindow.setContent(this.info);
        this.infoWindow.open(this.$.map.hasMap(), this.$.map.getMarker().hasMarker());
    },
    mapMarkerClicked: function (inSender, inEvent) {
        enyo.log("Map marker clicked");
        this.showInformation();
    }
});