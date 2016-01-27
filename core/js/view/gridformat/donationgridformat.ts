var DonationAddCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item marker-add-adoption"><i class="fa fa-plus-square fa-2x"></i></div>'),
    events: {
        "click .marker-control-item": "_addDonation",
    },
    _addDonation: function (e) {
        var tree: FoodParent.Tree = this.model;
        (<FoodParent.DonationManageView>FoodParent.View.getPopupView()).addNewDonation(tree);
        /*
        var tree: FoodParent.Tree = FoodParent.Model.getTrees().findWhere({ id: parseInt($('.list-donation').attr('data-target')) });
        var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
        var person: FoodParent.Person = this.model;
        FoodParent.EventHandler.handleAdoptionData(tree, person, FoodParent.DATA_MODE.CREATE, {}, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
            (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
            (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        });
        */
    },
    render: function () {
        var self = this;
        $(self.el).html(self.template());
        /*
        var person: FoodParent.Person = this.model;
        var treeId: number = parseInt($('.list-adoption').attr('data-target'));
        if (FoodParent.Model.getAdopts().checkAdoption(treeId, person.getId())) {
            $(self.el).html('<div class="blank-marker-control-item"></div>');
        } else {
            $(self.el).html(self.template());
        }
        */
        this.delegateEvents();
        return this;
    }
});

var DonationDeleteCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item marker-remove-adoption"><i class="fa fa-minus-square fa-2x"></i></div>'),
    events: {
        "click .marker-control-item": "_removeDonation",
    },
    _removeDonation: function (e) {
        var donation: FoodParent.Donation = this.model;
        (<FoodParent.DonationManageView>FoodParent.View.getPopupView()).removeNewDonation(donation);
        /*
        var tree: FoodParent.Tree = FoodParent.Model.getTrees().findWhere({ id: parseInt($('.list-adoption').attr('data-target')) });
        var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
        var person: FoodParent.Person = this.model;
        FoodParent.EventHandler.handleAdoptionData(tree, person, FoodParent.DATA_MODE.DELETE, {}, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
            (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
            (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        });
        */
    },
    render: function () {
        var self = this;
        $(self.el).html(self.template());
        /*
        var person: FoodParent.Person = this.model;
        var treeId: number = parseInt($('.list-adoption').attr('data-target'));
        if (FoodParent.Model.getAdopts().checkAdoption(treeId, person.getId())) {
            $(self.el).html(self.template());
        } else {
            $(self.el).html('<div class="blank-marker-control-item"></div>');
        }
        */
        this.delegateEvents();
        return this;
    }
});


var DonationTreeCell = Backgrid.Cell.extend({
    events: { },
    render: function () {
        var self: any = this;
        var donation: FoodParent.Donation = this.model;
        var treeId: number = donation.getTreeId();
        var tree: FoodParent.Tree = FoodParent.Model.getTrees().findWhere({ id: treeId });
        var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
        var element: JQuery = $(self.el);
        element.html(food.getName() + " " + tree.getName());
        self.delegateEvents();
        return this;
    }
});

var DonationPlaceCell = Backgrid.Cell.extend({
    events: {},
    render: function () {
        var self: any = this;
        var donation: FoodParent.Donation = this.model;
        var placeId: number = donation.getPlaceId();
        var place: FoodParent.Place = FoodParent.Model.getPlaces().findWhere({ id: placeId });
        var element: JQuery = $(self.el);
        element.html(place.getName());
        self.delegateEvents();
        return this;
    }
});


var DonationQuantityCellEditor = Backgrid.Cell.extend({
    tagName: "input",
    attributes: {
        type: "text"
    },
    events: {
        "blur": "saveOrCancel",
        "keydown": "saveOrCancel"
    },
    initialize: function (options) {
        Backgrid.InputCellEditor.__super__.initialize.apply(this, arguments);

        if (options.placeholder) {
            this.$el.attr("placeholder", options.placeholder);
        }
    },
    render: function () {
        var model = this.model;
        this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")), model));
        return this;
    },
    saveOrCancel: function (e) {
        var self: any = this;
        var donation: FoodParent.Donation = this.model;
        var formatter = this.formatter;
        var model = this.model;
        var column = this.column;

        var command = new Backgrid.Command(e);
        var blurred = e.type === "blur";

        if (command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
            command.save() || blurred) {

            e.preventDefault();
            e.stopPropagation();

            var val = this.$el.val();
            var newValue = formatter.toRaw(val, model);
            if (_.isUndefined(newValue)) {
                model.trigger("backgrid:error", model, column, val);
            }
            else {
                if (donation.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                }
                /*
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    if (newValue != tree.getLat()) {
                        var location: L.LatLng = new L.LatLng(newValue, tree.getLng());
                        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        model.trigger("backgrid:edited", model, column, command);
                    }
                }
                */
            }
        }
        // esc
        else if (command.cancel()) {
            // undo
            e.stopPropagation();
            model.trigger("backgrid:edited", model, column, command);
        }
    },
    postRender: function (model, column) {
        if (column == null || column.get("name") == this.column.get("name")) {
            // move the cursor to the end on firefox if text is right aligned
            if (this.$el.css("text-align") === "right") {
                var val = this.$el.val();
                this.$el.focus().val(null).val(val);
            }
            else this.$el.focus();
        }
        return this;
    }
});

var DonationPickDateCellEditor = Backgrid.Cell.extend({
    template: _.template('<div class="pickdate"><%= date %></div>'),
    events: {
        //"click": "_changeDate",
    },
    _changeDate: function (e) {
        /*
        var tree: FoodParent.Tree = FoodParent.Model.getTrees().findWhere({ id: parseInt($('.list-adoption').attr('data-target')) });
        var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
        var person: FoodParent.Person = this.model;
        FoodParent.EventHandler.handleAdoptionData(tree, person, FoodParent.DATA_MODE.DELETE, {}, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
            (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            (<FoodParent.AdoptionManageView>FoodParent.View.getPopupView())._applyFilter();
            (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        });
        */
    },
    render: function () {
        var self = this;
        var donation: FoodParent.Donation = this.model;
        var date = donation.getDateForDatePicker();
        $(self.el).html(self.template({ date: donation.getFormattedDate() }));
        $(self.el).find('.pickdate').attr({ 'data-value': moment(date).format(FoodParent.Setting.getDateFormat()) });
        $(self.el).find('.pickdate').pickadate({
            format: "dd mmm yyyy",
            today: '',
            max: new Date(moment(new Date()).valueOf()),
            clear: '',
            close: 'Close',
            onClose: function () {
                //self._startDate = moment(this.get()).startOf('day').format(FoodParent.Setting.getDateTimeFormat());
                //self.renderTreeChart(self._tree, self._startDate, self._endDate);
            }
        });
        /*
        var person: FoodParent.Person = this.model;
        var treeId: number = parseInt($('.list-adoption').attr('data-target'));
        if (FoodParent.Model.getAdopts().checkAdoption(treeId, person.getId())) {
            $(self.el).html(self.template());
        } else {
            $(self.el).html('<div class="blank-marker-control-item"></div>');
        }
        */
        this.delegateEvents();
        return this;
    }
});


var DonationColumn: any = [
    {
        name: "food",
        label: "Food Type",
        editable: true,
    }, {
        name: "id",
        label: "#",
        editable: false,
        cell: "string",
    }, {
        name: "description",
        label: "Description",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeDescriptionCellEditor }),
    }, {
        name: "address",
        label: "Address",
        editable: false,
        cell: TreeAddressCell,
    }, {
        name: "parents",
        label: "Adoption",
        editable: false,
        cell: TreeAdoptionCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: DonationAddCell,
    }
    /*
     {
        name: "updated",
        label: "Last Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    },
    */
];


var NewDonationColumn: any = [
    {
        name: "place",
        label: "Place",
        editable: false,
        cell: DonationPlaceCell,
    }, {
        name: "tree",
        label: "Tree",
        editable: false,
        cell: DonationTreeCell,
    }, {
        name: "quantity",
        label: "Quantity",
        editable: true,
        formatter: Backgrid.NumberFormatter,
        cell: Backgrid.Cell.extend({ editor: DonationQuantityCellEditor }),
    }, {
        name: "date",
        label: "Date",
        editable: true,
        cell: DonationPickDateCellEditor,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: DonationDeleteCell,
    }
    /*
     {
        name: "updated",
        label: "Last Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    },
    */
];


