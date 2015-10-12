module FoodParent {
    export enum MainViewType {
        NONE, TREES, TREE, NOTE, ABOUT
    }
    export class View extends Backbone.View<Backbone.Model> {
        private static _instance: View = new View();
        private viewType: MainViewType;
        private headerView: Backbone.View<Backbone.Model>;
        private bodyView: Backbone.View<Backbone.Model>;
        private mapView: MapView;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            if (View._instance) {
                throw new Error("Error: Instantiation failed: Use View.getInstance() instead of new.");
            }
            View._instance = this;
            var that: View = this;
        }
        public static setElement(options?: Backbone.ViewOptions<Backbone.Model>): void {
            View._instance.setElement(options.el);
        }
        public static getInstance(): View {
            return View._instance;
        }
        public SetViewType(viewType: MainViewType): void {
            this.viewType = viewType;
        }
        public getViewType(): MainViewType {
            return this.viewType;
        }
        public setMapView(mapView: MapView): void {
            this.mapView = mapView;
        }
        public getMapView(): MapView {
            return this.mapView;
        }

        render(): any {
            var that: View = this;
            // add a new view
            var template = _.template(Template.getInstance().getBaseTemplate());
            var data = {}
            that.$el.html(template(data));
            // render a new header view
            if (that.headerView != undefined) {
                that.headerView.destroy();
            }
            that.headerView = HeaderFactory.getInstance().create(that.$('#wrapper-main-header'));
            that.headerView.render();

            // render a new body view
            if (that.bodyView != undefined) {
                that.bodyView.destroy();
            }

            that.mapView = undefined;

            switch (that.viewType) {
                case MainViewType.TREES:
                    that.bodyView = TreesViewFactory.getInstance().create(that.$('#wrapper-main-body'));
                    that.bodyView.render();
                    break;
                case MainViewType.TREE:
                    that.bodyView = TreeViewFactory.getInstance().create(that.$('#wrapper-main-body'), Controller.getInstance().getCurrent());
                    that.bodyView.render();
                    break;
                case MainViewType.NOTE:
                    break;
                case MainViewType.ABOUT:
                    break;
            }


            return that;
        }

        public renderTreesOnMap(trees: Trees): void {
            var that: View = this;
            if (that.mapView != undefined) {
                switch (that.viewType) {
                    case MainViewType.TREES:
                        var exist: Trees = new Trees();
                        var markers: Array<L.Marker> = that.mapView.getAllMarkers();
                        // find unnecessary markers
                        $.each(trees.models, function (i: number, model: Tree) {
                            $.each(markers, function (j: number, marker: L.Marker) {
                                var food: Food = Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name == (food.getName() + model.getName())) {
                                    exist.add(model);
                                }
                            });
                        });
                        // remove unnecessary markers
                        $.each(markers, function (j: number, marker: L.Marker) {
                            var bDeleted: boolean = true;
                            $.each(exist.models, function (i: number, model: Tree) {
                                var food: Food = Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name != (food.getName() + model.getName())) {
                                    bDeleted = false;
                                }
                            });
                            if (bDeleted) {
                                that.mapView.removeMarker(marker);
                            }
                        });
                        
                        // add new markers
                        $.each(trees.models, function (index: number, model: Tree) {
                            if (exist.findWhere({ id: model.getId() }) == undefined) {
                                that.createMarker(model);
                            }
                        });
                        break;
                    case MainViewType.TREE:
                        var exist: Trees = new Trees();
                        var markers: Array<L.Marker> = that.mapView.getAllMarkers();
                        // find unnecessary markers
                        $.each(trees.models, function (i: number, model: Tree) {
                            $.each(markers, function (j: number, marker: L.Marker) {
                                var food: Food = Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name == (food.getName() + model.getName())) {
                                    exist.add(model);
                                }
                            });
                        });
                        // remove unnecessary markers
                        $.each(markers, function (j: number, marker: L.Marker) {
                            var bDeleted: boolean = true;
                            $.each(exist.models, function (i: number, model: Tree) {
                                var food: Food = Model.getInstance().getFoods().findWhere({
                                    id: model.getFoodId()
                                });
                                if (marker.options.name != (food.getName() + model.getName())) {
                                    bDeleted = false;
                                }
                            });
                            if (bDeleted) {
                                that.mapView.removeMarker(marker);
                            }
                        });
                        
                        // add new markers
                        var tree: Tree = Model.getInstance().getTrees().findWhere({ id: Controller.getInstance().getCurrent() });
                        $.each(trees.models, function (index: number, model: Tree) {
                            if (exist.findWhere({ id: model.getId() }) == undefined) {
                                that.createMarker2(model,(tree == model));
                            }
                        });

                        break;
                    case MainViewType.NOTE:
                        break;
                    case MainViewType.ABOUT:
                        break;
                }
            }
        }

        public createMarker(model: Tree) {
            var that: View = this;
            var view: MarkerView = <MarkerView>MarkerViewFactory.getInstance().create(model);
            view.getMarker().on('popupopen', function (event) {
                that.renderTreeInfo(model);
                
                $('.leaflet-popup-content .glyphicon').off('click');
                $('.leaflet-popup-content .glyphicon').on('click', function (event) {
                    //console.log($('.leaflet-popup-content .glyphicon').attr('data-id'));
                    Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                });
            });
            view.getMarker().on('popupclose', function () {
                that.renderTreeInfo(null);
            });
            that.mapView.addMarker(view.getMarker());
        }

        public createMarker2(model: Tree, bPopupOpen: boolean) {
            var that: View = this;
            var view: MarkerView = <MarkerView>MarkerViewFactory.getInstance().create2(model);
            view.getMarker().on('click', function (event) {
                if (event.target._popup == undefined) { // same as e.target.getPopup()
                } else {
                    this.openPopup();
                }
            });
            view.getMarker().on('popupopen', function (event) {
                that.renderTreeInfo(model);
                Router.getInstance().navigate("tree/" + $('.leaflet-popup-content span').attr('data-id'), { trigger: false });
            });
            view.getMarker().on('popupclose', function () {
                that.renderTreeInfo(null);
            });
            that.mapView.addMarker(view.getMarker());
            if (bPopupOpen) {
                view.getMarker().openPopup();
            }
        }

        public renderTreeInfo = (tree: Tree) => {
            var that: View = this;
            switch (that.viewType) {
                case MainViewType.TREES:
                    var views: Array<Backbone.View<Backbone.Model>> = that.bodyView.getViews();
                    var validView: SideInfoView;
                    $.each(views, function (index: number, view: Backbone.View<Backbone.Model>) {
                        if (view instanceof SideInfoView) {
                            validView = <SideInfoView> view;
                        }
                    });
                    validView.customRender(tree);
                    break;
                case MainViewType.TREE:
                    var views: Array<Backbone.View<Backbone.Model>> = that.bodyView.getViews();
                    var validView2: TreeInfoView;
                    var validView3: CoverflowView;
                    $.each(views, function (index: number, view: Backbone.View<Backbone.Model>) {
                        if (view instanceof TreeInfoView) {
                            validView2 = <TreeInfoView> view;
                        }
                        if (view instanceof CoverflowView) {
                            validView3 = <CoverflowView> view;
                        }
                    });
                    validView2.customRender(tree);
                    validView3.customRender(tree);
                    break;
                case MainViewType.NOTE:
                    break;
                case MainViewType.ABOUT:
                    break;
            }
        }
    }
}