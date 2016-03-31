var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ManageDonationsViewFractory = (function () {
        function ManageDonationsViewFractory(args) {
            if (ManageDonationsViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageDonationsViewFractory.getInstance() instead of new.");
            }
            ManageDonationsViewFractory._instance = this;
        }
        ManageDonationsViewFractory.getInstance = function () {
            return ManageDonationsViewFractory._instance;
        };
        ManageDonationsViewFractory.create = function (el, id) {
            var view;
            view = new ManageDonationsTableView({ el: el });
            view.setTreeId(id);
            return view;
        };
        ManageDonationsViewFractory._instance = new ManageDonationsViewFractory();
        return ManageDonationsViewFractory;
    })();
    FoodParent.ManageDonationsViewFractory = ManageDonationsViewFractory;
    var ManageDonationsView = (function (_super) {
        __extends(ManageDonationsView, _super);
        function ManageDonationsView() {
            _super.apply(this, arguments);
            this.renderTreeInfo = function (tree) {
            };
        }
        ManageDonationsView.prototype.setTreeId = function (id) {
            this._id = id;
        };
        return ManageDonationsView;
    })(FoodParent.BaseView);
    FoodParent.ManageDonationsView = ManageDonationsView;
    var ManageDonationsTableView = (function (_super) {
        __extends(ManageDonationsTableView, _super);
        function ManageDonationsTableView(options) {
            var _this = this;
            _super.call(this, options);
            this._addNewPlace = function () {
                var self = _this;
                if (self.$(".new-location").hasClass('hidden')) {
                    FoodParent.Controller.updateGeoLocation(self.renderNewPlace, self.renderGeoLocationError);
                }
                else {
                    self.$(".new-location").addClass('hidden');
                }
            };
            this.renderGeoLocationError = function (error) {
                var self = _this;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.TIMEOUT:
                        break;
                }
            };
            this.renderNewPlace = function (position) {
                var self = _this;
                var place = new FoodParent.Place({ name: "", description: "", lat: position.coords.latitude, lng: position.coords.longitude });
                var places = new FoodParent.Places();
                places.add(place);
                var grid = new Backgrid.Grid({
                    columns: NewLocationColumn,
                    collection: places,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                //grid.sort("name", "ascending");
                self.$(".new-location").html('<div class="list-title">Add a New Location</div>');
                self.$(".new-location").append(grid.el);
                self.$(".new-location").removeClass('hidden');
            };
            this.renderLocations = function () {
                var self = _this;
                FoodParent.Controller.fetchAllLocations(function () {
                    // add grid instance for existing data
                    self.renderLocationList(FoodParent.Model.getPlaces());
                    //self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderLocationList = function (places) {
                var self = _this;
                var grid = new Backgrid.Grid({
                    columns: LocationColumn,
                    collection: places,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                grid.sort("name", "ascending");
                self.$(".list-location").html(grid.el);
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .switch-map": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .add-location": "_addNewPlace",
            };
            self.delegateEvents();
        }
        ManageDonationsTableView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(ManageDonationsTableView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageDonationsTableViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mdonations'));
            self.renderLocations();
            self.resize();
            return self;
        };
        ManageDonationsTableView.prototype.resize = function () {
            $('#content-donations-table').css({ width: FoodParent.View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 3 - 20 });
        };
        ManageDonationsTableView.TAG = "ManageDonationsTableView - ";
        return ManageDonationsTableView;
    })(ManageDonationsView);
    FoodParent.ManageDonationsTableView = ManageDonationsTableView;
    var AddDonationViewFactory = (function () {
        function AddDonationViewFactory(args) {
            if (AddDonationViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use AddDonationViewFactory.getInstance() instead of new.");
            }
            AddDonationViewFactory._instance = this;
        }
        AddDonationViewFactory.getInstance = function () {
            return AddDonationViewFactory._instance;
        };
        AddDonationViewFactory.create = function (el, place) {
            var view = new AddDonationView({ el: el });
            view.setPlace(place);
            return view;
        };
        AddDonationViewFactory._instance = new AddDonationViewFactory();
        return AddDonationViewFactory;
    })();
    FoodParent.AddDonationViewFactory = AddDonationViewFactory;
    var AddDonationView = (function (_super) {
        __extends(AddDonationView, _super);
        function AddDonationView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderNewDonation = function () {
                var self = _this;
                if (self._donation == undefined) {
                    self._donation = new FoodParent.Donation({ type: 0, place: self._place.getId(), quantity: 0, picture: '', date: moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()) });
                }
                var tag = '';
                tag += '<div class="label-group">';
                tag += '<div class="label-group-label">Trees</div>';
                tag += '<div class="label-group-content new-donation-trees"></div>';
                tag += '</div>';
                tag += '<div class="label-group">';
                tag += '<div class="label-group-label">Amount</div>';
                tag += '<div class="label-group-content new-donation-amount"><%= amount %> lbs.</div>';
                tag += '</div>';
                tag += '<div class="label-group">';
                tag += '<div class="label-group-label">Donation Date</div>';
                tag += '<div class="label-group-content new-donation-date"></div>';
                tag += '</div>';
                var template = _.template(tag);
                var data = {
                    amount: self._donation.getQuantity(),
                };
                self.$('.new-donation').html(template(data));
                self.$('.new-donation-date').html(self._donation.getFormattedDate());
                self.$('.new-donation-date').attr({ 'data-value': moment(self._donation.getDateForDatePicker()).format(FoodParent.Setting.getDateFormat()) });
                self.$('.new-donation-date').pickadate({
                    format: "dd mmm yyyy",
                    today: '',
                    max: new Date(moment(new Date()).valueOf()),
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._donation.setDate(moment(this.get()).startOf('day').format(FoodParent.Setting.getDateTimeFormat()));
                        self.renderNewDonation();
                        //self._startDate = ;
                        //self.renderTreeChart(self._tree, self._startDate, self._endDate);
                    }
                });
                self.$('.new-donation-amount').on('click', function (event) {
                    $(this).replaceWith("<input class='new-donation-amount form-control' value='" + parseFloat($(this).html()) + "' />");
                    //self.$('.input-lat').css({ width: width });
                    self.$('.new-donation-amount').focus();
                    self.$('.new-donation-amount').on('focusout', function (event) {
                        self._donation.setQuantity(parseFloat(self.$('.new-donation-amount').val()));
                        self.renderNewDonation();
                        /*
                        var location: L.LatLng = new L.LatLng(parseFloat(self.$('.input-lat').val()), self._selectedMarker.getLatLng().lng);
                        if (location.lat != self._selectedMarker.getLatLng().lat) {
                            if (self._selectedMarker != undefined && self._selectedMarker.options.id != undefined) {
                                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: self._selectedMarker, location: location }, function () {
                                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    self.renderRecentActivities(tree);
                                    EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                                    // Move marker to desired location & update info panel
                                    self._selectedMarker.setLatLng(tree.getLocation());
                                    self._map.setView(tree.getLocation());
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                        */
                        //} else {
                        //    
                        //}
                    });
                });
                // Event listener for uploading a file.
                self.$('input[type=file]').off('change');
                self.$('input[type=file]').on('change', function (event) {
                    self.$('.wrapper-input-upload-picture').addClass('hidden');
                    self.$('.wrapper-uploading-picture').removeClass('hidden');
                    var files = event.target.files;
                    if (files.length > 0) {
                        FoodParent.Controller.uploadNotePictureFile(files[0], fileNameEncode(self._place.getName()), function (fileName) {
                            self._donation.addPicture(fileName);
                            // Success
                            self.$('input[type=file]').val("");
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                            self.renderDonationImages();
                        }, function () {
                            // Error
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                        });
                    }
                });
                var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
                self.$('.new-donation-trees').html(template({
                    trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
                }));
                self.$('.content-manage-adoption-table').scrollTop();
            };
            this.renderTrees = function () {
                var self = _this;
                FoodParent.Controller.fetchAllTrees(function () {
                    self.renderTreeList(FoodParent.Model.getTrees());
                    self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderTreeList = function (trees) {
                var self = _this;
                if (self._bTableView) {
                    var optionValues = new Array();
                    optionValues.push({ name: "Food", values: FoodParent.Model.getFoods().toArray() });
                    DonationColumn[0].cell = Backgrid.SelectCell.extend({
                        editor: Backgrid.FoodSelectCellEditor,
                        optionValues: optionValues,
                    });
                    var grid = new Backgrid.Grid({
                        columns: DonationColumn,
                        collection: trees,
                        emptyText: FoodParent.Setting.getNoDataText(),
                    });
                    grid.render();
                    grid.sort("id", "ascending");
                    self.$(".list-donation").html(grid.el);
                }
                else {
                    FoodParent.Controller.updateGeoLocation(self.renderMap, self.renderMapError);
                }
            };
            this.renderMapError = function (error) {
                var self = _this;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR);
                        break;
                    case error.TIMEOUT:
                        break;
                }
                self.renderMap({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
            };
            this.renderMap = function (position) {
                var self = _this;
                var accuracy = position.coords.accuracy;
                self._location = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (self._map == undefined) {
                    self.setLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    self._map = L.map(self.$('#list-donation')[0].id, {
                        zoomControl: false,
                        closePopupOnClick: true,
                        doubleClickZoom: true,
                        touchZoom: true,
                        zoomAnimation: true,
                        markerZoomAnimation: true,
                    }).setView(self._location, self._zoom);
                    L.tileLayer(FoodParent.Setting.getTileMapAddress(), {
                        minZoom: FoodParent.Setting.getMapMinZoomLevel(),
                        maxZoom: FoodParent.Setting.getMapMaxZoomLevel(),
                    }).addTo(self._map);
                    self._map.invalidateSize(false);
                    // add event listener for finishing map creation.
                    self._map.whenReady(self.renderMarkers);
                    // add event listener for dragging map
                    self._map.on("moveend", self.afterMoveMap);
                    //Controller.fetchAllTrees();
                    self._map.on('popupopen', function (event) {
                        var marker = event.popup._source;
                        marker._bringToFront();
                        $(marker.label._container).addClass('active');
                        //$('.leaflet-popup-content .marker-control-item').off('click');
                        //$('.leaflet-popup-content .marker-control-item').on('click', function (event) {
                        //    //console.log($('.leaflet-popup-content .glyphicon').attr('data-id'));
                        //    Router.getInstance().navigate("tree/" + $('.leaflet-popup-content .glyphicon').attr('data-id'), { trigger: true });
                        //});
                        var tree = FoodParent.Model.getTrees().findWhere({ id: marker.options.id });
                        self._selectedMarker = marker;
                        self.renderTreeInfo(tree);
                        // Make MessageView invisible.
                        if (FoodParent.View.getMessageView()) {
                            FoodParent.View.getMessageView().setInvisible();
                        }
                    });
                    self._map.on('popupclose', function (event) {
                        var marker = event.popup._source;
                        marker._resetZIndex();
                        $(marker.label._container).removeClass('active');
                        self.$('#wrapper-treeinfo').addClass('hidden');
                        self._selectedMarker = null;
                    });
                }
            };
            this.renderMarkers = function () {
                var self = _this;
                console.log(AddDonationView.TAG + "renderMarkers()");
                self._markers = new Array();
                $.each(FoodParent.Model.getTrees().models, function (index, tree) {
                    var bFound = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        self.addMarker(tree);
                    }
                });
                /*
                if (self._id != undefined && self._id != 0) {
                    for (var j = 0; j < self._markers.length; j++) {
                        if (self._markers[j].options.id == self._id) {
                            self._markers[j].openPopup();
                            self._map.setView(self._markers[j].getLatLng());
                            break;
                        }
                    }
                }
                */
                var trees = FoodParent.Model.getTrees();
                // Apply food filtering
                var foodIds = new Array();
                $.each(self.$('.filter-food input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFoodIds(foodIds);
                // Apply adopt filtering
                var adoptIds = new Array();
                $.each(self.$('.filter-adopt input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByAdoptStatus(adoptIds);
                self.updateMarkers(trees);
                // render tree info
                self.$('.leaflet-top.leaflet-right').html('<div id="wrapper-treeinfo"></div>');
            };
            this.updateMarkers = function (trees) {
                var self = _this;
                console.log(AddDonationView.TAG + "updateMarkers()");
                // Add new markers
                $.each(trees.models, function (index, tree) {
                    var bFound = false;
                    for (var j = 0; j < self._markers.length && !bFound; j++) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    }
                    if (!bFound) {
                        self.addMarker(tree);
                    }
                });
                // Remove unnecessary markers
                for (var j = 0; j < self._markers.length;) {
                    var bFound = false;
                    $.each(trees.models, function (index, tree) {
                        if (tree.getId() == self._markers[j].options.id) {
                            bFound = true;
                        }
                    });
                    if (!bFound) {
                        // close popup if the marker is selected
                        if (self._markers[j] == self._selectedMarker) {
                            self._selectedMarker.closePopup();
                        }
                        self.removeMarker(self._markers[j]);
                        self._markers = _.without(self._markers, self._markers[j]);
                        j--;
                    }
                    j++;
                }
            };
            this.afterMoveMap = function () {
                var self = _this;
                if (self._selectedMarker) {
                    self._selectedMarker._bringToFront();
                }
            };
            this.renderFilterList = function () {
                var self = _this;
                FoodParent.Controller.checkAdmin(function (response) {
                    if (response.result == "true") {
                        var template = _.template(FoodParent.Template.getTreeFilterListTemplate());
                        var data = {
                            foods: FoodParent.Model.getFoods(),
                            userid: parseInt(response.id),
                            flags: FoodParent.Model.getFlags(),
                            ownerships: FoodParent.Model.getOwnerships(),
                        };
                        self.$('#filter-list').html(template(data));
                    }
                }, function (response) {
                });
            };
            var self = this;
            self.bDebug = true;
            self._bTableView = true;
            self._zoom = FoodParent.Setting.getDefaultMapZoomLevel();
            self._markers = new Array();
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
                "click .button-close": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .button-submit-donation": "_submitDonations",
                "click .cell-tree-detail": "_removeNewDonationTree",
                "click .switch-map": "_switchView",
                "click .marker-control-plus": "_addNewDonation",
                "click .image-group img": "_selectCoverImage",
            };
            self.delegateEvents();
        }
        AddDonationView.prototype.setPlace = function (place) {
            var self = this;
            self._place = place;
        };
        AddDonationView.prototype.getPlace = function () {
            var self = this;
            return self._place;
        };
        AddDonationView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(AddDonationView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageDonationViewTemplate());
            var data = {
                placename: self._place.getName(),
                placeid: self._place.getId(),
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-manage-donation'));
            self.renderTrees();
            self.renderNewDonation();
            self.setVisible();
            self.resize();
            return self;
        };
        AddDonationView.prototype.addNewDonation = function (tree) {
            var self = this;
            if (self._donation.getTreeIds().length == 0) {
                self._donation.addTreeId(tree.getId());
            }
            else {
                var firstTreeId = Math.floor(self._donation.getTreeIds()[0]);
                var firstTree = FoodParent.Model.getTrees().findWhere({ id: firstTreeId });
                var firstFood = FoodParent.Model.getFoods().findWhere({ id: firstTree.getFoodId() });
                var currentFood = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (firstFood.getId() == currentFood.getId()) {
                    self._donation.addTreeId(tree.getId());
                }
                else {
                    new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please select <strong>same type</strong> of food.", undoable: false }).execute();
                }
            }
            var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        };
        AddDonationView.prototype._addNewDonation = function (event) {
            var self = this;
            self.addNewDonation(FoodParent.Model.getTrees().findWhere({ id: self._selectedMarker.options.id }));
        };
        AddDonationView.prototype.removeNewDonation = function (donation) {
            var self = this;
            //self._donations.remove(donation);
        };
        AddDonationView.prototype.renderDonationImages = function () {
            var self = this;
            var tag = '';
            $.each(self._donation.getPictures(), function (index, filename) {
                if (index == 0) {
                    tag += '<img src="' + FoodParent.Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                }
                else {
                    tag += '<img src="' + FoodParent.Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index, element) {
                $(element).attr('src', FoodParent.Setting.getContentPictureDir() + self._donation.getPictures()[index]).load(function () {
                }).error(function () {
                    $(element).attr('src', FoodParent.Setting.getBlankImagePath());
                });
            });
        };
        AddDonationView.prototype._selectCoverImage = function (event) {
            var self = this;
            $.each(self.$('.image-group img'), function (index, element) {
                $(element).removeClass('selected');
            });
            $(event.target).addClass('selected');
            self._donation.setCover(parseInt($(event.target).attr('data-target')));
            self.renderDonationImages();
        };
        AddDonationView.prototype.renderTreeInfo = function (tree) {
            var self = this;
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            var template = _.template(FoodParent.Template.getTreeInfoTemplate3());
            var data = {
                foodname: food.getName(),
                treename: tree.getName(),
                lat: tree.getLat().toFixed(4),
                lng: tree.getLng().toFixed(4),
                description: tree.getDescription(),
                persons: tree.getParents(),
            };
            self.$('#wrapper-treeinfo').html(template(data));
            self.$('#wrapper-treeinfo').removeClass('hidden');
            if (tree.getAddress().trim() == '') {
                FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data) {
                    self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
            else {
                self.$(".input-address").html(tree.getAddress());
            }
            self.renderRecentActivities(tree);
        };
        AddDonationView.prototype.renderRecentActivities = function (tree) {
            var self = this;
            var trees = new Array();
            trees.push(tree);
            FoodParent.Controller.fetchNotesOfTrees(trees, FoodParent.NoteType.IMAGE, FoodParent.Setting.getNumRecentActivitiesShown(), 0, function () {
                var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: tree.getId(), type: FoodParent.NoteType.IMAGE }));
                notes.sortByDescendingDate();
                var template = _.template(FoodParent.Template.getRecentCommentsTemplate());
                var data = {
                    notes: notes,
                    size: FoodParent.Setting.getNumRecentActivitiesShown(),
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: FoodParent.Model.getFlags(),
                    ownerships: FoodParent.Model.getOwnerships(),
                };
                self.$('#list-activities').html(template(data));
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        AddDonationView.prototype.removeMarker = function (marker) {
            var self = this;
            self._map.removeLayer(marker);
        };
        AddDonationView.prototype.addMarker = function (tree) {
            var self = this;
            var marker = FoodParent.MarkerFractory.create2(tree, true);
            self._markers.push(marker);
            marker.addTo(self._map);
        };
        AddDonationView.prototype.setLocation = function (location) {
            var self = this;
            self._location = location;
        };
        AddDonationView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(AddDonationView.TAG + "update()");
            return self;
        };
        AddDonationView.prototype.resize = function () {
            var self = this;
            $('#content-manage-adoption-table').css({ width: self.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtrees').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: self.getHeight() - 34 * 3 - 30 });
            //$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        };
        AddDonationView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        AddDonationView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        AddDonationView.prototype._applyFilter = function (event) {
            var self = this;
            var trees = FoodParent.Model.getTrees();
            setTimeout(function () {
                // Apply only my trees
                if (self.$('input[name="onlymine"]').prop('checked') == true) {
                    trees = trees.filterByParent(parseInt(self.$('input[name="onlymine"]').attr('data-target')));
                }
                // Filtering ownership type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'ownershipsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-ownership').addClass('active');
                            $('.filter-ownership input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-ownership').removeClass('active');
                            $('.filter-ownership input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply ownership filtering
                var ownershipIds = new Array();
                $.each(self.$('.filter-ownership input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        ownershipIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByOwnershipIds(ownershipIds);
                // Filtering flag type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'flagsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-flag').addClass('active');
                            $('.filter-flag input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-flag').removeClass('active');
                            $('.filter-flag input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply flag filtering
                var flagIds = new Array();
                $.each(self.$('.filter-flag input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        flagIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFlagIds(flagIds);
                // Filtering food type.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'foodsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-food').addClass('active');
                            $('.filter-food input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-food').removeClass('active');
                            $('.filter-food input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply food filtering
                var foodIds = new Array();
                $.each(self.$('.filter-food input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        foodIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByFoodIds(foodIds);
                // Filtering adoption status.
                if (event != undefined) {
                    if ($(event.target).find('input').prop('name') == 'adoptsall') {
                        if ($(event.target).find('input').prop('checked') == true) {
                            $('.filter-adopt').addClass('active');
                            $('.filter-adopt input').prop({ 'checked': 'checked' });
                        }
                        else {
                            $('.filter-adopt').removeClass('active');
                            $('.filter-adopt input').prop({ 'checked': '' });
                        }
                    }
                }
                // Apply adopt filtering
                var adoptIds = new Array();
                $.each(self.$('.filter-adopt input'), function (index, item) {
                    if ($(item).prop('checked') == true) {
                        adoptIds.push(Math.floor($(item).prop('name')));
                    }
                });
                trees = trees.filterByAdoptStatus(adoptIds);
                if (self._bTableView) {
                    // update markers
                    self.renderTreeList(trees);
                }
                else {
                    // update markers
                    self.updateMarkers(trees);
                }
            }, 1);
        };
        AddDonationView.prototype._submitDonations = function (event) {
            var self = this;
            if (self._donation.getTreeIds().length == 0 || self._donation.getQuantity() == 0) {
                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please select at least <strong>one tree</strong> with proper <strong>amount</strong> for donation.", undoable: false }).execute();
            }
            else {
                var treeIds = self._donation.getTreeIds();
                var tree = FoodParent.Model.getTrees().findWhere({ id: treeIds[0] });
                self._donation.setType(tree.getFoodId());
                FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.CREATE, {}, function () {
                    FoodParent.EventHandler.handleDataChange("Donation for <strong><i>" + self._place.getName() + "</i></strong> has been added successfully.", true);
                    self._donation = null;
                    self.renderNewDonation();
                    self.$('.image-group').html("");
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        AddDonationView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AddDonationView.prototype._removeNewDonationTree = function (event) {
            var self = this;
            var treeId = parseInt($(event.target).attr('data-target'));
            self._donation.removeTreeId(treeId);
            var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
        };
        AddDonationView.prototype._switchView = function (event) {
            var self = this;
            if (self._bTableView) {
                self._bTableView = false;
                $(event.target).html("Switch to Table View");
            }
            else {
                self._bTableView = true;
                $(event.target).html("Switch to Map View");
                self._map.remove();
                self._map = null;
            }
            self.$('#list-donation').html("");
            self.renderTreeList(FoodParent.Model.getTrees());
            var trees = FoodParent.Model.getTrees();
            // Apply food filtering
            var foodIds = new Array();
            $.each(self.$('.filter-food input'), function (index, item) {
                if ($(item).prop('checked') == true) {
                    foodIds.push(Math.floor($(item).prop('name')));
                }
            });
            trees = trees.filterByFoodIds(foodIds);
            // Apply adopt filtering
            var adoptIds = new Array();
            $.each(self.$('.filter-adopt input'), function (index, item) {
                if ($(item).prop('checked') == true) {
                    adoptIds.push(Math.floor($(item).prop('name')));
                }
            });
            trees = trees.filterByAdoptStatus(adoptIds);
            if (self._bTableView) {
                // update markers
                self.renderTreeList(trees);
            }
            else {
            }
        };
        AddDonationView.TAG = "AddDonationView - ";
        return AddDonationView;
    })(FoodParent.PopupView);
    FoodParent.AddDonationView = AddDonationView;
})(FoodParent || (FoodParent = {}));
