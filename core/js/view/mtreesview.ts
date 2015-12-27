module FoodParent {
    export class ManageTreesViewFractory {
        private static _instance: ManageTreesViewFractory = new ManageTreesViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ManageTreesViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageTreesViewFractory.getInstance() instead of new.");
            }
            ManageTreesViewFractory._instance = this;
        }
        public static getInstance(): ManageTreesViewFractory {
            return ManageTreesViewFractory._instance;
        }
        public static create(el: JQuery, viewMode: VIEW_MODE): ManageTreesView {
            var view: ManageTreesView;
            if (viewMode == VIEW_MODE.MAP) {
                view = new ManageTreesMapView({ el: el });
            }
            
            return view;
        }
    }

    export class ManageTreesView extends BaseView {

    }

    export class ManageTreesMapView extends ManageTreesView {
        private map: L.Map;
        private location: L.LatLng;
        private zoom: number;
        private bClosePopupOnClick: boolean = true;
        private static TAG: string = "ManageTreesMapView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ManageTreesMapView = this;
            self.bDebug = true;
            self.zoom = Setting.getDefaultMapZoomLevel();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                //"mouseover .home-menu-left": "_mouseOver",
                //"mouseover .home-menu-right": "_mouseOver",
                //"click .home-menu-left": "_mouseClick",
                //"click .home-menu-right": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render();
            var self: ManageTreesMapView = this;
            if (self.bDebug) console.log(ManageTreesMapView.TAG + "render()");

            var template = _.template(Template.getManageTreesMapViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtrees'));


            Controller.updateGeoLocation(self.renderMap, self.renderError);

            return self;
        }

        public update(args?: any): any {
            super.update();
            var self: ManageTreesMapView = this;
            if (self.bDebug) console.log(ManageTreesMapView.TAG + "update()");
            return self;
        }

        public renderError = (error: PositionError) => {
            var self: ManageTreesMapView = this;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    EventHandler.handleError(ERROR_MODE.GEO_PERMISSION_ERROR);
                    break;
                case error.POSITION_UNAVAILABLE:
                    EventHandler.handleError(ERROR_MODE.GEO_PERMISSION_ERROR);
                    break;
                case error.TIMEOUT:
                    break;
            }
            self.renderMap({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
        }

        public renderMap = (position: Position) => {
            var self: ManageTreesMapView = this;
            var accuracy = position.coords.accuracy;
            self.location = new L.LatLng(position.coords.latitude, position.coords.longitude);

            if (self.map == undefined) {
                self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                self.map = L.map(self.$el[0].id, {
                    zoomControl: false,
                    closePopupOnClick: self.bClosePopupOnClick,
                    doubleClickZoom: true,
                    touchZoom: true,
                    zoomAnimation: true,
                    markerZoomAnimation: true,
                }).setView(self.location, self.zoom);
                L.tileLayer(Setting.getTileMapAddress(), {
                    minZoom: Setting.getMapMinZoomLevel(),
                    maxZoom: Setting.getMapMaxZoomLevel(),
                }).addTo(self.map);
                self.map.invalidateSize(false);

                // add event listener for finishing map creation.
                //self.map.whenReady(null);
                // add event listener for dragging map
                //self.map.on("moveend", null);

                // remove leaflet thumbnail
                //that.$('.leaflet-control-attribution.leaflet-control').html('');

                //Controller.fetchAllTrees();
                for (var i = 0; i < 1000; i++) {
                    setTimeout(function () {
                        Controller.fetchAllTrees();
                    }, i * 10);
                }
                
            }
        }

        public setLocation(location: L.LatLng): void {
            var self: ManageTreesMapView = this;
            self.location = location;
        }

        private _mouseOver(event: Event): void {
            var self: ManageTreesMapView = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ManageTreesMapView = this;
            //EventHandler.handleMouseClick($(event.currentTarget), self);
        }
    }
}