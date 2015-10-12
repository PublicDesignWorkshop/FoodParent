module FoodParent {
    export class MapView extends Backbone.View<Backbone.Model> {
        private bDebug: boolean = true;
        private bActive: boolean = true;
        private bCentered: boolean = true;
        private map: L.Map;
        private location: L.LatLng;
        private zoom: number;
        private bClosePopupOnClick: boolean = true;
        private views: Array<Backbone.View<Backbone.Model>>;
        private bGraphicView: boolean = true;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: MapView = this;
            that.events = <any>{
                "click .nav-home": "_navHome",
            };
            that.delegateEvents();
            that.views = new Array<Backbone.View<Backbone.Model>>();
            that.zoom = Setting.getInstance().getDefaultMapZoomLevel();
        }
        render(): any {
            var that: MapView = this;
            that.$el.html("");
            if (that.bCentered) {
                console.log("render()");
                Controller.getInstance().updateGeoLocation(that.createMap);
            }

            return that;
        }

        public setIsCentered(bCentered: boolean): void {
            this.bCentered = bCentered;
        }

        public setIsClosePopupOnClick(bClosePopupOnClick: boolean): void {
            this.bClosePopupOnClick = bClosePopupOnClick;
        }

        public createMap = (position: Position) => {
            var that: MapView = this;
            var accuracy = position.coords.accuracy;
            that.location = new L.LatLng(position.coords.latitude, position.coords.longitude);

            if (that.map == undefined) {
                that.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                that.map = L.map(that.$el[0].id, {
                    zoomControl: false,
                    closePopupOnClick: that.bClosePopupOnClick,
                    doubleClickZoom: true,
                    touchZoom: true,
                    zoomAnimation: true,
                    markerZoomAnimation: true,
                }).setView(that.location, that.zoom);
                L.tileLayer(Setting.getInstance().getTileMapAddress(), {
                    minZoom: Setting.getInstance().getMapMinZoomLevel(),
                    maxZoom: Setting.getInstance().getMapMaxZoomLevel(),
                }).addTo(that.map);
                that.map.invalidateSize(false);

                // add event listener for finishing map creation.
                that.map.whenReady(that.afterCreateMap);
                // add event listener for dragging map
                that.map.on("moveend", that.afterMoveMap);

                // remove leaflet thumbnail
                //that.$('.leaflet-control-attribution.leaflet-control').html('');
            }
        }

        public afterCreateMap = () => {
            var that: MapView = this;
            if (that.bDebug) console.log("afterCreateMap()");
            Controller.getInstance().fetchTrees(that.map.getBounds());
            Controller.getInstance().setMapView(that);
        }

        public afterMoveMap = () => {
            var that: MapView = this;
            if (that.bDebug) console.log("afterMoveMap()");
            Controller.getInstance().fetchTrees(that.map.getBounds());
        }

        public setZoom(zoom: number) {
            this.zoom = zoom;
        }

        public setLocation(location: L.LatLng): void {
            var that: MapView = this;
            that.location = location;
        }

        public updateLocation(): void {
            var that: MapView = this;
            that.map.setView(that.location, that.zoom);
        }

        public getLocation(): L.LatLng {
            return this.location;
        }

        public addMarker(marker: L.Marker): void {
            var that: MapView = this;
            marker.addTo(that.map);
        }

        public getAllMarkers(): Array<L.Marker> {
            var that: MapView = this;
            var result: Array<L.Marker> = new Array<L.Marker>();
            $.each(that.map._layers, function (index: number, model: L.ILayer) {
                if (model instanceof L.Marker) {
                    result.push(model);
                }
            });
            return result;
        }

        public removeMarker(marker: L.Marker): L.Marker {
            var that: MapView = this;
            marker.off('click');
            that.map.removeLayer(marker);
            return marker;
        }

        public SetIsGraphicView(bGraphicView: boolean): void {
            var that: MapView = this;
            that.bGraphicView = bGraphicView;
            if (that.bGraphicView) {
                that.render();
            } else {
                that.render2();
            }

        }
        public getIsGraphicView(): boolean {
            return this.bGraphicView;
        }

        public render2(): any {
            console.log("render2()");
            var that: MapView = this;
            that.map.remove();
            that.map = undefined;
            that.$el.removeClass('leaflet-container');
            that.$el.removeClass('leaflet-touch');
            that.$el.removeClass('leaflet-fade-anim');
            that.$el.removeAttr('tabindex');

            var template = _.template(Template.getInstance().getLocationTableTemplate());
            var data = {
                title: Localization.getInstance().getTreeListText(),
            }
            that.$el.html(template(data));

            // add grid instance for existing data
            TreeColumn[1].cell = Backgrid.SelectCell.extend({
                optionValues: Model.getInstance().getFoods().toArray(),
            })

            var trees: Trees = new Trees(Model.getInstance().getTrees().where({type: 1}));
            //console.log(trees);
            //console.log(trees.models[0].get('id'));
            var grid = new Backgrid.Grid({
                columns: TreeColumn,
                collection: trees,
                emptyText: Localization.getInstance().getNoDataText(),
            });
            grid.render();
            //grid.sort("name", "ascending");
            that.$(".list-location").append(grid.el);

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

    declare var TreeColumn;
}