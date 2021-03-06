﻿module FoodParent {
    export class DetailTreeViewFractory {
        private static _instance: DetailTreeViewFractory = new DetailTreeViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (DetailTreeViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use DetailTreeViewFractory.getInstance() instead of new.");
            }
            DetailTreeViewFractory._instance = this;
        }
        public static getInstance(): DetailTreeViewFractory {
            return DetailTreeViewFractory._instance;
        }
        public static create(el: JQuery, id: number): DetailTreeView {
            var view: DetailTreeView;
            view = new DetailTreeGraphicView({ el: el });
            view.setTreeId(id);
            return view;
        }
    }

    export class DetailTreeView extends BaseView {
        protected _id: number;
        protected _bAuthor: boolean = false;
        public setTreeId(id: number) {
            this._id = Math.floor(id);
        }
        public renderMenu = () => {

        }
    }

    export class DetailTreeGraphicView extends DetailTreeView {
        private static TAG: string = "DetailTreeGraphicView - ";
        private _tree: Tree;
        private _note: Note;
        private _startDate: string;
        private _endDate: string;
        private _chart: any;
        private _timer: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: DetailTreeGraphicView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .switch-map": "_mouseClick",
                "click .flag-radio": "_applyFlag",
                "click .ownership-radio": "_applyOwnership",
                "dblclick .content-chart": "_mouseClick",
                "click .button-delete-tree": "_deleteTree",
                "click .button-back-map": "_mouseClick",
                "click .button-manage-adoption": "_mouseClick",
                "click .button-new-note": "_mouseClick",
                "click .date-preset": "_datePreset",
                "click .button-tree-adopt": "_adoptTree",
                "click .button-tree-unadopt": "_adoptTree",
            };
            self.delegateEvents();
        }

        public resetNote(): void {
            var self: DetailTreeGraphicView = this;
            self._note = null;
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: DetailTreeGraphicView = this;
            if (self.bDebug) console.log(DetailTreeGraphicView.TAG + "render()");
            
            var template = _.template(Template.getDetailTreeGraphicViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtree'));
            self.resize();
            //self.renderTrees();

            self.renderMenu();

            Controller.fetchAllTrees(function () {
                self._tree = Model.getTrees().findWhere({ id: self._id });
                // add grid instance for existing data
                self.renderTreeInfo(self._tree);

                // render datepicker
                //var notes: Notes = new Notes(Model.getNotes().where({ tree: self._tree.getId() }));
                //notes.sortByAscendingDate();
                //if (notes.models.length > 0) {
                //    self.$('.tree-graph-start').attr({ 'data-value': notes.models[0].getFormattedDate() });
                //    self._startDate = moment(notes.models[0].getFormattedDate()).format(Setting.getDateTimeFormat());
                //} else {
                self.$('.tree-graph-start').attr({ 'data-value': moment(new Date()).subtract(1, 'month').format(Setting.getDateFormat()) });
                self._startDate = moment(moment(new Date()).subtract(3, 'month').format(Setting.getDateFormat())).format(Setting.getDateTimeFormat());
                //}

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

                self.renderTreeChart(self._tree, self._startDate, self._endDate);

            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        }

        public renderMenu = () => {
            var self: DetailTreeGraphicView = this;
            Controller.checkLogin(function (response1) {
                if (response1.result == true || response1.result == 'true') {   // Already logged in
                    Controller.checkAdmin(function (response2) {
                        if (response2.result == true || response2.result == 'true') {   // admin
                            var template = _.template(Template.getDetailMenuTemplate());
                            self.$('#wrapper-mapmenu').html(template({}));
                        } else if (response2.result == false || response2.result == 'false') {   // Not admin
                            var adopt: Adopt = Model.getAdopts().findWhere({ tree: self._tree.getId(), parent: parseInt(response1.id) });
                            if (adopt) {
                                var template = _.template(Template.getDetailMenuTemplate3());
                                self.$('#wrapper-mapmenu').html(template({}));
                            } else {
                                var template = _.template(Template.getDetailMenuTemplate2());
                                self.$('#wrapper-mapmenu').html(template({}));
                            }
                        }
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else {   // Not logged in
                    var template = _.template(Template.getDetailMenuTemplate2());
                    self.$('#wrapper-mapmenu').html(template({}));
                }
            }, function (response1) {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public resize(): any {
            var self: DetailTreeGraphicView = this;
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mtree').css({ height: View.getHeight() - 60 });
            self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        }

        public renderTreeChart = (tree: Tree, startDate: string, endDate: string) => {
            var self: DetailTreeGraphicView = this;

            Controller.fetchImageNotesOfTreesDuringPeriod([self._tree], startDate, endDate, 10000, 0, function () {

                self.$('#wrapper-chart').html('<canvas id="content-chart" class="content-chart" />');
                var canvas: any = self.$('#content-chart')[0];
                self.$('#content-chart').attr({ 'width': self.$('#content-chart').innerWidth(), 'height': self.$('#content-chart').innerHeight() });
                var ctx = canvas.getContext("2d");

                self.$('#wrapper-graph').on('mousemove', function(event) {
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
                console.log("Graph Points Length: " + notes.length);
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
                        scaleStepWidth: 10,
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
                                return;
                            }
                            self._note = Model.getNotes().findWhere({ id: tooltip.id });
                            console.log(self._note);
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

        public refreshTreeInfo() {
            var self: DetailTreeGraphicView = this;
            if (self.bDebug) console.log(DetailTreeGraphicView.TAG + "refreshTreeInfo()");
            self.renderTreeInfo(self._tree);
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        }

        public renderTreeInfo = (tree: Tree) => {
            var self: DetailTreeGraphicView = this;
            self._bAuthor = false;
            Controller.checkAdmin(function (response2) {
                if (response2.result == true || response2.result == 'true') {   // admin
                    self._bAuthor = true;
                }
                Controller.fetchAllFlagsAndOwners(function () {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var ownership: Ownership = Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });

                    var template = _.template(Template.getTreeInfoTemplate2());
                    var data = {
                        foodname: food.getName(),
                        treename: tree.getName(),
                        lat: tree.getLat().toFixed(4),
                        lng: tree.getLng().toFixed(4),
                        flags: Model.getFlags(),
                        ownerships: Model.getOwnerships(),
                        description: tree.getDescription(),
                        persons: tree.getParents(),
                    }
                    self.$('.content-tree-info').html(template(data));

                    
                    self.$('.input-address').replaceWith('<div class="input-address"></div>');
                    if (tree.getAddress().trim() == '') {
                        GeoLocation.reverseGeocoding(tree.getLocation(), function (data: ReverseGeoLocation) {
                            self.$(".input-address").html("<i class='fa fa-map-marker'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        self.$(".input-address").html("<i class='fa fa-map-marker'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + tree.getAddress());
                    }
                    if (self._bAuthor) {
                        self.$('.input-address').on('click', function (event) {
                            $(this).replaceWith("<input type='text' class='input-address form-control' value='" + htmlEncode($(this).text()).trim() + "' />");
                            self.$('.input-address').focus();
                            self.$('.input-address').on('focusout', function (event) {
                                var address: string = self.$('.input-address').val();
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
                            });
                        });
                    }
                    
                    self.renderFlagInfo(tree.getFlags());
                    self.renderOwnershipInfo(ownership);
                    self.renderRecentActivities(tree);
                    self.renderRecentComments(tree);

                    if (self._bAuthor) {
                        self.$('.input-description').on('click', function (event) {
                            $(this).replaceWith("<input type='text' class='input-description form-control' value='" + htmlEncode($(this).text()).trim() + "' />");
                            self.$('.input-description').focus();
                            self.$('.input-description').on('focusout', function (event) {
                                var description: string = self.$('.input-description').val();
                                if (tree.getDescription().trim() != description.trim()) {
                                    EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                                        var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                        self.renderRecentActivities(tree);
                                        EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                        self.renderTreeInfo(tree);
                                    }, function () {
                                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                    });
                                } else {
                                    self.renderTreeInfo(tree);
                                }
                            });
                        });

                        self.$('.input-food').on('click', function (event) {
                            var template = _.template(Template.FoodSelectTemplate());
                            var data = {
                                foods: Model.getFoods(),
                            }
                            $(this).replaceWith(template(data));

                            self.$('.input-food').selectpicker();
                            self.$('.input-food').selectpicker("val", food.getId());
                            self.$('.input-food').on('hide.bs.dropdown', function (event) {
                                var selected: number = parseInt($(this).find("option:selected").val());
                                if (tree.getFoodId() != selected) {
                                    EventHandler.handleTreeData(tree, DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                                        var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                                        EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                        self.renderTreeInfo(tree);
                                    }, function () {
                                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                    });
                                    self.renderTreeInfo(tree);
                                } else {
                                    self.renderTreeInfo(tree);
                                }
                            });
                        });

                        self.$('.input-lat').on('click', function (event) {
                            $(this).replaceWith("<input class='input-lat form-control' value='" + $(this).html() + "' />");
                            //self.$('.input-lat').css({ width: width });
                            self.$('.input-lat').focus();
                            self.$('.input-lat').on('focusout', function (event) {
                                var location: L.LatLng = new L.LatLng(parseFloat(self.$('.input-lat').val()), self._tree.getLng());
                                if (location.lat != self._tree.getLat()) {
                                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                                        var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                        FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                        self.renderTreeInfo(tree);
                                    }, function () {
                                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                    });
                                } else {
                                    self.renderTreeInfo(tree);
                                }
                            });
                        });
                        self.$('.input-lng').on('click', function (event) {
                            var width: number = self.$('.input-lng').outerWidth() + 8;
                            $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                            //self.$('.input-lng').css({ width: width });
                            self.$('.input-lng').focus();
                            self.$('.input-lng').on('focusout', function (event) {
                                var location: L.LatLng = new L.LatLng(self._tree.getLat(), parseFloat(self.$('.input-lng').val()));
                                if (location.lng != self._tree.getLng()) {
                                    FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                                        var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                        FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                        self.renderTreeInfo(tree);
                                    }, function () {
                                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                    });
                                } else {
                                    self.renderTreeInfo(tree);
                                }

                            });
                        });
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private renderOwnershipInfo(flag: Flag): void {
            var self: DetailTreeGraphicView = this;
            $.each(self.$('.ownership-radio'), function (index: number, item: JQuery) {
                if (parseInt($(item).attr('data-target')) == flag.getId()) {
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
                if (!self._bAuthor) {
                    $(item).css({ 'pointer-events': 'none' });
                }
            });
        }

        private renderFlagInfo(flags: Array<number>): void {
            var self: DetailTreeGraphicView = this;
            if (self._bAuthor) {
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
            } else {
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
                    $(item).css({ 'pointer-events': 'none' });
                });
            }
            
        }

        private renderRecentActivities(tree: Tree): void {
            var self: DetailTreeGraphicView = this;
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

        private renderRecentComments(tree: Tree): void {
            var self: DetailTreeGraphicView = this;
            var trees: Array<Tree> = new Array<Tree>();
            trees.push(tree);
            Controller.fetchNotesOfTrees(trees, NoteType.IMAGE, Setting.getLargeNumRecentActivitiesShown(), 0, function () {
                var notes: Notes = new Notes(Model.getNotes().where({ tree: tree.getId(), type: NoteType.IMAGE }));
                notes.sortByDescendingDate();
                var template = _.template(Template.getRecentCommentsTemplate());
                var data = {
                    notes: notes,
                    size: Setting.getLargeNumRecentActivitiesShown(),
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: Model.getFlags(),
                    ownerships: Model.getOwnerships(),
                }
                self.$('#list-comments').html(template(data));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private _applyFlag(event: Event): void {
            var self: DetailTreeGraphicView = this;
            if (self._bAuthor) {
                var flag: number = parseInt($(event.target).attr('data-target'));
                console.log($(event.target).find('input[type="checkbox"]').prop('checked'));
                setTimeout(function () {
                    if ($(event.target).find('input[type="checkbox"]').prop('checked')) {   // checked
                        EventHandler.handleTreeData(self._tree, DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: true }, function () {
                            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                            self.renderFlagInfo(self._tree.getFlags());
                            self.renderRecentActivities(self._tree);
                            EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has changed successfully.", true);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {    // unchecked
                        EventHandler.handleTreeData(self._tree, DATA_MODE.UPDATE_FLAG, { flag: flag, addmode: false }, function () {
                            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                            self.renderFlagInfo(self._tree.getFlags());
                            self.renderRecentActivities(self._tree);
                            EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has changed successfully.", true);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                }, 1);
            }
        }

        private _applyOwnership(event: Event): void {
            var self: DetailTreeGraphicView = this;
            if (self._bAuthor) {
                var ownership: number = parseInt($(event.target).attr('data-target'));
                if (self._tree.getOwnershipId() != ownership) {
                    EventHandler.handleTreeData(self._tree, DATA_MODE.UPDATE_OWNERSHIP, { ownership: ownership }, function () {
                        var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                        var ownership: Ownership = Model.getOwnerships().findWhere({ id: self._tree.getOwnershipId() });
                        self.renderOwnershipInfo(ownership);
                        self.renderRecentActivities(self._tree);
                        EventHandler.handleDataChange("Ownership of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has changed successfully.", true);
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            }
        }

        private _mouseClick(event: Event): void {
            var self: DetailTreeGraphicView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note, tree: self._tree });
        }

        private _datePreset(event: Event): void {
            var self: DetailTreeGraphicView = this;
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
            //self.$('.tree-graph-start').attr({ 'data-value': moment(self._startDate).format(Setting.getDateFormat()) });
            self.$('.tree-graph-start').pickadate('picker').set('select', moment(self._startDate).format(Setting.getDateFormat()), { format: 'dd mmm yyyy' })
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        }

        public _deleteTree() {
            var self: DetailTreeGraphicView = this;
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var name: string = food.getName() + " " + self._tree.getName();
            EventHandler.handleTreeData(self._tree, DATA_MODE.DELETE, {}, function () {
                Backbone.history.history.back();
                EventHandler.handleDataChange("<strong><i>" + name + "</i></strong> has deleted successfully.", false);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public _adoptTree(event: Event) {
            var self: DetailTreeGraphicView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, { tree: self._tree });
        }
    }
}