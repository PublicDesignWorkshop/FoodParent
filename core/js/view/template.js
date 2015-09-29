var FoodParent;
(function (FoodParent) {
    var Template = (function () {
        function Template(args) {
            if (Template._instance) {
                throw new Error("Error: Instantiation failed: Use Template.getInstance() instead of new.");
            }
            Template._instance = this;
        }
        Template.getInstance = function () {
            return Template._instance;
        };
        Template.prototype.getBaseTemplate = function () {
            var template = "";
            template += '<div id="wrapper-main-body"></div>';
            template += '<div id="wrapper-main-header"></div>';
            return template;
        };
        Template.prototype.getMainHeaderTemplate = function () {
            var template = "";
            template += '<div class="row">';
            template += '<div class="col-xs-3 btn-nav nav-home"><%= site %></div>';
            template += '<div class="col-xs-3 btn-nav nav-trees"><%= trees %></div>';
            template += '<div class="col-xs-3 btn-nav nav-note"><%= note %></div>';
            template += '<div class="col-xs-3 btn-nav nav-about"><%= about %></div>';
            template += '</div>';
            return template;
        };
        Template.prototype.getMainTreesViewTemplate = function () {
            var template = "";
            //template += '<div class="row panel-body">';
            template += '<div id="map-trees" class="col-xs-8 panel-body panel-map"></div>';
            template += '<div class="col-xs-4 panel-body panel-sideinfo"></div>';
            //template += '</div>';
            return template;
        };
        Template._instance = new Template();
        return Template;
    })();
    FoodParent.Template = Template;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=template.js.map