var PersonNameCellEditor = Backgrid.Cell.extend({
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
        var person: FoodParent.Person = this.model;
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
                if (person.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    var name: string = newValue;
                    if (name.trim() != person.getName().trim()) {
                        FoodParent.EventHandler.handlePersonData(person, FoodParent.DATA_MODE.UPDATE_NAME, { name: name }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Name of <strong><i>" + person.getName() + "</i></strong> has changed successfully.", true);
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

var PersonAddressCellEditor = Backgrid.Cell.extend({
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
        var person: FoodParent.Person = this.model;
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
                if (person.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    var address: string = newValue;
                    if (address.trim() != person.getAddress().trim()) {
                        FoodParent.EventHandler.handlePersonData(person, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: address }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + person.getName() + "</i></strong> has changed successfully.", true);
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

var PersonContactCellEditor = Backgrid.Cell.extend({
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
        var person: FoodParent.Person = this.model;
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
                if (person.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    var contact: string = newValue;
                    if (contact.trim() != person.getContact().trim()) {
                        FoodParent.EventHandler.handlePersonData(person, FoodParent.DATA_MODE.UPDATE_CONTACT, { contact: contact }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Contact of <strong><i>" + person.getName() + "</i></strong> has changed successfully.", true);
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

var PersonNeighborhoodCellEditor = Backgrid.Cell.extend({
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
        var person: FoodParent.Person = this.model;
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
                if (person.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    var neighborhood: string = newValue;
                    if (neighborhood.trim() != person.getNeighboorhood().trim()) {
                        FoodParent.EventHandler.handlePersonData(person, FoodParent.DATA_MODE.UPDATE_NEIGHBORHOOD, { neighborhood: neighborhood }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Neighborhood of <strong><i>" + person.getName() + "</i></strong> has changed successfully.", true);
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


var PersonAdoptionCellEditor = Backgrid.Cell.extend({
    events: {
        "click .cell-link": "_linkTreeDetail",
    },
    _linkTreeDetail: function (e) {
        //FoodParent.Router.getInstance().navigate("tree/" + this.model.getId(), { trigger: true });
    },
    render: function () {
        this.template = _.template(FoodParent.Template.getAdoptTreeCellTemplate());
        var trees: FoodParent.Trees = new FoodParent.Trees(FoodParent.Model.getTrees().filterByIds(this.model.get('trees')));
        $(this.el).html(this.template({
            trees: trees,
        }));
        this.delegateEvents();
        return this;
    }
});

var PersonDetailCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item"><i class="fa fa-sticky-note-o fa-2x"></i></div>'),
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

var PersonDeleteCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item"><i class="fa fa-remove fa-2x"></i></div>'),
    events: {
        "click": "_deleteRow"
    },
    _deleteRow: function (e) {
        var person: FoodParent.Person = this.model;
        if (person.getId() == undefined) {
            $('#wrapper-mtrees .new-tree').addClass('hidden');
        } else {
            FoodParent.EventHandler.handlePersonData(person, FoodParent.DATA_MODE.DELETE, {}, function () {
                FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has deleted successfully.", false);
            }, function () {
                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
            });
        }
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});

var AuthSelectCellEditor = Backgrid.AuthSelectCellEditor = Backgrid.CellEditor.extend({

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
        var person: FoodParent.Person = this.model;
        var column = this.column;
        //tree.set(column.get("name"), parseInt(this.formatter.toRaw(this.$el.val(), tree)));
        var selected: number = parseInt(this.$el.val());
        var command = new Backgrid.Command(e);
        if (person.getId() == undefined) {
            person.set(column.get("name"), selected);
            person.trigger("backgrid:edited", person, column, command);
        } else {
            FoodParent.EventHandler.handlePersonData(person, FoodParent.DATA_MODE.UPDATE_AUTH, { auth: selected }, function () {
                person.trigger("backgrid:edited", person, column, new Backgrid.Command(e));
                FoodParent.EventHandler.handleDataChange("Authorization of <strong><i>" + person.getName() + "</i></strong> has changed successfully.", true);
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

var PersonColumn: any = [
    {
        name: "auth",
        label: "Auth",
        editable: true,
    }, {
        name: "name",
        label: "Name",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: PersonNameCellEditor }),
    }, {
        name: "address",
        label: "Address",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: PersonAddressCellEditor }),
    }, {
        name: "contact",
        label: "Contact",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: PersonContactCellEditor }),
    }, {
        name: "neighborhood",
        label: "Neighborhood",
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: PersonNeighborhoodCellEditor }),
    }, {
        name: "trees",
        label: "Adoption",
        editable: false,
        cell: PersonAdoptionCellEditor,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: PersonDetailCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: PersonDeleteCell,
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