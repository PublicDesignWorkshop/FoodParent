var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreeGraphicViewForGuest = (function (_super) {
        __extends(TreeGraphicViewForGuest, _super);
        function TreeGraphicViewForGuest(options) {
            var _this = this;
            _super.call(this, options);
            this.renderTreeInfo = function () {
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
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }
        TreeGraphicViewForGuest.TAG = "TreeGraphicViewForGuest - ";
        return TreeGraphicViewForGuest;
    })(FoodParent.TreeGraphicView);
    FoodParent.TreeGraphicViewForGuest = TreeGraphicViewForGuest;
})(FoodParent || (FoodParent = {}));
