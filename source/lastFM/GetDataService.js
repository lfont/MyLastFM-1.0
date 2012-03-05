enyo.kind({
    name: "App.LastFM.GetDataService",
    kind: enyo.WebService,
    published: {
        apiKey: "b25b959554ed76058ac220b7b2e0a026",
        methodName: ""
    },
    statics: {
        url: "http://ws.audioscrobbler.com/2.0/?" +
            "format=json&" +
            "api_key={$apiKey}&" +
            "method={$method}",
        getImageURI: function (images, size) {
            var imageURI,
                i;
            
            for (i = 0; i < images.length; i += 1) {
               if (images[i].size === size) {
                   imageURI = images[i]["#text"];
                   break;
               }
            }
            
            return imageURI;
        }
    },
    create: function (inParams) {
        enyo.mixin(this, inParams);
        this.inherited(arguments);
        this.updateUrl();
    },
    apiKeyChanged: function () {
        this.updateUrl();
    },
    methodNameChanged: function () {
        this.updateUrl();
    },
    updateUrl: function () {
        this.setUrl(enyo.macroize(App.LastFM.GetDataService.url, {
            apiKey: this.apiKey,
            method: this.methodName
        }));
    },
    call: function () {
        this.inherited(arguments);
    },
    response: function () {
        this.inherited(arguments);
    },
    responseSuccess: function (inRequest) {
        if (inRequest.response.error) {
            this.responseFailure(inRequest);
            return;
        }
        this.inherited(arguments);
    },
    responseFailure: function (inRequest) {
        enyo.warn(inRequest.response);
        this.inherited(arguments);
    }
});