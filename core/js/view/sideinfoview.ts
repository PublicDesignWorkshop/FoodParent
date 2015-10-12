module FoodParent {
    export class SideInfoView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        private tree: Tree;
        private mapView: MapView;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: SideInfoView = this;
            that.events = <any>{
                "click .flag-radio": "_clickFlagRadio",
                "click .type-radio": "_clickTypeRadio",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: SideInfoView = this;
            var template = _.template(Template.getInstance().getEmptySideInfoViewTemplate());
            var data = {}
            that.$el.html(template(data));
            that.renderTableToggle();

            return that;
        }

        render2(bChecked: boolean): any {
            var that: SideInfoView = this;
            var template = _.template(Template.getInstance().getEmptySideInfoViewTemplate());
            var data = {}
            that.$el.html(template(data));
            that.renderTableToggle(bChecked);

            return that;
        }

        customRender(tree: Tree): void {
            var that: SideInfoView = this;
            that.tree = tree;
            Controller.getInstance().fetchFlags(Controller.getInstance().fetchTypes, that.renderTreeInfo);
        }
        
        renderTreeInfo = () => {
            var that: SideInfoView = this;
            
            if (that.tree) {
                var food: Food = Model.getInstance().getFoods().findWhere({ id: that.tree.getFoodId() });
                var flag: Flag = Model.getInstance().getFlags().findWhere({ id: that.tree.getFlagId() });
                var ownership: Ownership = Model.getInstance().getOwnerships().findWhere({ id: that.tree.getOwnershipId() });
                var template = _.template(Template.getInstance().getSideInfoViewTemplate());
                var data = {
                    name: food.getName() + that.tree.getName(),
                    location: '@ ' + that.tree.getLat().toFixed(4) + ", " + that.tree.getLng().toFixed(4),
                    flag: Localization.getInstance().getFlagText(),
                    flags: Model.getInstance().getFlags(),
                    type: Localization.getInstance().getTypeText(),
                    types: Model.getInstance().getOwnerships(),
                    recent: Localization.getInstance().getRecentText(),
                }
                that.$el.html(template(data));
                that.renderFlagInfo(flag);
                that.renderTypeInfo(ownership);

                that.renderTableToggle();
            } else {
                that.$el.html("");
            }
            return that;
        }

        renderTableToggle(bChecked?: boolean): void {
            var that: SideInfoView = this;
            that.$('#toggle-table').bootstrapToggle({
                on: 'Graphic',
                off: 'Table',
                size: 'small',
                onstyle: 'default',
            });
            //
            //.prop({ 'checked': 'checked' });
            //toggle-table
            if (bChecked != undefined) {
                if (bChecked) {
                    that.$('#toggle-table').bootstrapToggle('on');
                } else {
                    that.$('#toggle-table').bootstrapToggle('off');
                }
            }
            that.$('#toggle-table').change(function () {
                
                that.render2($(this).prop('checked'));
                that.mapView.SetIsGraphicView($(this).prop('checked'));
            });
        }

        renderFlagInfo = (flag: Flag) => {
            var that: SideInfoView = this;
            $.each(that.$('.flag-radio'), function (index: number, item: any) {
                if (parseInt($(item).attr('data-flag')) == flag.getId()) {
                    $(item).prop({ 'checked': 'checked' });
                } else {
                    $(item).prop({ 'checked': '' });
                }
            });
        }

        _clickFlagRadio(event: Event): void {
            var that: SideInfoView = this;
            $.each(that.$('.flag-radio'), function (index: number, item: any) {
                if (item == event.target) {
                    $(item).prop({ 'checked': 'checked' });
                } else {
                    $(item).prop({ 'checked': '' });
                }
            });
        }

        renderTypeInfo = (ownership: Ownership) => {
            var that: SideInfoView = this;
            $.each(that.$('.type-radio'), function (index: number, item: any) {
                if (parseInt($(item).attr('data-type')) == ownership.getId()) {
                    $(item).prop({ 'checked': 'checked' });
                } else {
                    $(item).prop({ 'checked': '' });
                }
            });
        }

        _clickTypeRadio(event: Event): void {
            var that: SideInfoView = this;
            $.each(that.$('.type-radio'), function (index: number, item: any) {
                if (item == event.target) {
                    $(item).prop({ 'checked': 'checked' });
                } else {
                    $(item).prop({ 'checked': '' });
                }
            });
        }

        public setMapView(view: MapView): void {
            this.mapView = view;
        }
        

        /*
        _clickName(event: Event): void {
            var that: HeaderView = this;
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