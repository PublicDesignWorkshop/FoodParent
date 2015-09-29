var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FoodParent;
(function (FoodParent) {
    var SideInfoView = (function (_super) {
        __extends(SideInfoView, _super);
        function SideInfoView(options) {
            _super.call(this, options);
            this.bActive = true;
            var that = this;
            that.events = {
                "click .nav-home": "_navHome",
            };
            that.delegateEvents();
            that.views = new Array();
        }
        SideInfoView.prototype.render = function () {
            var that = this;
            // add a new view
            var template = _.template(FoodParent.Template.getInstance().getMainHeaderTemplate());
            var data = {
                site: FoodParent.Localization.getInstance().getSiteText(),
                trees: FoodParent.Localization.getInstance().getTreesText(),
                note: FoodParent.Localization.getInstance().getNoteText(),
                about: FoodParent.Localization.getInstance().getAboutText(),
            };
            that.$el.html(template(data));
            return that;
        };
        return SideInfoView;
    })(Backbone.View);
    FoodParent.SideInfoView = SideInfoView;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=sideinfoview.js.map