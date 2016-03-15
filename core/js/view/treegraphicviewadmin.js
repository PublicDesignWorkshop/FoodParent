var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreeGraphicViewForAdmin = (function (_super) {
        __extends(TreeGraphicViewForAdmin, _super);
        function TreeGraphicViewForAdmin(options) {
            var _this = this;
            _super.call(this, options);
            this.renderTreeInfo = function (tree) {
                var self = _this;
                self._tree = FoodParent.Model.getTrees().findWhere({ id: self._id });
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: self._tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getTreeBasicInfoTemplateForGuest());
                    self.$('.content-tree-basicinfo').html(template({
                        foodname: food.getName(),
                        treename: self._tree.getName(),
                        lat: self._tree.getLat().toFixed(4),
                        lng: self._tree.getLng().toFixed(4),
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                        description: self._tree.getDescription(),
                        parents: self._tree.getParents(),
                    }));
                    // Render address either from the reverse geo-coding server or stored address
                    self.$('.input-address').replaceWith('<div class="input-address"></div>');
                    if (self._tree.getAddress().trim() == '') {
                        FoodParent.GeoLocation.reverseGeocoding(self._tree.getLocation(), function (data) {
                            self.$(".input-address").html(data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else {
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
                            if (event.keyCode == 13) {
                                self.updateTreeAddress(self._tree, self.$('.input-address').val());
                            }
                            else if (event.keyCode == 27) {
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
                            if (event.keyCode == 13) {
                                self.updateTreeDescription(self._tree, self.$('.input-description').val());
                            }
                            else if (event.keyCode == 27) {
                                self.renderTreeInfo(self._tree);
                            }
                        });
                    });
                    // Event listner for changing food type
                    self.$('.input-food').on('click', function (event) {
                        var template = _.template(FoodParent.Template.FoodSelectTemplate());
                        var data = {
                            foods: FoodParent.Model.getFoods(),
                        };
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
                            if (event.keyCode == 27) {
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
                            if (event.keyCode == 13) {
                                self.updateTreeLocation(self._tree, new L.LatLng(parseFloat(self.$('.input-lat').val()), self._tree.getLocation().lng));
                            }
                            else if (event.keyCode == 27) {
                                self.renderTreeInfo(self._tree);
                            }
                        });
                    });
                    // Event listner for changing longitude
                    self.$('.input-lng').on('click', function (event) {
                        var width = self.$('.input-lng').outerWidth() + 8;
                        $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                        //self.$('.input-lng').css({ width: width });
                        self.$('.input-lng').focus();
                        self.$('.input-lng').on('focusout', function (event) {
                            self.updateTreeLocation(self._tree, new L.LatLng(self._tree.getLocation().lat, parseFloat(self.$('.input-lng').val())));
                        });
                        self.$('.input-lng').on('keydown', function (event) {
                            if (event.keyCode == 13) {
                                self.updateTreeLocation(self._tree, new L.LatLng(self._tree.getLocation().lat, parseFloat(self.$('.input-lng').val())));
                            }
                            else if (event.keyCode == 27) {
                                self.renderTreeInfo(self._tree);
                            }
                        });
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .btn-date": "_applyDatePreset",
                "click .evt-chart": "_showPostFromChart",
                "click .evt-note": "_showPostFromList",
                "click .flag-radio": "_updateFlag",
                "click .ownership-radio": "_updateOwnership",
            };
            self.delegateEvents();
        }
        TreeGraphicViewForAdmin.TAG = "TreeGraphicViewForGuest - ";
        return TreeGraphicViewForAdmin;
    })(FoodParent.TreeGraphicView);
    FoodParent.TreeGraphicViewForAdmin = TreeGraphicViewForAdmin;
})(FoodParent || (FoodParent = {}));
