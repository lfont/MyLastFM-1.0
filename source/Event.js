enyo.kind({
    name: "MyLastFM.Event",
    kind: "enyo.VFlexBox",
    events: {
        onLinkClick: "",
        onBack: ""
    },
    published: {
        eventItem: ""
    },
    components: [
        { name: "pane", kind: "enyo.Pane", flex: 1,
            components: [
                { name: "event", className: "enyo-bg", layoutKind: "VFlexLayout",
                    components: [
                        { kind: "enyo.PageHeader",
                            components: [
                                { name: "backButton", kind: "enyo.Button", content: "Back",
                                    onclick: "backClicked" },
                                { name: "headerText", layoutKind: "HFlexLayout", pack: "center",
                                    content: "Event", flex: 1 }
                            ]
                        },
                        { kind: "enyo.Scroller", flex: 1, autoHorizontal: false, horizontal: false,
                            components: [
                                { kind: "enyo.HFlexBox", onclick: "venueClicked",
                                    components: [
                                        { name: "venueImage", kind: "enyo.Image", className: "image" },
                                        { name: "venueName", kind: "enyo.CustomButton", className: "label", flex: 1 }
                                    ]
                                },
                                { kind: "enyo.Group", caption: "Artist",
                                  components: [
                                    { name: "artists", kind: "enyo.VirtualRepeater", onSetupRow: "setupArtistRow",
                                      components: [
                                        { name: "artist", kind: "enyo.Item" }
                                      ]
                                    }
                                  ]
                                },
                                { kind: "enyo.RowGroup", caption: "Start Date",
                                    components: [
                                        { name: "startDate" }
                                    ]
                                },
                                { kind: "enyo.RowGroup", caption: "Description",
                                    components: [
                                        { name: "description", kind: "enyo.HtmlContent",
                                            onLinkClick: "doLinkClick" }
                                    ]
                                },
                                { kind: "enyo.RowGroup", caption: "Website",
                                    components: [
                                        { name: "venueWebsite", kind: "enyo.CustomButton",
                                            onclick: "venueWebsiteClicked" }
                                    ]
                                },
                                { kind: "enyo.RowGroup", caption: "Address",
                                    components: [
                                        { components: [
                                                { name: "venueStreet" },
                                                { kind: "enyo.HFlexBox",
                                                    components: [
                                                        { name: "venuePostalCode" },
                                                        { width: "10px" },
                                                        { name: "venueCity" }
                                                    ]
                                                },
                                                { name: "venueCountry" }
                                            ]
                                        }
                                    ]
                                },
                                { caption: "View on Map", kind: "enyo.Button",
                                    onclick: "viewOnMapClicked" }
                            ]
                        }
                    ]
                },
                { name: "map", kind: "MyLastFM.Map", onBack: "goBack", lazy: true }
            ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.$.pane.selectViewByName("event");
    },
    goBack: function (inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    },
    setupArtistRow: function (inSender, inIndex) {
      var artists,
          artist;

      if (!this.eventItem) return;

      artists = this.eventItem.artists.artist;
      artist = artists[inIndex];
      if (artist) {
        if (inIndex === 0) {
          this.$.artist.addClass("enyo-first");
        } else if (inIndex === artists.length - 1) {
          this.$.artist.addClass("enyo-last");
        }

        this.$.artist.setContent(artist);
        return true;
      }
    },
    eventItemChanged: function () {
        var imageURI = MyLastFM.LastFM.JSONService.getImageURI(this.eventItem.venue.image, "medium") ||
            MyLastFM.LastFM.JSONService.getImageURI(this.eventItem.image, "medium");

        this.$.venueImage.setSrc(imageURI);
        this.$.venueName.setCaption(this.eventItem.venue.name);

        // normalize artist property
        if (!enyo.isArray(this.eventItem.artists.artist)) {
            this.eventItem.artists.artist = [ this.eventItem.artists.artist ];
        }
        this.$.artists.render();

        this.$.startDate.setContent(this.eventItem.startDate);
        this.$.description.setContent(this.eventItem.description);
        this.$.venueWebsite.setCaption(this.eventItem.venue.website);
        this.$.venueStreet.setContent(this.eventItem.venue.location.street);
        this.$.venuePostalCode.setContent(this.eventItem.venue.location.postalcode);
        this.$.venueCity.setContent(this.eventItem.venue.location.city);
        this.$.venueCountry.setContent(this.eventItem.venue.location.country);

        this.$.pane.selectViewByName("event");
    },
    venueClicked: function (inSender, inEvent) {
        this.doLinkClick(this.eventItem.venue.url);
    },
    venueWebsiteClicked: function (inSender, inEvent) {
        this.doLinkClick(this.eventItem.venue.website);
    },
    viewOnMapClicked: function (inSender, inEvent) {
        var location = this.eventItem.venue.location["geo:point"];
        this.$.pane.selectViewByName("map");
        this.$.map.setCenter(location["geo:lat"], location["geo:long"]);
    }
});