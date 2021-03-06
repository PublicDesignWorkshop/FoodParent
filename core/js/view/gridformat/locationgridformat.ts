﻿var LocationNameCellEditor = Backgrid.Cell.extend({
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
        var place: FoodParent.Place = this.model;
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
                if (place.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    if (newValue.trim() != place.getName().trim() && newValue.trim() != "") {
                        var name: string = newValue;
                        FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.UPDATE_NAME, { name: name }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Name of <strong><i>Location</i></strong> has changed successfully.", true);
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
        var self: any = this;
        var place: FoodParent.Place = this.model;
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
                if (place.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    if (newValue.trim() != place.getDescription().trim() && newValue.trim() != "") {
                        var description: string = newValue;
                        FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.UPDATE_DESCRIPTION, { description: description }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Description of <strong><i>" + place.getName() +"</i></strong> has changed successfully.", true);
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
        var self: any = this;
        var place: FoodParent.Place = this.model;
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
                if (place.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    if (newValue != place.getLat() && newValue.trim() != '') {
                        var location: L.LatLng = new L.LatLng(newValue, place.getLng());
                        FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + place.getName() + "</i></strong> has changed successfully.", true);
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
        var place: FoodParent.Place = this.model;
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
                if (place.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    if (newValue != place.getLng() && newValue.trim() != '') {
                        var location: L.LatLng = new L.LatLng(place.getLat(), newValue);
                        FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.UPDATE_LOCATION, { location: location }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Location of <strong><i>" + place.getName() + "</i></strong> has changed successfully.", true);
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


var LocationAddressCell = Backgrid.Cell.extend({
    template: _.template('<div class="cell-group"><%= address %><div class="cell-button cell-refresh"><i class="fa fa-refresh fa-1x"></i></div></div>'),
    events: {
        "click .cell-refresh": "_refresh",
    },
    render: function () {
        var self: any = this;
        var element: JQuery = $(self.el);
        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
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
        var self: any = this;
        var element: JQuery = $(self.el);
        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
            element.html(self.template({
                address: "<div>" + data.road + ", " + data.county + ", " + data.state + ", " + data.postcode + "</div>",
            }));
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        });
    },
});

var LocationAddressCellEditor = Backgrid.Cell.extend({
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
        var place: FoodParent.Place = this.model;
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
                if (place.getId() == undefined) {
                    model.set(column.get("name"), newValue);
                    model.trigger("backgrid:edited", model, column, command);
                } else {
                    console.log(newValue);
                    if (newValue.trim() == "") {
                        var place: FoodParent.Place = this.model;
                        FoodParent.GeoLocation.reverseGeocoding(self.model.getLocation(), function (data: FoodParent.ReverseGeoLocation) {
                            FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: data.road + ", " + data.county + ", " + data.state + ", " + data.postcode }, function () {
                                FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + place.getName() + "</i></strong> has been changed successfully.", true);
                                model.set(column.get("name"), data.road + ", " + data.county + ", " + data.state + ", " + data.postcode);
                                model.trigger("backgrid:edited", model, column, command);
                            }, function () {
                                FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (newValue.trim() != place.getAddress().trim()) {
                        var address: string = newValue;
                        FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.UPDATE_ADDRESS, { address: address }, function () {
                            model.trigger("backgrid:edited", model, column, command);
                            FoodParent.EventHandler.handleDataChange("Address of <strong><i>" + place.getName() + "</i></strong> has changed successfully.", true);
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

var LocationMapViewCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item mapview-item" data-target="<%= treeid %>"><i class="fa fa-map-marker fa-2x"></i></div>'),
    events: {
        "click .mapview-item": "_showMapView"
    },
    _showMapView: function (event) {
        var tree: number = parseInt($(event.target).attr('data-target'));
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
        var place: FoodParent.Place = FoodParent.Model.getPlaces().findWhere({ id: parseInt($(event.target).attr('data-target')) });
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
    template: _.template('<div class="marker-control-item location-detail" data-target="<%= treeid %>"><i class="fa fa-heartbeat fa-2x"></i></div>'),
    events: {
        "click .marker-control-item": "_showDetail"
    },
    _showDetail: function (event) {
        var place: FoodParent.Place = FoodParent.Model.getPlaces().findWhere({ id: parseInt($(event.target).attr('data-target')) });
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
        var tree: FoodParent.Tree = this.model;
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

var LocationCreateCell = Backgrid.Cell.extend({
    template: _.template('<div class="marker-control-item create-item"><i class="fa fa-save fa-2x"></i></div>'),
    events: {
        "click": "_createRow"
    },
    _createRow: function (e) {
        var place: FoodParent.Place = this.model;
        FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.CREATE, {}, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + place.getName() + "</i></strong> has been created successfully.", true);
            $('#wrapper-mdonations .new-location').addClass('hidden');
            //(<FoodParent.ManageDonationsTableView>FoodParent.View.getManageDonationsView())._applyFilter();
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + place.getName() + "</i></strong> has been deleted successfully.", false);
            $('#wrapper-mdonations .new-location').addClass('hidden');
            //(<FoodParent.ManageTreesTableView>FoodParent.View.getManageTreesView()).renderTreeList(FoodParent.Model.getTrees());
        });
    },
    render: function () {
        $(this.el).html(this.template());
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
        var place: FoodParent.Place = this.model;
        if (place.getId() == undefined) {
            $('#wrapper-mdonations .new-location').addClass('hidden');
        } else {
            FoodParent.EventHandler.handlePlaceData(place, FoodParent.DATA_MODE.DELETE, {}, function () {
                FoodParent.EventHandler.handleDataChange("<strong><i>" + place.getName() + "</i></strong> has deleted successfully.", false);
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

var LocationColumn: any = [
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
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: LocationAddressCellEditor }),
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
    /*
     {
        name: "updated",
        label: "Last Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    },
    */
];

var NewLocationColumn: any = [
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
        editable: true,
        formatter: Backgrid.StringFormatter,
        cell: Backgrid.Cell.extend({ editor: LocationAddressCellEditor }),
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
        cell: LocationCreateCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: LocationDeleteCell,
    }
];