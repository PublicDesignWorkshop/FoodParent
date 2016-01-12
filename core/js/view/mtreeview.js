var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var DetailTreeViewFractory = (function () {
        function DetailTreeViewFractory(args) {
            if (DetailTreeViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use DetailTreeViewFractory.getInstance() instead of new.");
            }
            DetailTreeViewFractory._instance = this;
        }
        DetailTreeViewFractory.getInstance = function () {
            return DetailTreeViewFractory._instance;
        };
        DetailTreeViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.GRAPHIC) {
                view = new DetailTreeGraphicView({ el: el });
                view.setTreeId(id);
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                view.setTreeId(id);
            }
            return view;
        };
        DetailTreeViewFractory._instance = new DetailTreeViewFractory();
        return DetailTreeViewFractory;
    })();
    FoodParent.DetailTreeViewFractory = DetailTreeViewFractory;
    var DetailTreeView = (function (_super) {
        __extends(DetailTreeView, _super);
        function DetailTreeView() {
            _super.apply(this, arguments);
        }
        DetailTreeView.prototype.setTreeId = function (id) {
            this._id = Math.floor(id);
        };
        return DetailTreeView;
    })(FoodParent.BaseView);
    FoodParent.DetailTreeView = DetailTreeView;
    var DetailTreeGraphicView = (function (_super) {
        __extends(DetailTreeGraphicView, _super);
        function DetailTreeGraphicView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderTreeChart = function (tree, startDate, endDate) {
                var self = _this;
                FoodParent.Controller.fetchImageNotesOfTreesDuringPeriod([self._tree], startDate, endDate, 250, 0, function () {
                    self.$('#wrapper-chart').html('<canvas id="content-chart" class="content-chart" />');
                    var canvas = self.$('#content-chart')[0];
                    self.$('#content-chart').attr({ 'width': self.$('#content-chart').innerWidth(), 'height': self.$('#content-chart').innerHeight() });
                    var ctx = canvas.getContext("2d");
                    self.$('#wrapper-graph').on('mousemove', function (event) {
                        if (event.clientX - 24 - $('#wrapper-tooltip').outerWidth() < 0) {
                            self.$('#wrapper-tooltip').css({ top: event.clientY - 60, left: event.clientX + 24 });
                        }
                        else {
                            self.$('#wrapper-tooltip').css({ top: event.clientY - 60, left: event.clientX - 24 - self.$('#wrapper-tooltip').outerWidth() });
                        }
                    });
                    self.$('#wrapper-graph').on('mouseleave', function (event) {
                        self.$('#wrapper-tooltip').addClass('hidden');
                    });
                    var labels = new Array();
                    var notes = new Array();
                    var start = moment(startDate).set('hour', 13).set('minute', 0).set('seconds', 0).set('milliseconds', 0);
                    for (var i = moment(start).valueOf(); i < moment(endDate).add('day', 1).valueOf(); i += 1000 * 60 * 60 * 24) {
                        labels.push(moment(i).format(FoodParent.Setting.getDateHourFormat()));
                        var note = FoodParent.Model.getNotes().getLatestImageNoteOfDate(self._tree.getId(), i, FoodParent.NoteType.IMAGE);
                        if (note) {
                            notes.push(note);
                        }
                        else {
                            notes.push(new FoodParent.Note({ type: FoodParent.NoteType.IMAGE, tree: self._tree.getId(), person: 0, comment: "", picture: "", rate: 0, cover: 0, date: moment(i).format(FoodParent.Setting.getDateTimeFormat()) }));
                        }
                    }
                    console.log("Graph Points Length: " + notes.length);
                    var labelSkip = Math.floor(labels.length / (self.$('#content-chart').innerWidth() / 150));
                    if (self._chart) {
                        self._chart.destroy();
                    }
                    self._chart = new Chart(ctx).Line({
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
                            self._note = FoodParent.Model.getNotes().findWhere({ id: tooltip.id });
                            if (self._note) {
                                var template = _.template(FoodParent.Template.getToolTipTemplate());
                                var data = {
                                    image: FoodParent.Setting.getBlankImagePath(),
                                    value: self._note.getRate().toFixed(2) + " / " + FoodParent.Setting.getMaxRating().toFixed(2),
                                    comment: htmlDecode(self._note.getComment()),
                                    date: tooltip.label,
                                };
                                self.$('#wrapper-tooltip').html(template(data));
                                if (self._note.getPictures().length > 0) {
                                    self.$('#wrapper-tooltip img').attr('src', FoodParent.Setting.getContentPictureDir() + self._note.getPictures()[0]).load(function () {
                                        $(this).removeClass('hidden');
                                    }).error(function () {
                                        $(this).attr('src', FoodParent.Setting.getBlankImagePath());
                                        $(this).addClass('hidden');
                                    });
                                }
                                else {
                                    self.$('#wrapper-tooltip img').addClass('hidden');
                                }
                            }
                            else {
                                self.$('#wrapper-tooltip img').addClass('hidden');
                            }
                            self.$('#wrapper-tooltip').removeClass('hidden');
                        },
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderTreeInfo = function (tree) {
                var self = _this;
                FoodParent.Controller.fetchAllFlagsAndOwners(function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var flag = FoodParent.Model.getFlags().findWhere({ id: tree.getFlagId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getTreeInfoTemplate2());
                    var data = {
                        foodname: food.getName(),
                        treename: tree.getName(),
                        lat: tree.getLat().toFixed(4),
                        lng: tree.getLng().toFixed(4),
                        flags: FoodParent.Model.getFlags(),
                        ownerships: FoodParent.Model.getOwnerships(),
                        description: tree.getDescription(),
                        persons: tree.getParents(),
                    };
                    self.$('.content-tree-info').html(template(data));
                    FoodParent.GeoLocation.reverseGeocoding(tree.getLocation(), function (data) {
                        self.$(".tree-info-address").html("<div>&nbsp;<i class='fa fa-map-marker'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode + "</div>");
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    self.renderFlagInfo(flag);
                    self.renderOwnershipInfo(ownership);
                    self.renderRecentActivities(tree);
                    self.$('.input-description').on('click', function (event) {
                        $(this).replaceWith("<input type='text' class='input-description form-control' value='" + htmlEncode($(this).text()) + "' />");
                        self.$('.input-description').focus();
                        self.$('.input-description').on('focusout', function (event) {
                            var description = self.$('.input-description').val();
                            if (tree.getDescription().trim() != description.trim()) {
                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    self.renderRecentActivities(tree);
                                    FoodParent.EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                            else {
                                self.renderTreeInfo(tree);
                            }
                        });
                    });
                    self.$('.input-food').on('click', function (event) {
                        var template = _.template(FoodParent.Template.FoodSelectTemplate());
                        var data = {
                            foods: FoodParent.Model.getFoods(),
                        };
                        $(this).replaceWith(template(data));
                        self.$('.input-food').selectpicker();
                        self.$('.input-food').selectpicker("val", food.getId());
                        self.$('.input-food').on('hide.bs.dropdown', function (event) {
                            var selected = parseInt($(this).find("option:selected").val());
                            if (tree.getFoodId() != selected) {
                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    var flag = FoodParent.Model.getFlags().findWhere({ id: tree.getFlagId() });
                                    FoodParent.EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                                self.renderTreeInfo(tree);
                            }
                            else {
                                self.renderTreeInfo(tree);
                            }
                        });
                    });
                    self.$('.input-lat').on('click', function (event) {
                        $(this).replaceWith("<input class='input-lat form-control' value='" + $(this).html() + "' />");
                        //self.$('.input-lat').css({ width: width });
                        self.$('.input-lat').focus();
                        self.$('.input-lat').on('focusout', function (event) {
                            var location = new L.LatLng(parseFloat(self.$('.input-lat').val()), self._tree.getLng());
                            if (location.lat != self._tree.getLat()) {
                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                            else {
                                self.renderTreeInfo(tree);
                            }
                        });
                    });
                    self.$('.input-lng').on('click', function (event) {
                        var width = self.$('.input-lng').outerWidth() + 8;
                        $(this).replaceWith("<input class='input-lng form-control' value='" + $(this).html() + "' />");
                        //self.$('.input-lng').css({ width: width });
                        self.$('.input-lng').focus();
                        self.$('.input-lng').on('focusout', function (event) {
                            var location = new L.LatLng(self._tree.getLat(), parseFloat(self.$('.input-lng').val()));
                            if (location.lng != self._tree.getLng()) {
                                FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                    FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                                    self.renderTreeInfo(tree);
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                });
                            }
                            else {
                                self.renderTreeInfo(tree);
                            }
                        });
                    });
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .switch-map": "_mouseClick",
                "click .flag-radio": "_applyFlag",
                "click .ownership-radio": "_applyOwnership",
                "dblclick .content-chart": "_mouseClick",
                "click .button-delete-tree": "_deleteTree",
                "click .button-manage-adoption": "_mouseClick",
                "click .button-new-note": "_mouseClick",
                "click .date-preset": "_datePreset",
            };
            self.delegateEvents();
        }
        DetailTreeGraphicView.prototype.resetNote = function () {
            var self = this;
            self._note = null;
        };
        DetailTreeGraphicView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(DetailTreeGraphicView.TAG + "render()");
            var template = _.template(FoodParent.Template.getDetailTreeGraphicViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mtree'));
            self.resize();
            //self.renderTrees();
            FoodParent.Controller.fetchAllTrees(function () {
                self._tree = FoodParent.Model.getTrees().findWhere({ id: self._id });
                // add grid instance for existing data
                self.renderTreeInfo(self._tree);
                // render datepicker
                var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: self._tree.getId() }));
                notes.sortByAscendingDate();
                //if (notes.models.length > 0) {
                //    self.$('.tree-graph-start').attr({ 'data-value': notes.models[0].getFormattedDate() });
                //    self._startDate = moment(notes.models[0].getFormattedDate()).format(Setting.getDateTimeFormat());
                //} else {
                self.$('.tree-graph-start').attr({ 'data-value': moment(new Date()).subtract(1, 'month').format(FoodParent.Setting.getDateFormat()) });
                self._startDate = moment(moment(new Date()).subtract(3, 'month').format(FoodParent.Setting.getDateFormat())).format(FoodParent.Setting.getDateTimeFormat());
                //}
                self.$('.tree-graph-start').pickadate({
                    format: "dd mmm yyyy",
                    today: '',
                    max: new Date(moment(new Date()).subtract('day', 2).valueOf()),
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._startDate = moment(this.get()).startOf('day').format(FoodParent.Setting.getDateTimeFormat());
                        self.renderTreeChart(self._tree, self._startDate, self._endDate);
                    }
                });
                var today = new Date();
                self._endDate = moment(today).endOf('day').format(FoodParent.Setting.getDateTimeFormat());
                self.$('.tree-graph-end').attr({ 'data-value': moment(new Date()).format(FoodParent.Setting.getDateFormat()) });
                self.$('.tree-graph-end').pickadate({
                    format: "dd mmm yyyy",
                    today: 'Today',
                    max: today,
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._endDate = moment(this.get()).endOf('day').format(FoodParent.Setting.getDateTimeFormat());
                        self.renderTreeChart(self._tree, self._startDate, self._endDate);
                    }
                });
                self.renderTreeChart(self._tree, self._startDate, self._endDate);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        };
        DetailTreeGraphicView.prototype.resize = function () {
            var self = this;
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mtree').css({ height: FoodParent.View.getHeight() - 60 });
            self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        };
        DetailTreeGraphicView.prototype.refreshTreeInfo = function () {
            var self = this;
            self.renderTreeInfo(self._tree);
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        };
        DetailTreeGraphicView.prototype.renderOwnershipInfo = function (flag) {
            var self = this;
            $.each(self.$('.ownership-radio'), function (index, item) {
                if (parseInt($(item).attr('data-target')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                }
                else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
                if (parseInt($(item).attr('data-target')) == 0) {
                    $(this).attr('disabled', 'disabled');
                    $(item).addClass('disabled');
                }
            });
        };
        DetailTreeGraphicView.prototype.renderFlagInfo = function (flag) {
            var self = this;
            $.each(self.$('.flag-radio'), function (index, item) {
                if (parseInt($(item).attr('data-target')) == flag.getId()) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                }
                else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
                if (parseInt($(item).attr('data-target')) == 0) {
                    $(this).attr('disabled', 'disabled');
                    $(item).addClass('disabled');
                }
            });
        };
        DetailTreeGraphicView.prototype.renderRecentActivities = function (tree) {
            var self = this;
            var trees = new Array();
            trees.push(tree);
            FoodParent.Controller.fetchNotesOfTrees(trees, FoodParent.Setting.getLargeNumRecentActivitiesShown(), 0, function () {
                var notes = new FoodParent.Notes(FoodParent.Model.getNotes().where({ tree: tree.getId() }));
                notes.sortByDescendingDate();
                var template = _.template(FoodParent.Template.getRecentActivitiesTemplate());
                var data = {
                    notes: notes,
                    size: FoodParent.Setting.getLargeNumRecentActivitiesShown(),
                    coordinate: '@ ' + tree.getLat().toFixed(4) + ", " + tree.getLng().toFixed(4),
                    flags: FoodParent.Model.getFlags(),
                    ownerships: FoodParent.Model.getOwnerships(),
                };
                self.$('#list-activities').html(template(data));
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        DetailTreeGraphicView.prototype._applyFlag = function (event) {
            var self = this;
            var flag = parseInt($(event.target).attr('data-target'));
            if (self._tree.getFlagId() != flag) {
                FoodParent.EventHandler.handleTreeData(self._tree, FoodParent.DATA_MODE.UPDATE_FLAG, { flag: flag }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                    var flag = FoodParent.Model.getFlags().findWhere({ id: self._tree.getFlagId() });
                    self.renderFlagInfo(flag);
                    self.renderRecentActivities(self._tree);
                    FoodParent.EventHandler.handleDataChange("Status of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        DetailTreeGraphicView.prototype._applyOwnership = function (event) {
            var self = this;
            var ownership = parseInt($(event.target).attr('data-target'));
            if (self._tree.getOwnershipId() != ownership) {
                FoodParent.EventHandler.handleTreeData(self._tree, FoodParent.DATA_MODE.UPDATE_OWNERSHIP, { ownership: ownership }, function () {
                    var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
                    var ownership = FoodParent.Model.getOwnerships().findWhere({ id: self._tree.getOwnershipId() });
                    self.renderOwnershipInfo(ownership);
                    self.renderRecentActivities(self._tree);
                    FoodParent.EventHandler.handleDataChange("Ownership of <strong><i>" + food.getName() + " " + self._tree.getName() + "</i></strong> has changed successfully.", true);
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        DetailTreeGraphicView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { note: self._note, tree: self._tree });
        };
        DetailTreeGraphicView.prototype._datePreset = function (event) {
            var self = this;
            if ($(event.currentTarget).hasClass('4years')) {
                self._startDate = moment(self._endDate).subtract(4, 'years').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            else if ($(event.currentTarget).hasClass('2years')) {
                self._startDate = moment(self._endDate).subtract(2, 'years').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            else if ($(event.currentTarget).hasClass('1year')) {
                self._startDate = moment(self._endDate).subtract(1, 'years').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            else if ($(event.currentTarget).hasClass('6months')) {
                self._startDate = moment(self._endDate).subtract(6, 'months').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            else if ($(event.currentTarget).hasClass('3month')) {
                self._startDate = moment(self._endDate).subtract(3, 'months').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            //self.$('.tree-graph-start').attr({ 'data-value': moment(self._startDate).format(Setting.getDateFormat()) });
            self.$('.tree-graph-start').pickadate('picker').set('select', moment(self._startDate).format(FoodParent.Setting.getDateFormat()), { format: 'dd mmm yyyy' });
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        };
        DetailTreeGraphicView.prototype._deleteTree = function () {
            var self = this;
            var food = FoodParent.Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var name = food.getName() + " " + self._tree.getName();
            FoodParent.EventHandler.handleTreeData(self._tree, FoodParent.DATA_MODE.DELETE, {}, function () {
                Backbone.history.history.back();
                FoodParent.EventHandler.handleDataChange("<strong><i>" + name + "</i></strong> has deleted successfully.", false);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        DetailTreeGraphicView.TAG = "DetailTreeGraphicView - ";
        return DetailTreeGraphicView;
    })(DetailTreeView);
    FoodParent.DetailTreeGraphicView = DetailTreeGraphicView;
})(FoodParent || (FoodParent = {}));
