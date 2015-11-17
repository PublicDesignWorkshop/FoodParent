module FoodParent {
    export class TreeInfoView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        private tree: Tree;
        private currentFlag: number;
        private currentOwnership: number;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: TreeInfoView = this;
            that.events = <any>{
                "click .flag-radio": "_clickFlagRadio",
                "click .ownership-radio": "_clickOwnershipRadio",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: TreeInfoView = this;
            return that;
        }

        customRender(tree: Tree): void {
            var that: TreeInfoView = this;
            that.tree = tree;
            Controller.getInstance().fetchFlags(Controller.getInstance().fetchTypes, that.renderTreeInfo);
        }

        renderTreeInfo = () => {
            var that: TreeInfoView = this;
            if (that.tree) {
                var food: Food = Model.getInstance().getFoods().findWhere({ id: that.tree.getFoodId() });
                var flag: Flag = Model.getInstance().getFlags().findWhere({ id: that.tree.getFlagId() });
                var ownership: Ownership = Model.getInstance().getOwnerships().findWhere({ id: that.tree.getOwnershipId() });
                var ratio = 0.75;
                var approximate = 15;
                var template = _.template(Template.getInstance().getTreeInfoViewTemplate());
                var data = {
                    name: food.getName() + that.tree.getName(),
                    location: '@ ' + that.tree.getLat().toFixed(4) + ", " + that.tree.getLng().toFixed(4),
                    ripening: Localization.getInstance().getRipeningText(),
                    ratio: Math.floor(ratio * 100) + "%",
                    approximate: approximate,
                    food: food.getName(),
                    flag: Localization.getInstance().getFlagText(),
                    flags: Model.getInstance().getFlags(),
                    ownership: Localization.getInstance().getOwnershipText(),
                    ownerships: Model.getInstance().getOwnerships(),
                    recent: Localization.getInstance().getRecentText(),
                }
                that.$el.html(template(data));
                that.renderFlagInfo(flag);
                that.renderOwnershipInfo(ownership);

                
                // render circle-progess
                var radius: number = that.$('.circle-progress').innerWidth();
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
            } else {
                that.$el.html("");
            }
            return that;
        }

        renderFlagInfo = (flag: Flag) => {
            var that: TreeInfoView = this;
            $.each(that.$('.flag-radio'), function (index: number, item: any) {
                if (parseInt($(item).attr('data-flag')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                    that.currentFlag = parseInt($(item).attr('data-flag'));
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
        }

        _clickFlagRadio(event: Event): void {
            var that: TreeInfoView = this;
            $.each(that.$('.flag-radio'), function (index: number, item: any) {
                if (item == event.target) {
                    $(item).prop({ 'checked': 'checked' });
                } else {
                    $(item).prop({ 'checked': '' });
                }
            });
        }

        renderOwnershipInfo = (ownership: Ownership) => {
            var that: TreeInfoView = this;
            $.each(that.$('.ownership-radio'), function (index: number, item: any) {
                if (parseInt($(item).attr('data-ownership')) == ownership.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                    that.currentOwnership = parseInt($(item).attr('data-ownership'));
                } else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
        }

        _clickOwnershipRadio(event: Event): void {
            var that: TreeInfoView = this;
            $.each(that.$('.type-radio'), function (index: number, item: any) {
                if (item == event.target) {
                    $(item).prop({ 'checked': 'checked' });
                } else {
                    $(item).prop({ 'checked': '' });
                }
            });
        }

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: TreeInfoView = this;
            return that.views;
        }

        /*
        _clickName(event: Event): void {
            var that: TreesView = this;
            that.bExpanded = !that.bExpanded;

            if (that.bExpanded) {
                //new DetailView({ model: this.model, el: this.$('.detail') }).render();
            } else {
                //this.$('.detail').empty();
            }
            event.preventDefault();
        }
        */


    }
} 