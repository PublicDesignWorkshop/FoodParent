var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreeInfoView = (function (_super) {
        __extends(TreeInfoView, _super);
        function TreeInfoView(options) {
            var _this = this;
            _super.call(this, options);
            this.bActive = true;
            this.renderTreeInfo = function () {
                var that = _this;
                if (that.tree) {
                    var food = FoodParent.Model.getInstance().getFoods().findWhere({ id: that.tree.getFoodId() });
                    var flag = FoodParent.Model.getInstance().getFlags().findWhere({ id: that.tree.getFlagId() });
                    var ownership = FoodParent.Model.getInstance().getOwnerships().findWhere({ id: that.tree.getOwnershipId() });
                    var ratio = 0.75;
                    var approximate = 15;
                    var template = _.template(FoodParent.Template.getInstance().getTreeInfoViewTemplate());
                    var data = {
                        name: food.getName() + that.tree.getName(),
                        location: '@ ' + that.tree.getLat().toFixed(4) + ", " + that.tree.getLng().toFixed(4),
                        ripening: FoodParent.Localization.getInstance().getRipeningText(),
                        ratio: Math.floor(ratio * 100) + "%",
                        approximate: approximate,
                        food: food.getName(),
                        flag: FoodParent.Localization.getInstance().getFlagText(),
                        flags: FoodParent.Model.getInstance().getFlags(),
                        ownership: FoodParent.Localization.getInstance().getOwnershipText(),
                        ownerships: FoodParent.Model.getInstance().getOwnerships(),
                        recent: FoodParent.Localization.getInstance().getRecentText(),
                    };
                    that.$el.html(template(data));
                    that.renderFlagInfo(flag);
                    that.renderOwnershipInfo(ownership);
                    var radius = that.$('.circle-progress').innerWidth();
                    that.$('#ripen-progress').circleProgress({
                        startAngle: -Math.PI / 2,
                        value: ratio,
                        size: radius,
                        thickness: radius / 8,
                        fill: {
                            gradient: ["red", "orange"],
                            gradientAngle: Math.PI / 4,
                        }
                    });
                    that.$('.circle-progress-left').css({ height: radius });
                    that.$('.circle-progress-right').css({ height: radius });
                }
                else {
                    that.$el.html("");
                }
                return that;
            };
            this.renderFlagInfo = function (flag) {
                var that = _this;
                $.each(that.$('.flag-radio'), function (index, item) {
                    if (parseInt($(item).attr('data-flag')) == flag.getId()) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                        that.currentFlag = parseInt($(item).attr('data-flag'));
                    }
                    else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                    }
                });
            };
            this.renderOwnershipInfo = function (ownership) {
                var that = _this;
                $.each(that.$('.ownership-radio'), function (index, item) {
                    if (parseInt($(item).attr('data-ownership')) == ownership.getId()) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                        that.currentOwnership = parseInt($(item).attr('data-ownership'));
                    }
                    else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                    }
                });
            };
            var that = this;
            that.events = {
                "click .flag-radio": "_clickFlagRadio",
                "click .ownership-radio": "_clickOwnershipRadio",
            };
            that.delegateEvents();
            that.views = new Array();
        }
        TreeInfoView.prototype.render = function () {
            var that = this;
            return that;
        };
        TreeInfoView.prototype.customRender = function (tree) {
            var that = this;
            that.tree = tree;
            FoodParent.Controller.getInstance().fetchFlags(FoodParent.Controller.getInstance().fetchTypes, that.renderTreeInfo);
        };
        TreeInfoView.prototype._clickFlagRadio = function (event) {
            var that = this;
            $.each(that.$('.flag-radio'), function (index, item) {
                if (item == event.target) {
                    $(item).prop({ 'checked': 'checked' });
                }
                else {
                    $(item).prop({ 'checked': '' });
                }
            });
        };
        TreeInfoView.prototype._clickOwnershipRadio = function (event) {
            var that = this;
            $.each(that.$('.type-radio'), function (index, item) {
                if (item == event.target) {
                    $(item).prop({ 'checked': 'checked' });
                }
                else {
                    $(item).prop({ 'checked': '' });
                }
            });
        };
        TreeInfoView.prototype.getViews = function () {
            var that = this;
            return that.views;
        };
        return TreeInfoView;
    })(Backbone.View);
    FoodParent.TreeInfoView = TreeInfoView;
})(FoodParent || (FoodParent = {}));
