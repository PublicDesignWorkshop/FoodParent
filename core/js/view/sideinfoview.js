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
            var _this = this;
            _super.call(this, options);
            this.bActive = true;
            this.renderTreeInfo = function () {
                var that = _this;
                if (that.tree) {
                    var food = FoodParent.Model.getInstance().getFoods().findWhere({ id: that.tree.getFoodId() });
                    var flag = FoodParent.Model.getInstance().getFlags().findWhere({ id: that.tree.getFlagId() });
                    var ownership = FoodParent.Model.getInstance().getOwnerships().findWhere({ id: that.tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getInstance().getSideInfoViewTemplate());
                    var data = {
                        name: food.getName() + that.tree.getName(),
                        location: '@ ' + that.tree.getLat().toFixed(4) + ", " + that.tree.getLng().toFixed(4),
                        flag: FoodParent.Localization.getInstance().getFlagText(),
                        flags: FoodParent.Model.getInstance().getFlags(),
                        type: FoodParent.Localization.getInstance().getTypeText(),
                        types: FoodParent.Model.getInstance().getOwnerships(),
                        recent: FoodParent.Localization.getInstance().getRecentText(),
                    };
                    that.$el.html(template(data));
                    that.renderFlagInfo(flag);
                    that.renderTypeInfo(ownership);
                    that.renderTableToggle();
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
                        $(item).prop({ 'checked': 'checked' });
                    }
                    else {
                        $(item).prop({ 'checked': '' });
                    }
                });
            };
            this.renderTypeInfo = function (ownership) {
                var that = _this;
                $.each(that.$('.type-radio'), function (index, item) {
                    if (parseInt($(item).attr('data-type')) == ownership.getId()) {
                        $(item).prop({ 'checked': 'checked' });
                    }
                    else {
                        $(item).prop({ 'checked': '' });
                    }
                });
            };
            var that = this;
            that.events = {
                "click .flag-radio": "_clickFlagRadio",
                "click .type-radio": "_clickTypeRadio",
            };
            that.delegateEvents();
            that.views = new Array();
        }
        SideInfoView.prototype.render = function () {
            var that = this;
            var template = _.template(FoodParent.Template.getInstance().getEmptySideInfoViewTemplate());
            var data = {};
            that.$el.html(template(data));
            that.renderTableToggle();
            return that;
        };
        SideInfoView.prototype.render2 = function (bChecked) {
            var that = this;
            var template = _.template(FoodParent.Template.getInstance().getEmptySideInfoViewTemplate());
            var data = {};
            that.$el.html(template(data));
            that.renderTableToggle(bChecked);
            return that;
        };
        SideInfoView.prototype.customRender = function (tree) {
            var that = this;
            that.tree = tree;
            FoodParent.Controller.getInstance().fetchFlags(FoodParent.Controller.getInstance().fetchTypes, that.renderTreeInfo);
        };
        SideInfoView.prototype.renderTableToggle = function (bChecked) {
            var that = this;
            that.$('#toggle-table').bootstrapToggle({
                on: 'Graphic',
                off: 'Table',
                size: 'small',
                onstyle: 'default',
            });
            if (bChecked != undefined) {
                if (bChecked) {
                    that.$('#toggle-table').bootstrapToggle('on');
                }
                else {
                    that.$('#toggle-table').bootstrapToggle('off');
                }
            }
            that.$('#toggle-table').change(function () {
                that.render2($(this).prop('checked'));
                that.mapView.SetIsGraphicView($(this).prop('checked'));
            });
        };
        SideInfoView.prototype._clickFlagRadio = function (event) {
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
        SideInfoView.prototype._clickTypeRadio = function (event) {
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
        SideInfoView.prototype.setMapView = function (view) {
            this.mapView = view;
        };
        return SideInfoView;
    })(Backbone.View);
    FoodParent.SideInfoView = SideInfoView;
})(FoodParent || (FoodParent = {}));
