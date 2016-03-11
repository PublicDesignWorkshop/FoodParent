var TreeDateCell = Backgrid.Cell.extend({
    template: _.template('<div class="text-date btn-date"><%= date %></div>'),
    events: {
        "click .btn-date": "_updateDate",
    },
    _updateDate: function (e) {

    },
    render: function () {
        var self = this;
        var tree: FoodParent.Tree = this.model;
        $(self.el).html(self.template({
            date: tree.getUpdatedDate(),
        }));
        this.delegateEvents();
        return this;
    }
});

var TreeDescriptionCellEditor = Backgrid.Cell.extend({
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    if (newValue.trim() != tree.getDescription().trim() && newValue.trim() != "") {
                        var description: string = newValue;
                        if (tree.getDescription().trim() != description.trim()) {
                            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                                var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                model.trigger("backgrid:edited", model, column, command);
                                FoodParent.EventHandler.handleDataChange("Description of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                            }, function () {
                                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        } else {
                            self.renderTreeInfo(tree);
                        }
                    } else {
                        model.trigger("backgrid:edited", model, column, command);
                    }
                }
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
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
                }
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

var TreeAddressCellEditor = Backgrid.Cell.extend({
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
                if (tree.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    console.log(newValue);
                    if (newValue.trim() == "") {
                        var tree: FoodParent.Tree = this.model;
                        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
                            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: data.road + ", " + data.county + ", " + data.state + ", " + data.postcode }, function () {
                                var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                                FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been changed successfully.", true);
                                model.set(column.get("name"), data.road + ", " + data.county + ", " + data.state + ", " + data.postcode);
                                model.trigger("backgrid:edited", model, column, command);
                            }, function () {
                                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (newValue.trim() != tree.getAddress().trim()) {
                        var address: string = newValue;
                        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: address }, function () {
                            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        model.trigger("backgrid:edited", model, column, command);
                    }
                }
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


var TreeMapViewCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table" data-target="<%= treeid %>"><i class="fa fa-map-marker"></i></div>'),
    events: {
        "click .btn-table": "_panToTree"
    },
    _panToTree: function (event:Event) {
        var tree: number = parseInt($(event.currentTarget).attr('data-target'));
        new FoodParent.ResetPopupViewCommand().execute();
        FoodParent.Router.getInstance().navigate("trees/" + $(event.currentTarget).attr('data-target'), { trigger: true, replace: true });
    },
    render: function () {
        $(this.el).html(this.template({
            treeid: this.model.getId(),
        }));
        this.delegateEvents();
        return this;
    }
});

var ManageAdoptionViewCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table evt-manage-adopt" data-target="<%= treeid %>"><i class="fa fa-users"></i></div>'),
    events: {
        "click .btn-table": "_manageAdoption"
    },
    _manageAdoption: function (event: Event) {
        var tree: number = parseInt($(event.currentTarget).attr('data-target'));
        FoodParent.EventHandler.handleMouseClick($(event.currentTarget), this, { tree: tree });
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

var TreeDetailCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table" data-target="<%= treeid %>"><i class="fa fa-heartbeat"></i></div>'),
    events: {
        "click .btn-table": "_showDetail"
    },
    _showDetail: function (event) {
        var tree: number = parseInt($(event.target).attr('data-target'));
        FoodParent.EventHandler.handleMouseClick($(event.currentTarget), this, { tree: tree });
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

var TreeCreateCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table"><i class="fa fa-save"></i></div>'),
    events: {
        "click .btn-table": "_createRow"
    },
    _createRow: function (e) {
        var tree: FoodParent.Tree = this.model;
        FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.CREATE, {}, function () {
            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been created successfully.", true);
            $('#wrapper-mtrees .new-tree').addClass('hidden');
            //(<FoodParent.ManageTreesTableView>FoodParent.View.getManageTreesView())._applyFilter();
            //(<FoodParent.ManageTreesTableView>FoodParent.View.getManageTreesView()).renderTreeList(FoodParent.Model.getTrees());
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            FoodParent.EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", false);
            //(<FoodParent.ManageTreesTableView>FoodParent.View.getManageTreesView()).renderTreeList(FoodParent.Model.getTrees());
        });
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});

var TreeDeleteCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table"><i class="fa fa-trash-o"></i></div>'),
    events: {
        "click .btn-table": "_deleteRow"
    },
    _deleteRow: function (e) {
        var tree: FoodParent.Tree = this.model;
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

var TreeAdoptionCell = Backgrid.Cell.extend({
    events: {
        "click .btn-tree": "_linkTreeDetail",
    },
    _linkTreeDetail: function (e) {
        //FoodParent.Router.getInstance().navigate("tree/" + this.model.getId(), { trigger: true });
    },
    render: function () {
        this.template = _.template(FoodParent.Template.getAdoptPersonCellTemplate());
        var persons: FoodParent.Persons = new FoodParent.Persons(FoodParent.Model.getPersons().filterByIds(this.model.get('parents')));
        $(this.el).html(this.template({
            persons: persons,
        }));
        this.delegateEvents();
        return this;
    }
});


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
        var command = new Backgrid.Command(e);
        if (tree.getId() == undefined) {
            tree.set(column.get("name"), selected);
            tree.trigger("backgrid:edited", tree, column, command);
        } else {
            FoodParent.EventHandler.handleTreeData(tree, FoodParent.DATA_MODE.UPDATE_FOODTYPE, { food: selected }, function () {
                var food: FoodParent.Food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                tree.trigger("backgrid:edited", tree, column, new Backgrid.Command(e));
                FoodParent.EventHandler.handleDataChange("Food type of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has changed successfully.", true);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
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
        name: "description",
        label: "Description",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeDescriptionCellEditor }),
    }, {
        name: "address",
        label: "Address",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeAddressCellEditor }),
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
        name: "parents",
        label: "Adoption",
        editable: false,
        cell: TreeAdoptionCell,
    }, {
        name: "updated",
        label: "Last Updated",
        editable: false,
        cell: TreeDateCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: TreeMapViewCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: ManageAdoptionViewCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: TreeDetailCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: TreeDeleteCell,
    }
];

var NewTreeColumn: any = [
    {
        name: "food",
        label: "Food Type",
        editable: true,
    }, {
        name: "description",
        label: "Description",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeDescriptionCellEditor }),
    }, {
        name: "address",
        label: "Address",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: TreeAddressCellEditor }),
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
        label: "",
        sortable: false,
        editable: false,
        cell: TreeCreateCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: TreeDeleteCell,
    }
    /*
     {
        name: "updated",
        label: "Last Updated",
        editable: false,
        cell: TreeDateCell,
    },
    */
];