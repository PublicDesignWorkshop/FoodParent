module FoodParent {
    export class DetailDonationViewFractory {
        private static _instance: DetailDonationViewFractory = new DetailDonationViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (DetailDonationViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use DetailDonationViewFractory.getInstance() instead of new.");
            }
            DetailDonationViewFractory._instance = this;
        }
        public static getInstance(): DetailDonationViewFractory {
            return DetailDonationViewFractory._instance;
        }
        public static create(el: JQuery, id: number): DetailDonationView {
            var view: DetailDonationView;
            view = new DetailDonationGraphicView({ el: el });
            view.setPlaceId(id);
            return view;
        }
    }

    export class DetailDonationView extends BaseView {
        protected _id: number;
        public setPlaceId(id: number) {
            this._id = Math.floor(id);
        }
        public refreshDonationInfo() {

        }
    }

    export class DetailDonationGraphicView extends DetailDonationView {
        private static TAG: string = "DetailDonationGraphicView - ";
        private _place: Place;
        private _donation: Donation;
        private _startDate: string;
        private _endDate: string;
        private _chart: any;
        private _timer: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: DetailDonationGraphicView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .switch-map": "_mouseClick",
                "click .date-preset": "_datePreset",
                "dblclick .content-chart": "_mouseClick",
                "click .button-new-donation": "_mouseClick",
                "click .button-delete-location": "_deleteLocation",
            };
            self.delegateEvents();
        }

        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self: DetailDonationGraphicView = this;
            if (self.bDebug) console.log(DetailDonationGraphicView.TAG + "render()");

            var template = _.template(Template.getDetailDonationGraphicViewTemplate());
            var data = {

            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mdonation'));
            self.resize();

            Controller.fetchAllLocations(function () {
                self._place = Model.getPlaces().findWhere({ id: self._id });
                self.renderPlaceInfo(self._place);

                self.$('.donation-graph-start').attr({ 'data-value': moment(new Date()).subtract(1, 'month').format(Setting.getDateFormat()) });
                self._startDate = moment(moment(new Date()).subtract(3, 'month').format(Setting.getDateFormat())).format(Setting.getDateTimeFormat());

                self.$('.donation-graph-start').pickadate({
                    format: "dd mmm yyyy",
                    today: '',
                    max: new Date(moment(new Date()).subtract('day', 2).valueOf()),
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._startDate = moment(this.get()).startOf('day').format(Setting.getDateTimeFormat());
                        self.renderDonationChart(self._place, self._startDate, self._endDate);
                    }
                });

                var today: Date = new Date();
                self._endDate = moment(today).endOf('day').format(Setting.getDateTimeFormat());
                self.$('.donation-graph-end').attr({ 'data-value': moment(new Date()).format(Setting.getDateFormat()) });
                self.$('.donation-graph-end').pickadate({
                    format: "dd mmm yyyy",
                    today: 'Today',
                    max: today,
                    clear: '',
                    close: 'Close',
                    onClose: function () {
                        self._endDate = moment(this.get()).endOf('day').format(Setting.getDateTimeFormat());
                        self.renderDonationChart(self._place, self._startDate, self._endDate);
                    }
                });

                self.renderDonationChart(self._place, self._startDate, self._endDate);
                
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });

            return self;
        }

        public resize(): any {
            var self: DetailDonationGraphicView = this;
            $('#wrapper-main').css({ height: View.getHeight() - 60 });
            $('#wrapper-mdonation').css({ height: View.getHeight() - 60 });
            self.$('.image-group').css({ height: self.$('.image-wrapper').innerHeight() - 60 });
        }

        public refreshDonationInfo() {
            var self: DetailDonationGraphicView = this;
            self.renderPlaceInfo(self._place);
            self.renderDonationChart(self._place, self._startDate, self._endDate);
        }

        public renderPlaceInfo = (place: Place) => {
            var self: DetailDonationGraphicView = this;

            var template = _.template(Template.getPlaceInfoTemplate2());
            var data = {
                placename: place.getName(),
                lat: place.getLat().toFixed(4),
                lng: place.getLng().toFixed(4),
                description: place.getDescription(),
            }
            self.$('.content-donation-info').html(template(data));

            GeoLocation.reverseGeocoding(place.getLocation(), function (data: ReverseGeoLocation) {
                self.$(".donation-info-address").html("<div>&nbsp;<i class='fa fa-map-marker'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.road + ", " + data.county + ", " + data.state + ", " + data.country + ", " + data.postcode + "</div>");
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
            self.renderRecentDonations(place);
        }
        private renderRecentDonations(place: Place): void {
            var self: DetailDonationGraphicView = this;
            var places: Array<Place> = new Array<Place>();
            places.push(place);
            Controller.fetchDonationsOfPlaces(places, Setting.getLargeNumRecentActivitiesShown(), 0, function () {
                var donations: Donations = new Donations(Model.getDonations().where({ place: place.getId() }));
                donations.sortByDescendingDate();
                var template = _.template(Template.getRecentDonationsTemplate());
                var data = {
                    donations: donations,
                    size: Setting.getLargeNumRecentActivitiesShown(),
                }
                self.$('#list-donations').html(template(data));
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        public renderDonationChart = (place: Place, startDate: string, endDate: string) => {
            var self: DetailDonationGraphicView = this;

            Controller.fetchDonationsOfPlacesDuringPeriod([self._place], startDate, endDate, 10000, 0, function () {
                self.$('#wrapper-chart').html('<canvas id="content-chart" class="content-chart" />');
                var canvas: any = self.$('#content-chart')[0];
                self.$('#content-chart').attr({ 'width': self.$('#content-chart').innerWidth(), 'height': self.$('#content-chart').innerHeight() });
                var ctx = canvas.getContext("2d");

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
                var donations: Array<Donation> = new Array<Donation>();
                var start: Moment = moment(startDate).set('hour', 13).set('minute', 0).set('seconds', 0).set('milliseconds', 0);


                var prevDonation: Donation = null;
                for (var i: number = moment(start).valueOf(); i < moment(endDate).add('day', 1).valueOf(); i += 1000 * 60 * 60 * 24) {
                    labels.push(moment(i).format(Setting.getDateHourFormat()));
                    var donation: Donation = Model.getDonations().getLatestDonationOfDate(self._place.getId(), i);
                    if (donation) {
                        donations.push(donation);
                        prevDonation = donation;
                    } else {
                        donations.push(new Donation({ place: self._place.getId(), tree: '', quantity: 0, date: moment(i).format(Setting.getDateTimeFormat()) }));
                    }
                }
                console.log("Graph Points Length: " + donations.length);

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
                            self._donation = Model.getDonations().findWhere({ id: tooltip.id });
                            if (self._donation) {
                                var template = _.template(Template.getToolTipTemplate2());
                                var data = {
                                    image: Setting.getBlankImagePath(),
                                    value: self._donation.getCumulativeQuantity(),
                                    comment: htmlDecode(self._donation.getComment()),
                                    startdate: Model.getDonations().models[0].getFormattedDate(),
                                    date: self._donation.getFormattedHourTime(),
                                }
                                self.$('#wrapper-tooltip').html(template(data));
                                if (self._donation.getPictures().length > 0) {
                                    self.$('#wrapper-tooltip img').attr('src', Setting.getContentPictureDir() + self._donation.getPictures()[0]).load(function () {
                                        $(this).removeClass('hidden');
                                    }).error(function () {
                                        $(this).attr('src', Setting.getBlankImagePath());
                                        $(this).addClass('hidden');
                                    });
                                } else {
                                    self.$('#wrapper-tooltip img').addClass('hidden');
                                }
                            }
                            self.$('#wrapper-tooltip').removeClass('hidden');
                        },
                    }
                );

            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }

        private _datePreset(event: Event): void {
            var self: DetailDonationGraphicView = this;
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
            self.$('.donation-graph-start').pickadate('picker').set('select', moment(self._startDate).format(Setting.getDateFormat()), { format: 'dd mmm yyyy' })
            self.renderDonationChart(self._place, self._startDate, self._endDate);
        }

        private _mouseClick(event: Event): void {
            var self: DetailDonationGraphicView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self, { donation: self._donation, place: self._place });
        }

        private _deleteLocation(event: Event): void {
            var self: DetailDonationGraphicView = this;
            FoodParent.EventHandler.handlePlaceData(self._place, FoodParent.DATA_MODE.DELETE, {}, function () {
                Backbone.history.history.back();
                FoodParent.EventHandler.handleDataChange("<strong><i>" + self._place.getName() + "</i></strong> has deleted successfully.", false);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    }



    export class EditDonationViewFactory {
        private static _instance: EditDonationViewFactory = new EditDonationViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (EditDonationViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use EditDonationViewFactory.getInstance() instead of new.");
            }
            EditDonationViewFactory._instance = this;
        }
        public static getInstance(): EditDonationViewFactory {
            return EditDonationViewFactory._instance;
        }
        public static create(el: JQuery, donation: Donation): EditDonationView {
            var view: EditDonationView = new EditDonationView({ el: el });
            view.setDonation(donation);
            return view;
        }
    }

    export class EditDonationView extends PopupView {
        private static TAG: string = "EditDonationView - ";
        private _donation: Donation;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: EditDonationView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
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
        public setDonation(donation: Donation): void {
            var self: EditDonationView = this;
            self._donation = donation;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: EditDonationView = this;
            if (self.bDebug) console.log(EditDonationView.TAG + "render()");
            
            var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            var template = _.template(Template.getEditDonationViewTemplate());
            var data = {
                name: place.getName(),
                image: Setting.getBlankImagePath(),
                //value: self._note.getRate(),
                amount: self._donation.getQuantity(),
                date: self._donation.getFormattedHourTime(),
            }
            $('#wrapper-pop').html(template(data));
            self.setElement($('#wrapper-donation'));
            self.renderDonationInfo();

            self.setVisible();
            self.resize();
            return self;
        }

        public renderDonationInfo() {
            var self: EditDonationView = this;
            var today: Date = new Date();
            self.$('.input-date').attr({ 'data-value': self._donation.getFormattedDate() });
            self.$('.input-date').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    EventHandler.handleDonationData(self._donation, DATA_MODE.UPDATE_DATE, { date: moment(this.get()).startOf('day').format(Setting.getDateTimeFormat()) }, function () {
                        EventHandler.handleDataChange("Date of this <strong><i>Donation</i></strong> has changed successfully.", true);
                        self.renderDonationInfo();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });
            self.$('.input-date').pickadate('picker').set('select', self._donation.getFormattedDate(), { format: 'dd mmm yyyy' });
            var template = _.template(Template.getAddNewDonationTreeTemplate());
            self.$('.new-donation-trees').html(template({
                trees: Model.getTrees().filterByIds(self._donation.getTreeIds()),
            }));
            //self.$('.input-comment').html(self._donation.getComment());
            
            self.renderDonationImages();

            // Event listener for uploading a file.
            self.$('input[type=file]').off('change');
            self.$('input[type=file]').on('change', function (event: Event) {
                self.$('.wrapper-input-upload-picture').addClass('hidden');
                self.$('.wrapper-uploading-picture').removeClass('hidden');
                var files = (<any>event.target).files;
                var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
                if (files.length > 0) {
                    Controller.uploadNotePictureFile(files[0], fileNameEncode(place.getName()), function (fileName: string) {
                        EventHandler.handleDonationData(self._donation, DATA_MODE.ADD_PICTURE, { filename: fileName }, function () {
                            EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been added successfully.", true);
                            // Success
                            self.$('input[type=file]').val("");
                            self.$('.wrapper-uploading-picture').addClass('hidden');
                            self.$('.wrapper-input-upload-picture').removeClass('hidden');
                            self.renderDonationImages();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            EventHandler.handleDataChange("<strong><i>" + fileName + "</i></strong> has been removed successfully.", true);
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


            var template = _.template(Template.TreeSelectTemplate());
            var data = {
                trees: Model.getTrees(),
            }
            self.$('.add-donation-tree').html(template(data));

            self.$('.input-tree').selectpicker();
            self.$('.input-tree').selectpicker("val", 0);
            
            self.$('.input-tree').on('hide.bs.dropdown', function (event) {
                var selected: number = parseInt($(this).find("option:selected").val());
                var tree: Tree = Model.getTrees().findWhere({ id: selected });
                if (tree != undefined) {
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    if (self._donation.getTreeIds().length == 0) {
                        EventHandler.handleDonationData(self._donation, DATA_MODE.ADD_DONATION_TREE, { tree: tree }, function () {
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been added successfully.", true);
                            self.renderDonationInfo();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been removed successfully.", true);
                            self.renderDonationInfo();
                        });
                    } else {
                        var firstTreeId = Math.floor(self._donation.getTreeIds()[0]);
                        var firstTree: Tree = Model.getTrees().findWhere({ id: firstTreeId });
                        var firstFood: Food = Model.getFoods().findWhere({ id: firstTree.getFoodId() });
                        var currentFood: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                        if (firstFood.getId() == currentFood.getId()) {
                            if (self._donation.hasTreeId(tree.getId())) {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "<strong><i>" + firstFood.getName() + " " + tree.getName() + "</i></strong> already exist.", undoable: false }).execute();
                                self.$('.input-tree').selectpicker("val", 0);
                            } else {
                                EventHandler.handleDonationData(self._donation, DATA_MODE.ADD_DONATION_TREE, { tree: tree }, function () {
                                    EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been added successfully.", true);
                                    self.renderDonationInfo();
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                }, function () {
                                    EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been removed successfully.", true);
                                    self.renderDonationInfo();
                                });
                            }
                            
                        } else {
                            new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: "Please select <strong>same type</strong> of food.", undoable: false }).execute();
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
                    var amount: number = parseFloat(self.$('.input-amount').val());
                    if (amount != self._donation.getQuantity()) {
                        EventHandler.handleDonationData(self._donation, DATA_MODE.UPDATE_DONATION_AMOUNT, { amount: amount }, function () {
                            EventHandler.handleDataChange("<strong><i>Amount of donation</i></strong> has been changed successfully.", true);
                            self.renderDonationInfo();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        self.renderDonationInfo();
                    }
                });
            });
            
        }

        public renderDonationImages() {
            var self: EditDonationView = this;
            var tag = '';
            $.each(self._donation.getPictures(), function (index: number, filename: string) {
                if (index == 0) {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" class="selected" />';
                } else {
                    tag += '<img src="' + Setting.getBlankImagePath() + '" data-target="' + index + '" />';
                }
            });
            self.$('.image-group').html(tag);
            $.each(self.$('.image-group img'), function (index: number, element: JQuery) {
                $(element).attr('src', Setting.getContentPictureDir() + self._donation.getPictures()[index]).load(function () {

                }).error(function () {
                    $(element).attr('src', Setting.getBlankImagePath());
                });
            });
        }

        public setVisible(): void {
            var self: EditDonationView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: EditDonationView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }

        private _mouseClick(event: Event): void {
            var self: EditDonationView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        private _changeCoverImage(event: Event) {
            var self: EditDonationView = this;
            var cover: number = parseInt($(event.target).attr('data-target'));
            var place: Place = Model.getPlaces().findWhere({ id: self._donation.getPlaceId() });
            if (cover != 0) {
                EventHandler.handleDonationData(self._donation, DATA_MODE.UPDATE_COVER, { cover: cover }, function () {
                    EventHandler.handleDataChange("Cover picture of <strong><i>" + place.getName() + "</i></strong> has changed successfully.", true);
                    self.renderDonationImages();
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
        }

        private _prevNote(event: Event): void {
            var self: EditDonationView = this;
            var donations: Donations = new Donations(Model.getDonations().where({ place: self._donation.getPlaceId() }));
            donations.sortByAscendingDate();
            var bFound: boolean = false;
            $.each(donations.models, function (index: number, donation: Donation) {
                if (self._donation.getId() == donation.getId() && !bFound) {
                    bFound = true;
                    if (index == 0) {
                        self._donation = donations.models[donations.models.length - 1];
                    } else {
                        self._donation = donations.models[index - 1];
                    }
                    self.renderDonationInfo();
                    return;
                }
            });
        }

        private _nextNote(event: Event): void {
            var self: EditDonationView = this;
            var donations: Donations = new Donations(Model.getDonations().where({ place: self._donation.getPlaceId() }));
            donations.sortByAscendingDate();
            var bFound: boolean = false;
            $.each(donations.models, function (index: number, donation: Donation) {
                if (self._donation.getId() == donation.getId() && !bFound) {
                    bFound = true;
                    if (index == donations.models.length - 1) {
                        self._donation = donations.models[0];
                    } else {
                        self._donation = donations.models[index + 1];
                    }
                    self.renderDonationInfo();
                    return;
                }
            });
        }

        private _removeNewDonationTree(event: Event): void {
            var self: EditDonationView = this;
            var treeId: number = parseInt($(event.target).attr('data-target'));
            var tree: Tree = Model.getTrees().findWhere({ id: treeId });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            //self._donation.removeTreeId(treeId);
            EventHandler.handleDonationData(self._donation, DATA_MODE.REMOVE_DONATION_TREE, { tree: tree }, function () {
                EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been removed successfully.", true);
                self.renderDonationInfo();
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            }, function () {
                EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been added successfully.", true);
                self.renderDonationInfo();
            });
        }

        private _deleteDonation(event: Event): void {
            var self: EditDonationView = this;
            var date: string = self._donation.getFormattedDate();
            EventHandler.handleDonationData(self._donation, DATA_MODE.DELETE, {}, function () {
                if (View.getDetailDonationView()) {
                    (<DetailDonationView>View.getDetailDonationView()).refreshDonationInfo();
                }
                EventHandler.handleDataChange("Donation of <strong><i>" + date + "</i></strong> has been removed successfully.", true);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    }
}