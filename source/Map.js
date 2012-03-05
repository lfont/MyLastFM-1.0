enyo.kind({
    name: "App.Map",
    kind: enyo.VFlexBox,
    events: {
        onBack: ""
    },
    components: [
        { kind: enyo.PageHeader,
            components: [
                { name: "backButton", kind: enyo.Button, content: "Back",
                    onclick: "backClicked" },
                { name: "headerText", layoutKind: "HFlexLayout", pack: "center",
                    content: "MyLastFM - Map", flex: 1 }
            ]
        },
        { name: "map",
            kind: enyo.Map,
            credentials: "AppvG7ObmagcJ4xWVjVP1o17pTx68TFAFaAT0uftKwCTyD_VYB6-X40a5Ah_fOqR",
            flex: 1
        }
    ],
    setCenter: function (latitude, longitude) {
        var bingMap = this.$.map.hasMap(),
            position = new Microsoft.Maps.Location(latitude, longitude),
            pin;
            
        bingMap.setView({
            center: position,
            zoom: 15
        });
            
        pin = new Microsoft.Maps.Pushpin(position);
        this.$.map.map.entities.push(pin);
    },
    backClicked: function (inSender, inEvent) {
        this.doBack();
    }
});