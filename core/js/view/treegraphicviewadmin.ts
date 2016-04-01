module FoodParent {
    export class TreeGraphicViewForAdmin extends TreeGraphicView {
        protected static TAG: string = "TreeGraphicViewForGuest - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreeGraphicViewForAdmin = this;
            self.bDebug = true;
            self.events = <any>{
                "click .btn-date": "_applyDatePreset",
                "click .evt-chart": "_showPostFromChart",
                "click .evt-note": "_showPostFromList",
                "click .flag-radio": "_updateFlag",
                "click .ownership-radio": "_updateOwnership",
                "click .btn-action": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: TreeGraphicViewForAdmin = this;
            if (self.bDebug) console.log(TreeGraphicViewForAdmin.TAG + "render()");
            var template = _.template(Template.getTreeGraphicViewTemplateForAdmin());
            self.$el.html(template({}));
            self.setElement(self.$('#wrapper-tree'));

            Controller.fetchAllTrees(function () {
                self.renderChartDatePicker();
                self.renderTreeInfo();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        }
        public renderTreeInfo = (tree?: Tree) => {
            var self: TreeGraphicViewForAdmin = this;
            self._tree = Model.getTrees().findWhere({ id: self._id });
            Controller.fetchAllFlagsAndOwners(function () {
                var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                var ownership = self._tree.getOwnershipId();

                var template = _.template(Template.getTreeBasicInfoTemplateForGuest());
                self.$('.content-tree-basicinfo').html(template({
                    foodname: food.getName(),
                    treename: self._tree.getName(),
                    lat: self._tree.getLat().toFixed(4),
                    lng: self._tree.getLng().toFixed(4),
                    flags: Model.getFlags(),
                    description: self._tree.getDescription(),
                    parents: self._tree.getParents(),
                }));

                // Render address either from the reverse geo-coding server or stored address
                self.$('.input-address').replaceWith('<div class="input-address"></div>');
                if (self._tree.getAddress().trim() == '') {
                    GeoLocation.reverseGeocoding(self._tree.getLocation(), function (data: ReverseGeoLocation) {
                        self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else {
                    self.$(".input-address").html(self._tree.getAddress());
                }

                self.renderFlagInfo(self._tree.getFlags());
                self.renderOwnershipInfo(ownership);
                self.renderRecentComments(self._tree);
                self.renderRecentActivities(self._tree);

                // Event listner for changing address
                self.$('.input-address').on('click', function (event) {
                    $(this).replaceWith("<input type='text' class='input-address form-control' value='" + htmlEncode($(this).text()) + "' />");
                    self.$('.input-address').focus();
                    self.$('.input-address').on('focusout', function (event) {
                        self.updateTreeAddress(self._tree, self.$('.input-address').val());
                    });
                    self.$('.input-address').on('keydown', function (event) {
                        if (event.keyCode == 13) {  // enter
                            self.updateTreeAddress(self._tree, self.$('.input-address').val());
                        } else if (event.keyCode == 27) {   // esc
                            self.renderTreeInfo(self._tree);
                        }
                    });
                });

                // Event listner for changing description
                self.$('.input-description').on('click', function (event) {
                    $(this).replaceWith("<input type='text' class='input-description form-control' value='" + htmlEncode($(this).text()) + "' />");
                    self.$('.input-description').focus();
                    self.$('.input-description').on('focusout', function (event) {
                        self.updateTreeDescription(self._tree, self.$('.input-description').val());
                    });
                    self.$('.input-description').on('keydown', function (event) {
                        if (event.keyCode == 13) {  // enter
                            self.updateTreeDescription(self._tree, self.$('.input-description').val());
                        } else if (event.keyCode == 27) {   // esc
                            self.renderTreeInfo(self._tree);
                        }
                    });
                });

                // Event listner for changing food type
                self.$('.input-food').on('click', function (event) {
                    var template = _.template(Template.FoodSelectTemplate());
                    var data = {
                        foods: Model.getFoods(),
                    }
                    $(this).replaceWith(template(data));
                    self.$('.input-food').selectpicker();
                    self.$('.input-food').selectpicker("val", food.getId());
                    self.$('.input-food').on('hide.bs.dropdown', function (event) {
                        self.updateTreeFoodType(self._tree, parseInt($(this).find("option:selected").val()));
                    });
                    self.$('.input-lat').on('focusout', function (event) {
                        self.renderTreeInfo(self._tree);
                    });
                    self.$('.input-lat').on('keydown', function (event) {
                        if (event.keyCode == 27) {   // esc
                            self.renderTreeInfo(self._tree);
                        }
                    });
                });

                // Event listner for changing latitude
                self.$('.input-lat').on('click', function (event) {
                    $(this).replaceWith("<input class='input-lat form-control' value='" + $(this).html() + "' />");
                    self.$('.input-lat').focus();
                    self.$('.input-lat').on('focusout', function (event) {
                        self.updateTreeLocation(self._tree, new L.LatLng(parseFloat(self.$('.input-lat').val()), self._tree.getLocation().lng));
                    });
                    self.$('.input-lat').on('keydown', function (event) {
                        if (event.keyCode == 13) { // enter
                            self.updateTreeLocation(self._tree, new L.LatLng(parseFloat(self.$('.input-lat').val()), self._tree.getLocation().lng));
                        } else if (event.keyCode == 27) {   // esc
                            self.renderTreeInfo(self._tree);
                        }
                    });
                });

                // Event listner for changing longitude
                self.$('.input-lng').on('click', function (event) {
                    var width: number = self.$('.input-lng').outerWidth() + 8;
                    $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                    //self.$('.input-lng').css({ width: width });
                    self.$('.input-lng').focus();
                    self.$('.input-lng').on('focusout', function (event) {
                        self.updateTreeLocation(self._tree, new L.LatLng(self._tree.getLocation().lat, parseFloat(self.$('.input-lng').val())));
                    });
                    self.$('.input-lng').on('keydown', function (event) {
                        if (event.keyCode == 13) {  // enter
                            self.updateTreeLocation(self._tree, new L.LatLng(self._tree.getLocation().lat, parseFloat(self.$('.input-lng').val())));
                        } else if (event.keyCode == 27) {   // esc
                            self.renderTreeInfo(self._tree);
                        }
                    });
                });
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    }
}
