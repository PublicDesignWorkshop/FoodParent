var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreeViewFractory = (function () {
        function TreeViewFractory(args) {
            if (TreeViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use TreeViewFractory.getInstance() instead of new.");
            }
            TreeViewFractory._instance = this;
        }
        TreeViewFractory.getInstance = function () {
            return TreeViewFractory._instance;
        };
        TreeViewFractory.create = function (el, id) {
            var view = new TreeGraphicView({ el: el });
            view.setTreeId(id);
            return view;
        };
        TreeViewFractory._instance = new TreeViewFractory();
        return TreeViewFractory;
    })();
    FoodParent.TreeViewFractory = TreeViewFractory;
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView() {
            _super.apply(this, arguments);
            this._bAuthor = false;
        }
        TreeView.prototype.setTreeId = function (id) {
            this._id = Math.floor(id);
        };
        return TreeView;
    })(FoodParent.BaseView);
    FoodParent.TreeView = TreeView;
    var TreeGraphicView = (function (_super) {
        __extends(TreeGraphicView, _super);
        function TreeGraphicView(options) {
            var _this = this;
            _super.call(this, options);
            /**
                Render date picker in a chart view
            */
            this.renderChartDatePicker = function () {
                var self = _this;
                self._tree = FoodParent.Model.getTrees().findWhere({ id: self._id });
                self.$('.tree-graph-start').attr({ 'data-value': moment(new Date()).subtract(3, 'month').format(FoodParent.Setting.getDateFormat()) });
                self._startDate = moment(moment(new Date()).subtract(3, 'month').format(FoodParent.Setting.getDateFormat())).format(FoodParent.Setting.getDateTimeFormat());
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
                // Render tree chart
                self.renderTreeChart(self._tree, self._startDate, self._endDate);
            };
            /**
                Render tree chart using start and end dates
            */
            this.renderTreeChart = function (tree, startDate, endDate) {
                var self = _this;
                if (self.bDebug)
                    console.log(TreeGraphicView.TAG + "renderTreeChart()");
                FoodParent.Controller.fetchCommentsOfTreesDuringPeriod([self._tree], startDate, endDate, 10000, 0, function () {
                    // Create a canvas for chart
                    self.$('#wrapper-chart').html('<canvas id="content-chart" class="content-chart" />');
                    var canvas = self.$('#content-chart')[0];
                    self.$('#content-chart').attr({ 'width': self.$('#content-chart').innerWidth(), 'height': self.$('#content-chart').innerHeight() });
                    var ctx = canvas.getContext("2d");
                    // Tooltip event listener
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
                    if (self.bDebug)
                        console.log(TreeGraphicView.TAG + "Graph Points Length: " + notes.length);
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
                self._bAuthor = false;
            };
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }
        TreeGraphicView.prototype.resetNote = function () {
            var self = this;
            self._note = null;
        };
        TreeGraphicView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(TreeGraphicView.TAG + "render()");
            var template = _.template(FoodParent.Template.getTreeGraphicViewTemplate());
            self.$el.html(template({}));
            self.setElement(self.$('#wrapper-tree'));
            self.resize();
            FoodParent.Controller.fetchAllTrees(function () {
                self.renderChartDatePicker();
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        TreeGraphicView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
        };
        TreeGraphicView.prototype.resize = function () {
            var self = this;
        };
        TreeGraphicView.prototype._applyDatePreset = function (event) {
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
            else if ($(event.currentTarget).hasClass('3months')) {
                self._startDate = moment(self._endDate).subtract(3, 'months').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            else if ($(event.currentTarget).hasClass('1month')) {
                self._startDate = moment(self._endDate).subtract(1, 'months').startOf('day').format(FoodParent.Setting.getDateTimeFormat());
            }
            self.$('.tree-graph-start').pickadate('picker').set('select', moment(self._startDate).format(FoodParent.Setting.getDateFormat()), { format: 'dd mmm yyyy' });
            self.renderTreeChart(self._tree, self._startDate, self._endDate);
        };
        TreeGraphicView.TAG = "TreeGraphicView - ";
        return TreeGraphicView;
    })(TreeView);
    FoodParent.TreeGraphicView = TreeGraphicView;
})(FoodParent || (FoodParent = {}));
