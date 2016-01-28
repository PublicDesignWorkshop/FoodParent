var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var DetailDonationViewFractory = (function () {
        function DetailDonationViewFractory(args) {
            if (DetailDonationViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use DetailDonationViewFractory.getInstance() instead of new.");
            }
            DetailDonationViewFractory._instance = this;
        }
        DetailDonationViewFractory.getInstance = function () {
            return DetailDonationViewFractory._instance;
        };
        DetailDonationViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.GRAPHIC) {
                view = new DetailDonationGraphicView({ el: el });
                view.setPlaceId(id);
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
            }
            return view;
        };
        DetailDonationViewFractory._instance = new DetailDonationViewFractory();
        return DetailDonationViewFractory;
    })();
    FoodParent.DetailDonationViewFractory = DetailDonationViewFractory;
    var DetailDonationView = (function (_super) {
        __extends(DetailDonationView, _super);
        function DetailDonationView() {
            _super.apply(this, arguments);
        }
        DetailDonationView.prototype.setPlaceId = function (id) {
            this._id = Math.floor(id);
        };
        DetailDonationView.prototype.refreshDonationInfo = function () {
        };
        return DetailDonationView;
    })(FoodParent.BaseView);
    FoodParent.DetailDonationView = DetailDonationView;
    var DetailDonationGraphicView = (function (_super) {
        __extends(DetailDonationGraphicView, _super);
        function DetailDonationGraphicView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderPlaceInfo = function (place) {
                var self = _this;
                var template = _.template(FoodParent.Template.getPlaceInfoTemplate2());
                var data = {
                    placename: place.getName(),
                    lat: place.getLat().toFixed(4),
                    lng: place.getLng().toFixed(4),
                    description: place.getDescription(),
                };
                self.$('.content-donation-info').html(template(data));
                FoodParent.GeoLocation.reverseGeocoding(place.getLocation(), function (data) {
                    self.$(".donation-info-address").html("<div>&nbsp;<i class='fa fa-map-marker'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode + "</div>");
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
                self.renderRecentDonations(place);
            };
            this.renderDonationChart = function (place, startDate, endDate) {
                var self = _this;
                FoodParent.Controller.fetchDonationsOfPlacesDuringPeriod([self._place], startDate, endDate, 10000, 0, function () {
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
                    var donations = new Array();
                    var start = moment(startDate).set('hour', 13).set('minute', 0).set('seconds', 0).set('milliseconds', 0);
                    var prevDonation = null;
                    for (var i = moment(start).valueOf(); i < moment(endDate).add('day', 1).valueOf(); i += 1000 * 60 * 60 * 24) {
                        labels.push(moment(i).format(FoodParent.Setting.getDateHourFormat()));
                        var donation = FoodParent.Model.getDonations().getLatestDonationOfDate(self._place.getId(), i);
                        if (donation) {
                            donations.push(donation);
                            prevDonation = donation;
                        }
                        else {
                            donations.push(new FoodParent.Donation({ place: self._place.getId(), tree: '', quantity: 0, date: moment(i).format(FoodParent.Setting.getDateTimeFormat()) }));
                        }
                    }
                    console.log("Graph Points Length: " + donations.length);
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
                                data: donations,
                            },
                        ]
                    }, {
                        scaleOverride: false,
                        scaleSteps: 1,
                        scaleStepWidth: 10,
                        scaleStartValue: 0,
                        pointDotRadius: 3,
                        pointDotStrokeWidth: 2,
                        bezierCurve: false,
                        pointHitDetectionRadius: self.$('#content-chart').innerWidth() / donations.length * 0.5,
                        pointDot: false,
                        labelskip: labelSkip,
                        customTooltips: function (tooltip) {
                            // tooltip will be false if tooltip is not visible or should be hidden
                            if (!tooltip || !tooltip.id) {
                                self.$('#wrapper-tooltip').addClass('hidden');
                                self._donation = null;
                                return;
                            }
                            self._donation = FoodParent.Model.getDonations().findWhere({ id: tooltip.id });
                            if (self._donation) {
                                var template = _.template(FoodParent.Template.getToolTipTemplate2());
                                var data = {
                                    image: FoodParent.Setting.getBlankImagePath(),
                                    value: self._donation.getCumulativeQuantity(),
                                    comment: htmlDecode(self._donation.getComment()),
                                    startdate: FoodParent.Model.getDonations().models[0].getFormattedDate(),
                                    date: self._donation.getFormattedHourTime(),
                                };
                                self.$('#wrapper-tooltip').html(template(data));
                                if (self._donation.getPictures().length > 0) {
                                    self.$('#wrapper-tooltip img').attr('src', FoodParent.Setting.getContentPictureDir() + self._donation.getPictures()[0]).load(function () {
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
                            self.$('#wrapper-tooltip').removeClass('hidden');
                        },
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
                "click .date-preset": "_datePreset",
                "dblclick .content-chart": "_mouseClick",
                "click .button-new-donation": "_mouseClick",
                "click .button-delete-location": "_deleteLocation",
            };
            self.delegateEvents();
        }
        DetailDonationGraphicView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(DetailDonationGraphicView.TAG + "render()");
            var template = _.template(FoodParent.Template.getDetailDonationGraphicViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mdonation'));
            self.resize();
            FoodParent.Controller.fetchAllLocations(function () {
                self._place = FoodParent.Model.getPlaces().findWhere({ id: self._id });
                self.renderPlaceInfo(self._place);
                self.$('.donation-graph-start').attr({ 'data-value': moment(new Date()).subtract(1, 'month').format(FoodParent.Setting.getDateFormat()) });
                self._startDate = moment(moment(new Date()).subtract(3, 'month').format(FoodParent.Setting.getDateFormat())).format(FoodParent.Setting.getDateTimeFormat());
                self.$('.donation-graph-start').pickadate({
                    format: "dd mmm yyyy",
                    today: '',
                    max: new Date(moment(new Date()).subtract('day', 2).valueOf()),
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._startDate = moment(this.get()).startOf('day').format(FoodParent.Setting.getDateTimeFormat());
                        self.renderDonationChart(self._place, self._startDate, self._endDate);
                    }
                });
                var today = new Date();
                self._endDate = moment(today).endOf('day').format(FoodParent.Setting.getDateTimeFormat());
                self.$('.donation-graph-end').attr({ 'data-value': moment(new Date()).format(FoodParent.Setting.getDateFormat()) });
                self.$('.donation-graph-end').pickadate({
                    format: "dd mmm yyyy",
                    today: 'Today',
                    max: today,
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._endDate = moment(this.get()).endOf('day').format(FoodParent.Setting.getDateTimeFormat());
                        self.renderDonationChart(self._place, self._startDate, self._endDate);
                    }
                });
                self.renderDonationChart(self._place, self._startDate, self._endDate);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            return self;
        };
        DetailDonationGraphicView.prototype.resize = function () {
            var self = this;
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mdonation').css({ height: FoodParent.View.getHeight() - 60 });
            self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        };
        DetailDonationGraphicView.prototype.refreshDonationInfo = function () {
            var self = this;
            self.renderPlaceInfo(self._place);
            self.renderDonationChart(self._place, self._startDate, self._endDate);
        };
        DetailDonationGraphicView.prototype.renderRecentDonations = function (place) {
            var self = this;
            var places = new Array();
            places.push(place);
            FoodParent.Controller.fetchDonationsOfPlaces(places, FoodParent.Setting.getLargeNumRecentActivitiesShown(), 0, function () {
                var donations = new FoodParent.Donations(FoodParent.Model.getDonations().where({ place: place.getId() }));
                donations.sortByDescendingDate();
                var template = _.template(FoodParent.Template.getRecentDonationsTemplate());
                var data = {
                    donations: donations,
                    size: FoodParent.Setting.getLargeNumRecentActivitiesShown(),
                };
                self.$('#list-donations').html(template(data));
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        DetailDonationGraphicView.prototype._datePreset = function (event) {
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
            //self.$('.tree-graph-start').attr({ 'data-value': moment(self._startDate).format(Setting.getDateFormat()) });
            self.$('.donation-graph-start').pickadate('picker').set('select', moment(self._startDate).format(FoodParent.Setting.getDateFormat()), { format: 'dd mmm yyyy' });
            self.renderDonationChart(self._place, self._startDate, self._endDate);
        };
        DetailDonationGraphicView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self, { donation: self._donation, place: self._place });
        };
        DetailDonationGraphicView.prototype._deleteLocation = function (event) {
            var self = this;
            FoodParent.EventHandler.handlePlaceData(self._place, FoodParent.DATA_MODE.DELETE, {}, function () {
                Backbone.history.history.back();
                FoodParent.EventHandler.handleDataChange("<strong><i>" + self._place.getName() + "</i></strong> has deleted successfully.", false);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        DetailDonationGraphicView.TAG = "DetailDonationGraphicView - ";
        return DetailDonationGraphicView;
    })(DetailDonationView);
    FoodParent.DetailDonationGraphicView = DetailDonationGraphicView;
    var EditDonationViewFactory = (function () {
        function EditDonationViewFactory(args) {
            if (EditDonationViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use EditDonationViewFactory.getInstance() instead of new.");
            }
            EditDonationViewFactory._instance = this;
        }
        EditDonationViewFactory.getInstance = function () {
            return EditDonationViewFactory._instance;
        };
        EditDonationViewFactory.create = function (el, donation) {
            var view = new EditDonationView({ el: el });
            view.setDonation(donation);
            return view;
        };
        EditDonationViewFactory._instance = new EditDonationViewFactory();
        return EditDonationViewFactory;
    })();
    FoodParent.EditDonationViewFactory = EditDonationViewFactory;
    var EditDonationView = (function (_super) {
        __extends(EditDonationView, _super);
        function EditDonationView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .alert-confirm": "_mouseClick",
                "click .top-right-button": "_mouseClick",
                "click .delete-donation": "_deleteDonation",
                "click .prev-note": "_prevNote",
                "click .next-note": "_nextNote",
                "click .image-group img": "_changeCoverImage",
                "click .delete-note": "_deleteNote",
                "click .cell-tree-detail": "_removeNewDonationTree",
            };
            self.delegateEvents();
        }
        EditDonationView.prototype.setDonation = function (donation) {
            var self = this;
            self._donation = donation;
        };
        EditDonationView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(EditDonationView.TAG + "render()");
            var place = FoodParent.Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            var template = _.template(FoodParent.Template.getEditDonationViewTemplate());
            var data = {
                name: place.getName(),
                image: FoodParent.Setting.getBlankImagePath(),
                //value: self._note.getRate(),
                amount: self._donation.getQuantity(),
                date: self._donation.getFormattedHourTime(),
            };
            $('#wrapper-pop').html(template(data));
            self.setElement($('#wrapper-donation'));
            self.renderDonationInfo();
            self.setVisible();
            self.resize();
            return self;
        };
        EditDonationView.prototype.renderDonationInfo = function () {
            var self = this;
            var today = new Date();
            self.$('.input-date').attr({ 'data-value': self._donation.getFormattedDate() });
            self.$('.input-date').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.UPDATE_DATE, { date: moment(this.get()).startOf('day').format(FoodParent.Setting.getDateTimeFormat()) }, function () {
                        FoodParent.EventHandler.handleDataChange("Date of this <strong><i>Donation</i></strong> has changed successfully.", true);
                        self.renderDonationInfo();
                    }, function () {
                        FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
            self.$('.input-date').pickadate('picker').set('select', self._donation.getFormattedDate(), { format: 'dd mmm yyyy' });
            var template = _.template(FoodParent.Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: FoodParent.Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
            //self.$('.input-comment').html(self._donation.getComment());
            self.renderDonationImages();
            // Event listener for uploading a file.
            self.$('input[type=file]').off('change');
            self.$('input[type=file]').on('change', function (event) {
                self.$('.wrapper-input-upload-picture').addClass('hidden');
                self.$('.wrapper-uploading-picture').removeClass('hidden');
                var files = event.target.files;
                var place = FoodParent.Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
                if (files.length > 0) {
                    FoodParent.Controller.uploadNotePictureFile(files[0], fileNameEncode(place.getName()), function (fileName) {
                        FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.ADD_PICTURE, { filename: fileName }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been added successfully.", true);
                            // Success
                            self.$('input[type=file]').val("");
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                            self.renderDonationImages();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been removed successfully.", true);
                            // Success
                            self.$('input[type=file]').val("");
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                            self.renderDonationImages();
                        });
                        //self._note.addPicture(fileName);
                    }, function () {
                        // Error
                        self.$('.wrapper-uploading-picture').addClass('hidden');
                        self.$('.wrapper-input-upload-picture').removeClass('hidden');
                    });
                }
            });
            var template = _.template(FoodParent.Template.TreeSelectTemplate());
            var data = {
                trees: FoodParent.Model.getTrees(),
            };
            self.$('.add-donation-tree').html(template(data));
            self.$('.input-tree').selectpicker();
            self.$('.input-tree').selectpicker("val", 0);
            self.$('.input-tree').on('hide.bs.dropdown', function (event) {
                var selected = parseInt($(this).find("option:selected").val());
                var tree = FoodParent.Model.getTrees().findWhere({ id: selected });
                if (tree != undefined) {
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    if (self._donation.getTreeIds().length == 0) {
                        FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.ADD_DONATION_TREE, { tree: tree }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been added successfully.", true);
                            self.renderDonationInfo();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been removed successfully.", true);
                            self.renderDonationInfo();
                        });
                    }
                    else {
                        var firstTreeId = Math.floor(self._donation.getTreeIds()[0]);
                        var firstTree = FoodParent.Model.getTrees().findWhere({ id: firstTreeId });
                        var firstFood = FoodParent.Model.getFoods().findWhere({ id: firstTree.getFoodId() });
                        var currentFood = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                        if (firstFood.getId() == currentFood.getId()) {
                            if (self._donation.hasTreeId(tree.getId())) {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "<strong><i>" + firstFood.getName() + " " + tree.getName() + "</i></strong> already exist.", undoable: false }).execute();
                                self.$('.input-tree').selectpicker("val", 0);
                            }
                            else {
                                FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.ADD_DONATION_TREE, { tree: tree }, function () {
                                    FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been added successfully.", true);
                                    self.renderDonationInfo();
                                }, function () {
                                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                                }, function () {
                                    FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been removed successfully.", true);
                                    self.renderDonationInfo();
                                });
                            }
                        }
                        else {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: "Please select <strong>same type</strong> of food.", undoable: false }).execute();
                            self.$('.input-tree').selectpicker("val", 0);
                        }
                    }
                }
            });
            self.$('.input-amount').replaceWith('<div class="input-amount">' + self._donation.getQuantity() + ' lbs.</div>');
            self.$('.input-amount').on('click', function (event) {
                $(this).replaceWith("<input type='text' class='input-amount form-control' value='" + parseFloat(htmlEncode($(this).text())) + "' />");
                //self.$('.input-lat').css({ width: width });
                self.$('.input-amount').focus();
                self.$('.input-amount').on('focusout', function (event) {
                    var amount = parseFloat(self.$('.input-amount').val());
                    if (amount != self._donation.getQuantity()) {
                        FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.UPDATE_DONATION_AMOUNT, { amount: amount }, function () {
                            FoodParent.EventHandler.handleDataChange("<strong><i>Amount of donation</i></strong> has been changed successfully.", true);
                            self.renderDonationInfo();
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else {
                        self.renderDonationInfo();
                    }
                });
            });
        };
        EditDonationView.prototype.renderDonationImages = function () {
            var self = this;
            var tag = '';
            $.each(self._donation.getPictures(), function (index, filename) {
                if (index == 0) {
                    tag += '<img src="' + FoodParent.Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                }
                else {
                    tag += '<img src="' + FoodParent.Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index, element) {
                $(element).attr('src', FoodParent.Setting.getContentPictureDir() + self._donation.getPictures()[index]).load(function () {
                }).error(function () {
                    $(element).attr('src', FoodParent.Setting.getBlankImagePath());
                });
            });
        };
        EditDonationView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        EditDonationView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        EditDonationView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        EditDonationView.prototype._changeCoverImage = function (event) {
            var self = this;
            var cover = parseInt($(event.target).attr('data-target'));
            var place = FoodParent.Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            if (cover != 0) {
                FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.UPDATE_COVER, { cover: cover }, function () {
                    FoodParent.EventHandler.handleDataChange("Cover picture of <strong><i>" + place.getName() + "</i></strong> has changed successfully.", true);
                    self.renderDonationImages();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        };
        EditDonationView.prototype._prevNote = function (event) {
            var self = this;
            var donations = new FoodParent.Donations(FoodParent.Model.getDonations().where({ place: self._donation.getPlaceId() }));
            donations.sortByAscendingDate();
            var bFound = false;
            $.each(donations.models, function (index, donation) {
                if (self._donation.getId() == donation.getId() && !bFound) {
                    bFound = true;
                    if (index == 0) {
                        self._donation = donations.models[donations.models.length - 1];
                    }
                    else {
                        self._donation = donations.models[index - 1];
                    }
                    self.renderDonationInfo();
                    return;
                }
            });
        };
        EditDonationView.prototype._nextNote = function (event) {
            var self = this;
            var donations = new FoodParent.Donations(FoodParent.Model.getDonations().where({ place: self._donation.getPlaceId() }));
            donations.sortByAscendingDate();
            var bFound = false;
            $.each(donations.models, function (index, donation) {
                if (self._donation.getId() == donation.getId() && !bFound) {
                    bFound = true;
                    if (index == donations.models.length - 1) {
                        self._donation = donations.models[0];
                    }
                    else {
                        self._donation = donations.models[index + 1];
                    }
                    self.renderDonationInfo();
                    return;
                }
            });
        };
        EditDonationView.prototype._removeNewDonationTree = function (event) {
            var self = this;
            var treeId = parseInt($(event.target).attr('data-target'));
            var tree = FoodParent.Model.getTrees().findWhere({ id: treeId });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            //self._donation.removeTreeId(treeId);
            FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.REMOVE_DONATION_TREE, { tree: tree }, function () {
                FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been removed successfully.", true);
                self.renderDonationInfo();
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            }, function () {
                FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been added successfully.", true);
                self.renderDonationInfo();
            });
        };
        EditDonationView.prototype._deleteDonation = function (event) {
            var self = this;
            var date = self._donation.getFormattedDate();
            FoodParent.EventHandler.handleDonationData(self._donation, FoodParent.DATA_MODE.DELETE, {}, function () {
                if (FoodParent.View.getDetailDonationView()) {
                    FoodParent.View.getDetailDonationView().refreshDonationInfo();
                }
                FoodParent.EventHandler.handleDataChange("Donation of <strong><i>" + date + "</i></strong> has been removed successfully.", true);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        };
        EditDonationView.TAG = "EditDonationView - ";
        return EditDonationView;
    })(FoodParent.PopupView);
    FoodParent.EditDonationView = EditDonationView;
})(FoodParent || (FoodParent = {}));
