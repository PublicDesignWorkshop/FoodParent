var LocationNameCellEditor = Backgrid.Cell.extend({
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
        var self = this;
        var tree = this.model;
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                }
                else {
                    if (newValue.trim() != tree.getDescription().trim()) {
                    }
                    else {
                        model.trigger("backgrid:edited", model, column, command);
                    }
                }
            }
        }
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
            else
                this.$el.focus();
        }
        return this;
    }
});
var LocationDescriptionCellEditor = Backgrid.Cell.extend({
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
        var self = this;
        var tree = this.model;
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                }
                else {
                    if (newValue.trim() != tree.getDescription().trim()) {
                    }
                    else {
                        model.trigger("backgrid:edited", model, column, command);
                    }
                }
            }
        }
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
            else
                this.$el.focus();
        }
        return this;
    }
});
var LocationLatitudeCellEditor = Backgrid.Cell.extend({
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
        var self = this;
        var tree = this.model;
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                }
                else {
                }
            }
        }
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
            else
                this.$el.focus();
        }
        return this;
    }
});
var LocationLongitudeCellEditor = Backgrid.Cell.extend({
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
        var tree = this.model;
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                }
                else {
                }
            }
        }
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
            else
                this.$el.focus();
        }
        return this;
    }
});
var LocationAddressCell = Backgrid.Cell.extend({
    template: _.template('<div class="cell-group"><%= address %><div class="cell-button cell-refresh"><i class="fa fa-refresh fa-1x"></i></div></div>'),
    events: {
        "click .cell-refresh": "_refresh",
    },
    render: function () {
        var self = this;
        var element = $(self.el);
        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data) {
            element.html(self.template({
                address: "<div>" + data.road + ", " + data.county + ", " + data.state + ", " + data.postcode + "</div>",
            }));
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        });
        self.delegateEvents();
        return this;
    },
    _refresh: function (e) {
        var self = this;
        var element = $(self.el);
        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data) {
            element.html(self.template({
                address: "<div>" + data.road + ", " + data.county + ", " + data.state + ", " + data.postcode + "</div>",
            }));
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        });
    },
});
var LocationMapViewCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item mapview-item" data-target="<%= treeid %>"><i class="fa fa-map-marker fa-2x"></i></div>'),
    events: {
        "click .mapview-item": "_showMapView"
    },
    _showMapView: function (event) {
        var tree = parseInt($(event.target).attr('data-target'));
        //console.log(tree);
        /*
        FoodParent.EventHandler.handleMouseClick($(event.currentTarget), this, { id: tree });
        */
        //FoodParent.Router.getInstance().navigate("tree/" + this.model.getId(), { trigger: true });
    },
    render: function () {
        $(this.el).html(this.template({
            treeid: this.model.getId(),
        }));
        this.delegateEvents();
        return this;
    }
});
var ManageDonationViewCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item manage-donation-item" data-target="<%= treeid %>"><i class="fa fa-ambulance fa-2x"></i></div>'),
    events: {
        "click .marker-control-item": "_manageDonation"
    },
    _manageDonation: function (event) {
        var place = FoodParent.Model.getPlaces().findWhere({ id: parseInt($(event.target).attr('data-target')) });
        if (place != undefined) {
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), this, { place: place });
        }
        //var tree: number = parseInt($(event.target).attr('data-target'));
        //
    },
    render: function () {
        $(this.el).html(this.template({
            treeid: this.model.getId(),
        }));
        this.delegateEvents();
        return this;
    }
});
var LocationDetailCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item location-detail" data-target="<%= treeid %>"><i class="fa fa-arrow-circle-right fa-2x"></i></div>'),
    events: {
        "click .marker-control-item": "_showDetail"
    },
    _showDetail: function (event) {
        var place = FoodParent.Model.getPlaces().findWhere({ id: parseInt($(event.target).attr('data-target')) });
        if (place != undefined) {
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), this, { place: place });
        }
        //var tree: number = parseInt($(event.target).attr('data-target'));
        //FoodParent.EventHandler.handleMouseClick($(event.currentTarget), this, { tree: tree });
    },
    render: function () {
        $(this.el).html(this.template({
            treeid: this.model.getId(),
        }));
        this.delegateEvents();
        return this;
    }
});
var LocationDeleteCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item"><i class="fa fa-remove fa-2x"></i></div>'),
    events: {
        "click": "_deleteRow"
    },
    _deleteRow: function (e) {
        var tree = this.model;
        /*
        if (tree.getId() == undefined) {
            $('#wrapper-mtrees .new-tree').addClass('hidden');
        } else {
            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.DELETE, {}, function () {
                var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has deleted successfully.", false);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
        */
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});
var LocationColumn = [
    {
        name: "name",
        label: "Name",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: LocationNameCellEditor }),
    }, {
        name: "description",
        label: "Description",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: LocationDescriptionCellEditor }),
    }, {
        name: "address",
        label: "Address",
        editable: false,
        cell: LocationAddressCell,
    }, {
        name: "lat",
        label: "Latitude",
        editable: true,
        formatter: Backgrid.NumberFormatter,
        cell: Backgrid.Cell.extend({ editor: LocationLatitudeCellEditor }),
    }, {
        name: "lng",
        label: "Longitude",
        editable: true,
        formatter: Backgrid.NumberFormatter,
        cell: Backgrid.Cell.extend({ editor: LocationLongitudeCellEditor }),
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: LocationMapViewCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: ManageDonationViewCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: LocationDetailCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: LocationDeleteCell,
    }
];
