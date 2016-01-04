var TreeLatitudeCellEditor = Backgrid.Cell.extend({
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
        var tree: FoodParent.Tree = this.model;
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
                

                //model.set(column.get("name"), newValue);
                
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

var TreeLongitudeCellEditor = Backgrid.Cell.extend({
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
        var tree: FoodParent.Tree = this.model;
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

                if (newValue != tree.getLng()) {
                    var location: L.LatLng = new L.LatLng(tree.getLat(), newValue);
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
                

                //model.set(column.get("name"), newValue);
                
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

var TreeAddressCell = Backgrid.Cell.extend({
    template: _.template('<div class="cell-group"><%= address %><div class="cell-button cell-refresh"><i class="fa fa-refresh fa-1x"></i></div></div>'),
    events: {
        "click .cell-refresh": "_refresh",
    },
    render: function () {
        var self: any = this;
        var element: JQuery = $(self.el);
        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
            element.html(self.template({
                address: "<div>" + data.road + ", " + data.state + ", " + data.postcode + "</div>",
            }));
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        });
        self.delegateEvents();
        return this;
    },
    _refresh: function (e) {
        var self: any = this;
        var element: JQuery = $(self.el);
        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
            element.html(self.template({
                address: "<div>" + data.road + ", " + data.state + ", " + data.postcode + "</div>",
            }));
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        });
    },
});


var TreeDetailCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item marker-control-info"><i class="fa fa-sticky-note-o fa-2x"></i></div>'),
    events: {
        "click": "_showDetail"
    },
    _showDetail: function (e) {
        //FoodParent.Router.getInstance().navigate("tree/" + this.model.getId(), { trigger: true });
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});

var TreeDeleteCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item marker-control-info"><i class="fa fa-remove fa-2x"></i></div>'),
    events: {
        "click": "_deleteRow"
    },
    _deleteRow: function (e) {
        /*
        var r = confirm(FoodParent.getDeleteConfirmText());
        if (r == true) {
            e.preventDefault();
            this.model.collection.remove(this.model);
            this.model.destroy({
                wait: true,
                success: function (model, response) {

                },
                error: function () {

                },
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

var TreeColumn: any = [
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
        name: "address",
        label: "Address",
        editable: false,
        cell: TreeAddressCell,
    }, {
        name: "lat",
        label: "Latitude",
        editable: true,
        formatter: Backgrid.NumberFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeLatitudeCellEditor }),
    }, {
        name: "lng",
        label: "Longitude",
        editable: true,
        formatter: Backgrid.NumberFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeLongitudeCellEditor }),
    }, {
        name: "updated",
        label: "Last Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    }, {
        label: "Detail",
        sortable: false,
        editable: false,
        cell: TreeDetailCell,
    }, {
        label: "Delete",
        sortable: false,
        editable: false,
        cell: TreeDeleteCell,
    }
];

var FoodSelectCellEditor = Backgrid.FoodSelectCellEditor = Backgrid.CellEditor.extend({

    /** @property */
    tagName: "select",

    /** @property */
    events: {
        "change": "save",
        "blur": "close",
        "keydown": "close"
    },

    /** @property {function(Object, ?Object=): string} template */
    template: _.template('<option value="<%- value %>" <%= selected ? \'selected="selected"\' : "" %>><%- text %></option>', null, { variable: null }),

    setOptionValues: function (optionValues) {
        this.optionValues = optionValues;
        this.optionValues = _.result(this, "optionValues");
    },

    setMultiple: function (multiple) {
        this.multiple = multiple;
        this.$el.prop("multiple", multiple);
    },

    _renderOptions: function (nvps, selectedValues) {
        var options = '';
        for (var i = 0; i < nvps.length; i++) {
            options = options + this.template({
                text: nvps[i][0],
                value: nvps[i][1],
                selected: _.indexOf(selectedValues, nvps[i][1]) > -1
            });
        }
        return options;
    },

    /**
       Renders the options if `optionValues` is a list of name-value pairs. The
       options are contained inside option groups if `optionValues` is a list of
       object hashes. The name is rendered at the option text and the value is the
       option value. If `optionValues` is a function, it is called without a
       parameter.
    */
    render: function () {
        this.$el.empty();

        var optionValues = _.result(this, "optionValues");
        var model = this.model;
        var selectedValues = this.formatter.fromRaw(model.get(this.column.get("name")), model);

        if (!_.isArray(optionValues)) throw new TypeError("optionValues must be an array");

        var optionValue = null;
        var optionText = null;
        var optionValue = null;
        var optgroupName = null;
        var optgroup = null;

        for (var i = 0; i < optionValues.length; i++) {
            var optionValue = optionValues[i];

            if (_.isArray(optionValue)) {
                optionText = optionValue[0];
                optionValue = optionValue[1];

                this.$el.append(this.template({
                    text: optionText,
                    value: optionValue,
                    selected: _.indexOf(selectedValues, optionValue) > -1
                }));
            }
            else if (_.isObject(optionValue)) {
                optgroupName = optionValue.name;
                optgroup = $("<optgroup></optgroup>", { label: optgroupName });
                optgroup.append(this._renderOptions.call(this, optionValue.values, selectedValues));
                this.$el.append(optgroup);
            }
            else {
                throw new TypeError("optionValues elements must be a name-value pair or an object hash of { name: 'optgroup label', value: [option name-value pairs] }");
            }
        }

        this.delegateEvents();

        return this;
    },

    /**
       Saves the value of the selected option to the model attribute.
    */
    save: function (e) {
        var tree: FoodParent.Tree = this.model;
        var column = this.column;
        //tree.set(column.get("name"), parseInt(this.formatter.toRaw(this.$el.val(), tree)));
        var selected: number = parseInt(this.$el.val());
        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            tree.trigger("backgrid:edited", tree, column, new Backgrid.Command(e));
            FoodParent.EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        });
    },

    /**
       Triggers a `backgrid:edited` event from the model so the body can close
       this editor.
    */
    close: function (e) {
        var model = this.model;
        var column = this.column;
        var command = new Backgrid.Command(e);
        if (command.cancel()) {
            e.stopPropagation();
            model.trigger("backgrid:edited", model, column, new Backgrid.Command(e));
        }
        else if (command.save() || command.moveLeft() || command.moveRight() ||
            command.moveUp() || command.moveDown() || e.type == "blur") {
            e.preventDefault();
            e.stopPropagation();
            //this.save(e);
            model.trigger("backgrid:edited", model, column, new Backgrid.Command(e));
        }
    }
});