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
                "click .btn-action": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: TreeGraphicViewForParent = this;
            if (self.bDebug) console.log(TreeGraphicViewForParent.TAG + "render()");
            var template = _.template(Template.getTreeGraphicViewTemplateForParent());
            self.$el.html(template({}));
            self.setElement(self.$('#wrapper-tree'));

            Controller.fetchAllTrees(function () {
                self.renderChartDatePicker();
                self.renderTreeInfo();
                self.updateAdoptionButton();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        }
        public update(args?: any): any {
            super.update(args);
            var self: TreeGraphicViewForParent = this;
            // Render tree chart
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
            self.updateAdoptionButton();
        }

        public updateAdoptionButton = () => {
            var self: TreeGraphicViewForParent = this;
            Controller.checkIsLoggedIn(function (response) {
                var adopt: Adopt = Model.getAdopts().findWhere({ tree: self._tree.getId(), parent: parseInt(response.id) });
                var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                var ownership: Ownership = Model.getOwnerships().findWhere({ id: self._tree.getOwnershipId() });
                if (adopt) {
                    self.$('.btn-adoption').removeClass('evt-adopt');
                    self.$('.btn-adoption').addClass('evt-unadopt');
                    self.$('.btn-adoption').html('<i class="fa fa-user-times fa-1x"></i> Unadopt Tree');
                } else {
                    self.$('.btn-adoption').removeClass('evt-unadopt');
                    self.$('.btn-adoption').addClass('evt-adopt');
                    self.$('.btn-adoption').html('<i class="fa fa-user-plus fa-1x"></i> Adopt Tree');
                }
            }, function (response) {
                // Handled as refreshing the page if it's not logged in
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
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