var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function destroyView(obj) {
    obj.destroy();
}
Backbone.View.prototype.destroy = function () {
    // chain call for removing all children views under curent view.
    if (this.children != undefined) {
        _.invoke(this.children, 'destroy');
        this.children.length = 0;
        delete this.children;
    }
    // remove binded event of current view (comment out since it will be handled by remove() call.
    //this.undelegateEvents();
    // remove jquery data
    this.$el.removeData().unbind();
    // remove view from dom (most browswer's remove() also handle unbind().
    this.remove();
    //this.unbind();
    // remove child doms (I am not exactly sure to call this.. This iterates all children dom elements, so it can make program slower).
    this.$el.find("*").remove();
    // I believe most of remove related function will be handled by this remove() call.
    Backbone.View.prototype.remove.call(this);
    // remove any model bind events if it's defined. (onDestroy() function should be defined manually in each view).
    if (this.onDestroy) {
        this.onDestroy();
    }
};
var FoodParent;
(function (FoodParent) {
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView(options) {
            _super.call(this, options);
            this.bDebug = false;
            this.bRendered = false; // Check whether this view is rendered or not. This status will be used for indicator either to create dom elements or just update contents.
            var self = this;
        }
        BaseView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update();
                return;
            }
            this.bRendered = true;
        };
        BaseView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render();
                return;
            }
        };
        BaseView.prototype.getIsRendered = function () {
            return this.bRendered;
        };
        BaseView.prototype.getWidth = function () {
            return this.$el.innerWidth();
        };
        BaseView.prototype.getHeight = function () {
            return this.$el.innerHeight();
        };
        // traverse the graph, executing the provided callback on this node and it's children
        // execute the callback before traversing the children
        BaseView.prototype.traverse = function (callback) {
            callback(this);
            if (this.children) {
                this.children.forEach(function (view) {
                    view.traverse(callback);
                });
            }
        };
        BaseView.prototype.addChild = function (view) {
            var self = this;
            if (self.children == undefined) {
                self.children = new Array();
            }
            self.children.push(view);
        };
        BaseView.prototype.getChildren = function () {
            var self = this;
            return self.children;
        };
        BaseView.prototype.removeAllChildren = function () {
            var self = this;
            if (self.children) {
                self.children.forEach(function (view) {
                    view.traverse(destroyView);
                });
            }
        };
        BaseView.prototype.animActive = function () {
        };
        BaseView.prototype.animInactive = function () {
        };
        BaseView.prototype.setVisible = function () {
            // invisible class is defined in app.css
            this.$el.removeClass('invisible');
            //this.$el.css({ opacity: 1 });
        };
        BaseView.prototype.setInvisible = function () {
            // invisible class is defined in app.css
            this.$el.addClass('invisible');
            //this.$el.css({ opacity: 0 });
        };
        return BaseView;
    })(Backbone.View);
    FoodParent.BaseView = BaseView;
})(FoodParent || (FoodParent = {}));
