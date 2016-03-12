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
        public static create(el: JQuery, id: number): TreeView {
            var view: TreeView = new TreeGraphicView({ el: el });
            view.setTreeId(id);
            return view;
        }
    }

    export class TreeView extends BaseView {
        protected _id: number;
        protected _bAuthor: boolean = false;
        public setTreeId(id: number) {
            this._id = Math.floor(id);
        }
    }

    export class TreeGraphicView extends TreeView {
        private static TAG: string = "TreeGraphicView - ";
        private _tree: Tree;
        private _note: Note;
        private _startDate: string;
        private _endDate: string;
        private _chart: any;
        private _timer: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreeGraphicView = this;
            self.bDebug = true;
            self.events = <any>{
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }

        public resetNote(): void {
            var self: TreeGraphicView = this;
            self._note = null;
        }
        public render(args?: any): any {
            super.render(args);
            var self: TreeGraphicView = this;
            if (self.bDebug) console.log(TreeGraphicView.TAG + "render()");
            var template = _.template(Template.getTreeGraphicViewTemplate());
            self.$el.html(template({ }));
            self.setElement(self.$('#wrapper-tree'));
            self.resize();

            Controller.fetchAllTrees(function () {
                self.renderChartDatePicker();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
        public update(args?: any): any {
            super.update(args);
            var self: TreeGraphicView = this;
        }
        public resize(): any {
            var self: TreeGraphicView = this;
        }

        /**
            Render date picker in a chart view
        */
        public renderChartDatePicker = () => {
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

        public renderTreeInfo = (tree: Tree) => {
            var self: TreeGraphicView = this;
            self._bAuthor = false;
        }
    }
}