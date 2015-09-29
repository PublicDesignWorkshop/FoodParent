module FoodParent {
    export class MapView extends Backbone.View<Backbone.Model> {
        private bDebug: boolean = true;
        private bActive: boolean = true;
        private map: L.Map;
        private location: L.LatLng;
        private zoom: number;
        private views: Array<Backbone.View<Backbone.Model>>;
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
            Controller.getInstance().updateGeoLocation(that.createMap);

            return that;
        }

        public createMap = (position: Position) => {
            var that: MapView = this;
            var accuracy = position.coords.accuracy;
            that.location = new L.LatLng(position.coords.latitude, position.coords.longitude);


            if (that.map == undefined) {
                that.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                that.map = L.map(that.$el[0].id, {
                    closePopupOnClick: true,
                    zoomControl: false,
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

                that.map.whenReady(that.createLayers);

                // remove leaflet thumbnail
                that.$('.leaflet-control-attribution.leaflet-control').html('');
            }
        }

        public createLayers = () => {
            var that: MapView = this;
            if (that.bDebug) console.log("createLayers()");
        }

        setLocation(location: L.LatLng) {
            var that: MapView = this;
            that.location = location;
        }
        getLocation(): L.LatLng {
            return this.location;
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