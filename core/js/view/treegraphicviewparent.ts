module FoodParent {
    export class TreeGraphicViewForParent extends TreeGraphicView {
        protected static TAG: string = "TreeGraphicViewForGuest - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreeGraphicViewForParent = this;
            self.bDebug = true;
            self.events = <any>{
                "click .btn-date": "_applyDatePreset",
                "click .evt-chart": "_showPostFromChart",
                "click .evt-note": "_showPostFromList",
            };
            self.delegateEvents();
        }
        public renderTreeInfo = () => {
            var self: TreeGraphicViewForParent = this;
            self._tree = Model.getTrees().findWhere({ id: self._id });
            Controller.fetchAllFlagsAndOwners(function () {
                var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                var ownership: Ownership = Model.getOwnerships().findWhere({ id: self._tree.getOwnershipId() });

                var template = _.template(Template.getTreeBasicInfoTemplateForGuest());
                self.$('.content-tree-basicinfo').html(template({
                    foodname: food.getName(),
                    treename: self._tree.getName(),
                    lat: self._tree.getLat().toFixed(4),
                    lng: self._tree.getLng().toFixed(4),
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
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
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    }
}