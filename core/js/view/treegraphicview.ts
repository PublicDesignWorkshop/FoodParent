module FoodParent {
    export class TreeViewFractory {
        private static _instance: TreeViewFractory = new TreeViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (TreeViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use TreeViewFractory.getInstance() instead of new.");
            }
            TreeViewFractory._instance = this;
        }
        public static getInstance(): TreeViewFractory {
            return TreeViewFractory._instance;
        }
        public static create(el: JQuery, id: number, credential: CREDENTIAL_MODE): TreeView {
            var view: TreeView;
            if (credential == CREDENTIAL_MODE.GUEST) {
                view = new TreeGraphicViewForGuest({ el: el });
            } else if (credential == CREDENTIAL_MODE.PARENT) {
                view = new TreeGraphicViewForParent({ el: el });
            } else if (credential == CREDENTIAL_MODE.ADMIN) {
                view = new TreeGraphicViewForAdmin({ el: el });
            }
            view.setTreeId(id);
            return view;
        }
    }

    export class TreeView extends BaseView {
        protected _id: number;
        public setTreeId(id: number) {
            this._id = Math.floor(id);
        }
        public renderTreeInfo = (tree?: Tree) => { }
    }

    export class TreeGraphicView extends TreeView {
        protected static TAG: string = "TreeGraphicView - ";
        protected _tree: Tree;
        protected _note: Note;
        protected _startDate: string;
        protected _endDate: string;
        protected _chart: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreeGraphicView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: TreeGraphicView = this;
            /*
            if (self.bDebug) console.log(TreeGraphicView.TAG + "render()");
            var template = _.template(Template.getTreeGraphicViewTemplate());
            self.$el.html(template({ }));
            self.setElement(self.$('#wrapper-tree'));

            Controller.fetchAllTrees(function () {
                self.renderChartDatePicker();
                self.renderTreeInfo();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            */
            return self;
        }
        public update(args?: any): any {
            super.update(args);
            var self: TreeGraphicView = this;
            // Render tree chart
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        }
        public resize(): any {
            var self: TreeGraphicView = this;
            // Render tree chart
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        }

        /**
            Render date picker in a chart view
        */
        protected renderChartDatePicker = () => {
            var self: TreeGraphicView = this;
            self._tree = Model.getTrees().findWhere({ id: self._id });
            self.$('.tree-graph-start').attr({ 'data-value': moment(new Date()).subtract(3, 'month').format(Setting.getDateFormat()) });
            self._startDate = moment(moment(new Date()).subtract(3, 'month').format(Setting.getDateFormat())).format(Setting.getDateTimeFormat());

            self.$('.tree-graph-start').pickadate({
                format: "dd mmm yyyy",
                today: '',
                max: new Date(moment(new Date()).subtract('day', 2).valueOf()),
                clear: '',
                close: 'Close',
                onClose: function () {
                    self._startDate = moment(this.get()).startOf('day').format(Setting.getDateTimeFormat());
                    self.renderTreeChart(self._tree, self._startDate, self._endDate);
                }
            });
            var today: Date = new Date();
            self._endDate = moment(today).endOf('day').format(Setting.getDateTimeFormat());
            self.$('.tree-graph-end').attr({ 'data-value': moment(new Date()).format(Setting.getDateFormat()) });
            self.$('.tree-graph-end').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    self._endDate = moment(this.get()).endOf('day').format(Setting.getDateTimeFormat());
                    self.renderTreeChart(self._tree, self._startDate, self._endDate);
                }
            });
            // Render tree chart
            self.renderTreeChart(self._tree, self._startDate, self._endDate);

        }
        /**
            Render tree chart using start and end dates
        */
        public renderTreeChart = (tree: Tree, startDate: string, endDate: string) => {
            var self: TreeGraphicView = this;
            if (self.bDebug) console.log(TreeGraphicView.TAG + "renderTreeChart()");
            Controller.fetchCommentsOfTreesDuringPeriod([self._tree], startDate, endDate, 10000, 0, function () {
                // Create a canvas for chart
                self.$('#wrapper-chart').html('<canvas id="content-chart" class="content-chart" />');
                var canvas: any = self.$('#content-chart')[0];
                self.$('#content-chart').attr({ 'width': self.$('#content-chart').innerWidth(), 'height': self.$('#content-chart').innerHeight() });
                var ctx = canvas.getContext("2d");
                // Tooltip event listener
                self.$('#wrapper-graph').on('mousemove', function (event) {
                    if (event.clientX - 24 - $('#wrapper-tooltip').outerWidth() < 0) {
                        self.$('#wrapper-tooltip').css({ top: event.clientY - 60, left: event.clientX + 24 });
                    } else {
                        self.$('#wrapper-tooltip').css({ top: event.clientY - 60, left: event.clientX - 24 - self.$('#wrapper-tooltip').outerWidth() });
                    }
                });
                self.$('#wrapper-graph').on('mouseleave', function (event) {
                    self.$('#wrapper-tooltip').addClass('hidden');
                });

                var labels: Array<string> = new Array<string>();
                var notes: Array<Note> = new Array<Note>();
                var start: Moment = moment(startDate).set('hour', 13).set('minute', 0).set('seconds', 0).set('milliseconds', 0);

                for (var i: number = moment(start).valueOf(); i < moment(endDate).add('day', 1).valueOf(); i += 1000 * 60 * 60 * 24) {
                    labels.push(moment(i).format(Setting.getDateHourFormat()));
                    var note: Note = Model.getNotes().getLatestImageNoteOfDate(self._tree.getId(), i, NoteType.IMAGE);
                    if (note) {
                        notes.push(note);
                    } else {
                        notes.push(new Note({ type: NoteType.IMAGE, tree: self._tree.getId(), person: 0, comment: "", picture: "", rate: 0, cover: 0, date: moment(i).format(Setting.getDateTimeFormat()) }));
                    }
                }
                if (self.bDebug) console.log(TreeGraphicView.TAG + "Graph Points Length: " + notes.length);
                var labelSkip: number = Math.floor(labels.length / (self.$('#content-chart').innerWidth() / 150));
                if (self._chart) {
                    self._chart.destroy();
                }
                self._chart = new Chart(ctx).Line(
                    {
                        labels: labels,
                        datasets: [
                            {
                                label: "My First dataset",
                                fillColor: "rgba(132,167,87,0.4)",
                                strokeColor: "rgba(132,167,87,1)",
                                pointColor: "rgba(132,167,87,1)",
                                pointStrokeColor: "rgba(132,167,87,1)",
                                pointHighlightFill: "rgba(220,220,220,1)",
                                pointHighlightStroke: "rgba(132,167,87,1)",
                                data: notes,
                            },
                        ]
                    }, {
                        scaleOverride: true,
                        scaleSteps: 1,
                        scaleStepWidth: 5,
                        scaleStartValue: 0,
                        pointDotRadius: 3,
                        pointDotStrokeWidth: 2,
                        bezierCurve: false,
                        pointHitDetectionRadius: self.$('#content-chart').innerWidth() / notes.length * 0.5,
                        pointDot: false,
                        labelskip: labelSkip,
                        customTooltips: function (tooltip) {
                            // tooltip will be false if tooltip is not visible or should be hidden
                            if (!tooltip || !tooltip.id) {
                                self.$('#wrapper-tooltip').addClass('hidden');
                                self._note = null;
                                return;
                            }
                            self._note = Model.getNotes().findWhere({ id: tooltip.id });
                            if (self._note) {
                                var template = _.template(Template.getToolTipTemplate());
                                var data = {
                                    image: Setting.getBlankImagePath(),
                                    value: self._note.getRate().toFixed(2) + " / " + Setting.getMaxRating().toFixed(2),
                                    comment: htmlDecode(self._note.getComment()),
                                    date: tooltip.label,
                                }
                                self.$('#wrapper-tooltip').html(template(data));
                                if (self._note.getPictures().length > 0) {
                                    self.$('#wrapper-tooltip img').attr('src', Setting.getContentPictureDir() + self._note.getPictures()[0]).load(function () {
                                        $(this).removeClass('hidden');
                                    }).error(function () {
                                        $(this).attr('src', Setting.getBlankImagePath());
                                        $(this).addClass('hidden');
                                    });
                                } else {
                                    self.$('#wrapper-tooltip img').addClass('hidden');
                                }
                            } else {
                                self.$('#wrapper-tooltip img').addClass('hidden');
                            }
                            self.$('#wrapper-tooltip').removeClass('hidden');
                        },
                    }
                );
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private _applyDatePreset(event: Event): void {
            var self: TreeGraphicView = this;
            if ($(event.currentTarget).hasClass('4years')) {
                self._startDate = moment(self._endDate).subtract(4, 'years').startOf('day').format(Setting.getDateTimeFormat());
            } else if ($(event.currentTarget).hasClass('2years')) {
                self._startDate = moment(self._endDate).subtract(2, 'years').startOf('day').format(Setting.getDateTimeFormat());
            } else if ($(event.currentTarget).hasClass('1year')) {
                self._startDate = moment(self._endDate).subtract(1, 'years').startOf('day').format(Setting.getDateTimeFormat());
            } else if ($(event.currentTarget).hasClass('6months')) {
                self._startDate = moment(self._endDate).subtract(6, 'months').startOf('day').format(Setting.getDateTimeFormat());
            } else if ($(event.currentTarget).hasClass('3months')) {
                self._startDate = moment(self._endDate).subtract(3, 'months').startOf('day').format(Setting.getDateTimeFormat());
            } else if ($(event.currentTarget).hasClass('1month')) {
                self._startDate = moment(self._endDate).subtract(1, 'months').startOf('day').format(Setting.getDateTimeFormat());
            }
            self.$('.tree-graph-start').pickadate('picker').set('select', moment(self._startDate).format(Setting.getDateFormat()), { format: 'dd mmm yyyy' })
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        }

        protected renderFlagInfo(flags: Array<number>): void {
            var self: TreeGraphicView = this;
            Controller.checkIsAdmin(function (response) {
                $.each(self.$('.flag-radio'), function (index: number, item: JQuery) {
                    var bFound: boolean = false;
                    $.each(flags, function (index2: number, flag: number) {
                        if (parseInt($(item).attr('data-target')) == flag) {
                            bFound = true;
                        }
                    });
                    if (bFound) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                    } else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                    }
                    if (parseInt($(item).attr('data-target')) == 0) {
                        $(this).attr('disabled', 'disabled');
                        $(item).addClass('disabled');
                    }
                });
            }, function (response) {
                $.each(self.$('.flag-radio'), function (index: number, item: JQuery) {
                    var bFound: boolean = false;
                    $.each(flags, function (index2: number, flag: number) {
                        if (parseInt($(item).attr('data-target')) == flag) {
                            bFound = true;
                        }
                    });
                    if (bFound) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                        $(item).removeClass('hidden');
                    } else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                        $(item).addClass('hidden');
                    }
                    if (parseInt($(item).attr('data-target')) == 0) {
                        $(this).attr('disabled', 'disabled');
                        $(item).addClass('disabled');
                    }
                    $(item).css({ 'pointer-events': 'none' });
                });
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        protected renderOwnershipInfo(ownership: Ownership): void {
            var self: TreeGraphicView = this;
            Controller.checkIsAdmin(function (response) {
                $.each(self.$('.ownership-radio'), function (index: number, item: JQuery) {
                    if (ownership != undefined) {
                        if (parseInt($(item).attr('data-target')) == ownership.getId()) {
                            $(item).addClass('active');
                            $(item).find('input').prop({ 'checked': 'checked' });
                        } else {
                            $(item).removeClass('active');
                            $(item).find('input').prop({ 'checked': '' });
                        }
                        if (parseInt($(item).attr('data-target')) == 0) {
                            $(this).attr('disabled', 'disabled');
                            $(item).addClass('disabled');
                        }
                    }
                });
            }, function (response) {
                $.each(self.$('.ownership-radio'), function (index: number, item: JQuery) {
                    if (ownership != undefined) {
                        if (parseInt($(item).attr('data-target')) == ownership.getId()) {
                            $(item).addClass('active');
                            $(item).find('input').prop({ 'checked': 'checked' });
                        } else {
                            $(item).removeClass('active');
                            $(item).find('input').prop({ 'checked': '' });
                            $(item).addClass('hidden');
                        }
                        if (parseInt($(item).attr('data-target')) == 0) {
                            $(this).attr('disabled', 'disabled');
                            $(item).addClass('disabled');
                        }
                        $(item).css({ 'pointer-events': 'none' });
                    }
                });
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        protected renderRecentComments(tree: Tree): void {
            var self: TreeGraphicView = this;
            var trees: Array<Tree> = new Array<Tree>();
            trees.push(tree);
            Controller.fetchNotesOfTrees(trees, NoteType.IMAGE, Setting.getLargeNumRecentActivitiesShown(), 0, function () {
                var notes: Notes = new Notes(Model.getNotes().where({ tree: tree.getId(), type: NoteType.IMAGE }));
                notes.sortByDescendingDate();
                var template = _.template(Template.getRecentCommentsTemplate());
                var data = {
                    notes: notes,
                    size: Setting.getNumRecentActivitiesShown(),
                }
                self.$('#list-comments').html(template(data));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        protected renderRecentActivities(tree: Tree): void {
            var self: TreeGraphicView = this;
            var trees: Array<Tree> = new Array<Tree>();
            trees.push(tree);
            Controller.fetchNotesOfTrees(trees, NoteType.INFO, Setting.getLargeNumRecentActivitiesShown(), 0, function () {
                var notes: Notes = new Notes(Model.getNotes().where({ tree: tree.getId(), type: NoteType.INFO }));
                notes.sortByDescendingDate();
                var template = _.template(Template.getRecentActivitiesTemplate());
                var data = {
                    notes: notes,
                    size: Setting.getLargeNumRecentActivitiesShown(),
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                }
                self.$('#list-activities').html(template(data));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
        private _showPostFromChart(event: Event): void {
            var self: TreeGraphicView = this;
            if (self._note) {
                EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note.getId(), tree: self._tree });
            }
        }
        private _showPostFromList(event: Event): void {
            var self: TreeGraphicView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, { note: parseInt($(event.currentTarget).attr('data-target')), tree: self._tree });
        }

        protected updateTreeAddress(tree: Tree, address: string) {
            var self: TreeGraphicView = this;
            if (address.trim() == '') {
                FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
                    if ((data.road + ", " + data.county + ", " + data.state + ", " + data.postcode) != tree.getAddress()) {
                        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: data.road + ", " + data.county + ", " + data.state + ", " + data.postcode }, function () {
                            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                            self.renderTreeInfo(tree);
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        self.renderTreeInfo(tree);
                    }
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else if (tree.getAddress().trim() != address.trim()) {
                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: address.trim() }, function () {
                    var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                    self.renderTreeInfo(tree);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else {
                self.renderTreeInfo(tree);
            }
        }

        protected updateTreeDescription(tree: Tree, description: string) {
            var self: TreeGraphicView = this;
            if (tree.getDescription().trim() != description.trim()) {
                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                    self.renderTreeInfo(tree);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else {
                self.renderTreeInfo(tree);
            }
        }

        protected updateTreeFoodType(tree: Tree, selected: number) {
            var self: TreeGraphicView = this;
            if (tree.getFoodId() != selected) {
                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                    self.renderTreeInfo(tree);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                self.renderTreeInfo(tree);
            } else {
                self.renderTreeInfo(tree);
            }
        }

        protected updateTreeLocation(tree: Tree, location: L.LatLng) {
            var self: TreeGraphicView = this;
            if (location.lat != self._tree.getLocation().lat || location.lng != self._tree.getLocation().lng) {
                EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_LOCATION, { marker: null, location: location }, function () {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                    self.renderTreeInfo(tree);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else {
                self.renderTreeInfo(tree);
            }
        }

        protected _updateFlag(event: Event) {
            var self: TreeGraphicView = this;
            var flag: number = parseInt($(event.target).attr('data-target'));
            setTimeout(function () {
                if ($(event.target).find('input[type="checkbox"]').prop('checked')) {   // checked
                    EventHandler.handleTreeData(self._tree, DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: true }, function () {
                        var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                        //self.renderFlagInfo(self._tree.getFlags());
                        self.renderTreeInfo(self._tree);
                        EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> was changed successfully.", true);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else {    // unchecked
                    EventHandler.handleTreeData(self._tree, DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: false }, function () {
                        var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                        //self.renderFlagInfo(self._tree.getFlags());
                        self.renderTreeInfo(self._tree);
                        EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> was changed successfully.", true);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            }, 1);
        }

        protected _updateOwnership(event: Event): void {
            var self: TreeGraphicView = this;
            var ownership: number = parseInt($(event.target).attr('data-target'));
            if (self._tree.getOwnershipId() != ownership) {
                EventHandler.handleTreeData(self._tree, DATA_MODE.UPDATE_OWNERSHIP, { ownership: ownership }, function () {
                    var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                    //var ownership: Ownership = Model.getOwnerships().findWhere({ id: self._tree.getOwnershipId() });
                    //self.renderOwnershipInfo(ownership);
                    self.renderTreeInfo(self._tree);
                    EventHandler.handleDataChange("Ownership of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> was changed successfully.", true);
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        }
        private _mouseClick(event: Event): void {
            var self: TreeGraphicView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree.getId() });
        }
    }
}
