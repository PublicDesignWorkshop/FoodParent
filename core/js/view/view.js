var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FoodParent;
(function (FoodParent) {
    (function (MainViewType) {
        MainViewType[MainViewType["NONE"] = 0] = "NONE";
        MainViewType[MainViewType["TREES"] = 1] = "TREES";
        MainViewType[MainViewType["TREE"] = 2] = "TREE";
        MainViewType[MainViewType["NOTE"] = 3] = "NOTE";
        MainViewType[MainViewType["ABOUT"] = 4] = "ABOUT";
    })(FoodParent.MainViewType || (FoodParent.MainViewType = {}));
    var MainViewType = FoodParent.MainViewType;
    var View = (function (_super) {
        __extends(View, _super);
        function View(options) {
            _super.call(this, options);
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var that = this;
        }
        View.setElement = function (options) {
            View._instance.setElement(options.el);
        };
        View.getInstance = function () {
            return View._instance;
        };
        View.prototype.SetViewType = function (viewType) {
            this.viewType = viewType;
        };
        View.prototype.getViewType = function () {
            return this.viewType;
        };
        View.prototype.render = function () {
            var that = this;
            // add a new view
            var template = _.template(FoodParent.Template.getInstance().getBaseTemplate());
            var data = {};
            that.$el.html(template(data));
            // render a new header view
            if (that.currentHeaderView != undefined) {
                that.currentHeaderView.destroy();
            }
            that.currentHeaderView = FoodParent.HeaderFactory.getInstance().create(that.$('#wrapper-main-header'));
            that.currentHeaderView.render();
            // render a new body view
            if (that.currentBodyView != undefined) {
                that.currentBodyView.destroy();
            }
            switch (that.viewType) {
                case 1 /* TREES */:
                    that.currentBodyView = FoodParent.TreesViewFactory.getInstance().create(that.$('#wrapper-main-body'));
                    that.currentBodyView.render();
                    break;
                case 2 /* TREE */:
                    break;
                case 3 /* NOTE */:
                    break;
                case 4 /* ABOUT */:
                    break;
            }
            return that;
        };
        View._instance = new View();
        return View;
    })(Backbone.View);
    FoodParent.View = View;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=view.js.map