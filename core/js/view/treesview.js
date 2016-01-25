var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesView = (function (_super) {
        __extends(TreesView, _super);
        function TreesView(options) {
            _super.call(this, options);
            this.bActive = true;
            var that = this;
            that.events = {
                "click .nav-home": "_navHome",
            };
            that.delegateEvents();
            that.views = new Array();
        }
        TreesView.prototype.render = function () {
            var that = this;
            var template = _.template(FoodParent.Template.getInstance().getMainTreesViewTemplate());
            var data = {};
            that.$el.html(template(data));
            var view1 = FoodParent.MapViewFactory.getInstance().create(that.$('.panel-map'), true).render();
            that.views.push(view1);
            var view2 = FoodParent.SideViewFactory.getInstance().create(that.$('.panel-sideinfo')).render();
            view2.setMapView(view1);
            that.views.push(view2);
            return that;
        };
        TreesView.prototype.getViews = function () {
            var that = this;
            return that.views;
        };
        return TreesView;
    })(Backbone.View);
    FoodParent.TreesView = TreesView;
})(FoodParent || (FoodParent = {}));
