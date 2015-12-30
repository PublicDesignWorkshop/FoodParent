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
        private _map: L.Map;
        private _location: L.LatLng;
        private _zoom: number;
        private _bClosePopupOnClick: boolean = true;
        private _markers: Array<L.Marker>;
        private _selectedMarker: L.Marker;
        private static TAG: string = "ManageTreesMapView - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ManageTreesMapView = this;
            self.bDebug = true;
            self._zoom = Setting.getDefaultMapZoomLevel();
            self._markers = new Array<L.Marker>();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                //"mouseover .home-menu-left": "_mouseOver",
                //"mouseover .home-menu-right": "_mouseOver",
                "click .marker-control-item": "_mouseClick",
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


            Controller.updateGeoLocation(self.renderMap, self.renderMapError);

            return self;
        }

        public update(args?: any): any {
            super.update();
            var self: ManageTreesMapView = this;
            if (self.bDebug) console.log(ManageTreesMapView.TAG + "update()");
            return self;
        }

        private renderMapError = (error: PositionError) => {
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
            self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);

            if (self._map == undefined) {
                self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                self._map = L.map(self.$el[0].id, {
                    zoomControl: false,
                    closePopupOnClick: self._bClosePopupOnClick,
                    doubleClickZoom: true,
                    touchZoom: true,
                    zoomAnimation: true,
                    markerZoomAnimation: true,
                }).setView(self._location, self._zoom);
                L.tileLayer(Setting.getTileMapAddress(), {
                    minZoom: Setting.getMapMinZoomLevel(),
                    maxZoom: Setting.getMapMaxZoomLevel(),
                }).addTo(self._map);
                self._map.invalidateSize(false);

                // add event listener for finishing map creation.
                self._map.whenReady(self.renderTrees);
                // add event listener for dragging map
                self._map.on("moveend", self.afterMoveMap);

                //Controller.fetchAllTrees();
                self._map.on('popupopen', function (event: any) {
                    var marker: L.Marker = event.popup._source;
                    marker._bringToFront();
                    /*
                    
                    */
                    $(marker.label._container).addClass('active');

                    //$('.leaflet-popup-content .marker-control-item').off('click');
                    //$('.leaflet-popup-content .marker-control-item').on('click', function (event) {
                    //    //console.log($('.leaflet-popup-content .glyphicon').attr('data-id'));
                    //    Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                    //});

                    self._selectedMarker = marker;
                });
                self._map.on('popupclose', function (event: any) {
                    var marker: L.Marker = event.popup._source;
                    marker._resetZIndex();
                    $(marker.label._container).removeClass('active');
                    self._selectedMarker = null;
                });
            }
        }

        private afterMoveMap = () => {
            var self: ManageTreesMapView = this;
            if (self._selectedMarker) {
                self._selectedMarker._bringToFront();
            }
        }



        private renderTrees = () => {
            var self: ManageTreesMapView = this;
            Controller.fetchAllTrees(self.renderMarkers, self.renderMarkersError);
        }

        private renderMarkers = () => {
            var self: ManageTreesMapView = this;
            console.log(ManageTreesMapView.TAG + "renderMarkers()");
            console.log(Model.getTrees());
            $.each(Model.getTrees().models, function (index: number, tree: Tree) {
                var bFound: boolean = false;
                for (var j = 0; j < self._markers.length && !bFound; j++) {
                    if (tree.getId() == self._markers[j].options.id) {
                        bFound = true;
                    }
                }
                if (!bFound) {
                    self.addMarker(tree);
                }
            });
            
        }

        private addMarker(tree: Tree): void {
            var self: ManageTreesMapView = this;
            var marker: L.Marker = MarkerFractory.create(tree, true);
            self._markers.push(marker);
            marker.addTo(self._map);
            /*
            marker.on('dblclick', function (event) {
                if (self._map.getZoom() < Setting.getMapCenterZoomLevel()) {
                    self._map.setView(marker.getLatLng(), Setting.getMapCenterZoomLevel(), { animate: true });
                } else {
                    self._map.setView(marker.getLatLng(), self._map.getZoom(), { animate: true });
                }
            });
            */
            marker.on("dragend", function (event) {
                if (marker.options.id != undefined) {
                    var tree: Tree = Model.getTrees().findWhere({
                        id: marker.options.id
                    });
                    EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: marker, location: marker.getLatLng() });
                }
                /*
                if (item.get("type") == ItemType.None || item.id == undefined) {	// new item
                    item.set({ lat: item.marker.getLatLng().lat, lng: item.marker.getLatLng().lng });
                } else {                                    // existing item
                    item.save(
                        { lat: item.marker.getLatLng().lat, lng: item.marker.getLatLng().lng },
                        {
                            success: function (model, response) {
                                FMV.getMsgView().renderSuccess("'" + model.get("name") + "' " + FML.getViewMarkerSaveSuccessMsg());
                            },
                            error: function (error) {
                                FMV.getMsgView().renderError(FML.getViewMarkerSaveErrorMsg());
                            }
                        }
                    );
                }
                
                // update ui if UIMode is Info or Add
                if (FMV.getUIView().getMode() == UIMode.INFO || FMV.getUIView().getMode() == UIMode.ADD) {
                    FMV.getUIView().$("#item-info-lat").val(item.marker.getLatLng().lat.toString());
                    FMV.getUIView().$("#item-info-lng").val(item.marker.getLatLng().lng.toString());
                }
                // open popup
                if (item.marker != null) {
                    item.marker.openPopup();
                }
                */
            });

        }

        private renderMarkersError = (errorMode: ERROR_MODE) => {
            var self: ManageTreesMapView = this;
            console.log(ManageTreesMapView.TAG + "renderMarkersError()");
            EventHandler.handleError(errorMode);
        }

        public setLocation(location: L.LatLng): void {
            var self: ManageTreesMapView = this;
            self._location = location;
        }

        private _mouseOver(event: Event): void {
            var self: ManageTreesMapView = this;
            //EventHandler.handleMouseOver($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ManageTreesMapView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, {marker: self._selectedMarker});
        }
    }
}