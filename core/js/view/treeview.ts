module FoodParent {
    export class TreeView extends Backbone.View<Backbone.Model> {
        private bActive: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        private current: number;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: TreeView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",

            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
        }
        render(): any {
            var that: TreeView = this;
            // add a new view
            var template = _.template(Template.getInstance().getMainTreeViewTemplate());
            var data = {}
            that.$el.html(template(data));

            

            that.views.push(MapViewFactory.getInstance().create2(that.$('.panel-tree-map'), false).render());
            that.views.push(TreeInfoViewFactory.getInstance().create(that.$('.panel-tree-info')).render());
            that.views.push(CoverflowViewFactory.getInstance().create(that.$('.panel-tree-coverflow')).render());
            
            Controller.getInstance().fetchTree(that.current, that.renderTree);

            return that;
        }

        getViews(): Array<Backbone.View<Backbone.Model>> {
            var that: TreeView = this;
            return that.views;
        }

        setCurrent(id: number): void {
            var that: TreeView = this;
            that.current = Math.floor(id);
        }

        renderTree = () => {
            console.log("renderTree");
            var that: TreeView = this;
            var tree: Tree = Model.getInstance().getTrees().findWhere({ id: that.current });
            
            var validView: MapView;
            var validView2: TreeInfoView;
            var validView3: CoverflowView;
            
            $.each(that.views, function (index: number, view: Backbone.View<Backbone.Model>) {
                if (view instanceof MapView) {
                    validView = <MapView> view;
                }
                if (view instanceof TreeInfoView) {
                    validView2 = <TreeInfoView> view;
                }
                if (view instanceof CoverflowView) {
                    validView3 = <CoverflowView> view;
                }
            });
            validView.setZoom(Setting.getInstance().getDefaultSmallMapZoomLevel());
            validView.setIsClosePopupOnClick(false);
            validView.createMap({ timestamp: new Date(), coords: { altitudeAccuracy: 0, latitude: tree.getLat(), longitude: tree.getLng(), speed: 0, heading: 0, altitude: 0, accuracy: 0}});

            validView2.customRender(tree);
            validView3.customRender(tree);

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