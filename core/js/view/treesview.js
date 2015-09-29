var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
            // add a new view
            var template = _.template(FoodParent.Template.getInstance().getMainTreesViewTemplate());
            var data = {};
            that.$el.html(template(data));
            that.views.push(FoodParent.MapViewFactory.getInstance().create(that.$('.panel-map')).render());
            return that;
        };
        return TreesView;
    })(Backbone.View);
    FoodParent.TreesView = TreesView;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=treesview.js.map