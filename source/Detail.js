enyo.kind({
    name: "App.Detail",
    kind: enyo.VFlexBox,
    events: {
        onBack: ""
    },
    published: {
        url: ""
    },
    components: [
        { kind: enyo.PageHeader,
            components: [
                { name: "backButton", kind: enyo.Button, content: "Back",
                    onclick: "backClicked" },
                { name: "headerText", layoutKind: "HFlexLayout", pack: "center",
                    content: "MyLastFM - Detail", flex: 1 }
            ]
        },
        { kind: enyo.Scroller, flex: 1,
            components: [
                // enyo.WebView does not work on webOS 2.2
                { name: "webView", kind: enyo.Iframe, layoutKind: "HFlexLayout",
                    onUrlRedirected: "redir",
                    redirects: [
            
                        // Intercept and redirect any link with 'twitter' in the url to our redir function
                        { regex: "twitter", cookie: "newBrowserCard", enable: true },
                
                        // Intercept and redirect any link with 'mailto' in the url to our redir function
                        { regex: "mailto", cookie: "newEmailCard", enable: true }
                    ]
                }
            ]
        },
        //non visual component to open the browser/email
        {
            kind: enyo.PalmService,
            name: "appManager",
            service: "palm://com.palm.applicationManager/",
            method: "open"
        }
    ],
    backClicked: function () {
        this.doBack();
    },
    urlChanged: function () {
        this.$.webView.setUrl(this.url);
    },
    redir: function (source, url, cookie) {
        switch (cookie) {
            
            // Open new browser card
            case "newBrowserCard":
                this.openBrowser(url);
                break;
                
            // Open email app
            case "newEmailCard":
                this.openEmail();
                break;
            
            // Proceed normally through the WebView
            default:
                this.$.webView.setUrl(url);
                break;
        }
    },
    openBrowser: function (url) {
        this.$.appManager.call({
            "id": "com.palm.app.browser",
            params: {
                url: url
            }
        });
    },
    openEmail: function () {
        this.$.appManager.call({
            "id": "com.palm.app.email",
            "params": {
                "summary": "test subject",
                "text": "test email text",
                recipients: [{
                    "type": "email",
                    "role": "1",
                    "value": "address@email.com",
                    "contactDisplay": "Your Name"
                }]
            }
        });
    }
});