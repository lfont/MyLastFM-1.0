enyo.kind({
    name: "MyLastFM.Scrim",
    kind: enyo.Control,
    components: [
        { kind: enyo.Scrim, layoutKind: "VFlexLayout", align: "center", pack: "center",
          components: [
            { kind: enyo.SpinnerLarge }
          ]
        }
    ],
    create: function () {
        this.inherited(arguments);
        this.showScrim(false);
    },
    showScrim: function (inShowing) {
        this.$.scrim.setShowing(inShowing);
        this.$.spinnerLarge.setShowing(inShowing);
    }
});