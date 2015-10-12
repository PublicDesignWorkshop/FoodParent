
var DatePickerCellEditor = Backgrid.InputCellEditor.extend({
    events: {},
    initialize: function () {
        Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
        var input = this;
        $(this.el).datetimepicker({
            defaultDate: input.model.get("date"),
            format: FoodParent.Setting.getInstance().getDateTimeFormat(),
        }).on("dp.hide", function () {
            if ($(this).data("date") != undefined) {
                var command = new Backgrid.Command({});
                input.model.set(input.column.get("name"), $(this).data("date"));
                input.model.trigger("backgrid:edited", input.model, input.column, command);
            }
        });
    },
});

var TreeDeleteCell = Backgrid.Cell.extend({
    template: _.template('<button type="button" class="btn btn-default btn-table"><span class="glyphicon glyphicon-remove"></span></button>'),
    events: {
        "click": "deleteRow"
    },
    deleteRow: function (e) {
        var r = confirm(FoodParent.Localization.getInstance().getDeleteConfirmText());
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
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});

var TreeDetailCell = Backgrid.Cell.extend({
    template: _.template('<button type="button" class="btn btn-default btn-table"><span class="glyphicon glyphicon-log-in"></span></button>'),
    events: {
        "click": "showDetail"
    },
    showDetail: function (e) {
        FoodParent.Router.getInstance().navigate("tree/" + this.model.getId(), { trigger: true });
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});

var TreeColumn = [
    {
        name: "id",
        label: "#",
        editable: false,
        cell: "string",
    }, {
        name: "food",
        label: "Type of Food",
        editable: true,
    }, {
        name: "lat",
        label: "Latitude",
        editable: true,
        cell: "number", // A cell type for floating point value, defaults to have a precision 2 decimal numbers
    }, {
        name: "lng",
        label: "Longitude",
        editable: true,
        cell: "number",
    }, {
        name: "address",
        label: "Address",
        editable: true,
        cell: "string", // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
    }, {
        name: "updated",
        label: "Updated",
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