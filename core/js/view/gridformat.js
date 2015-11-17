var AdoptTreesCell = Backgrid.Cell.extend({
    initialize: function (options) {
        this.column = options.column;
        if (!(this.column instanceof Backgrid.Column)) {
            this.column = new Backgrid.Column(this.column);
        }
        this.listenTo(this.model, "backgrid:editing", this.postRender);
    },
    template: _.template(FoodParent.Template.getInstance().getAdoptTreeCellTemplate()),
    render: function () {
        var trees = new FoodParent.Trees(FoodParent.Model.getInstance().getTrees().filterById(this.model.get('trees')));
        var data = {
            trees: trees,
        };
        $(this.el).html(this.template(data));
        $(this.el).addClass('renderable');
        this.delegateEvents();
        return this;
    }
});
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
    },
    {
        name: "food",
        label: "Type of Food",
        editable: true,
    },
    {
        name: "lat",
        label: "Latitude",
        editable: true,
        cell: "number",
    },
    {
        name: "lng",
        label: "Longitude",
        editable: true,
        cell: "number",
    },
    {
        name: "address",
        label: "Address",
        editable: true,
        cell: "string",
    },
    {
        name: "updated",
        label: "Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    },
    {
        label: "Detail",
        sortable: false,
        editable: false,
        cell: TreeDetailCell,
    },
    {
        label: "Delete",
        sortable: false,
        editable: false,
        cell: TreeDeleteCell,
    }
];
var PersonDeleteCell = Backgrid.Cell.extend({
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
var PersonDetailCell = Backgrid.Cell.extend({
    template: _.template('<button type="button" class="btn btn-default btn-table"><span class="glyphicon glyphicon-log-in"></span></button>'),
    events: {
        "click": "showDetail"
    },
    showDetail: function (e) {
        FoodParent.Router.getInstance().navigate("person/" + this.model.getId(), { trigger: true });
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});
var PersonColumn = [
    {
        name: "id",
        label: "#",
        editable: false,
        cell: "string",
    },
    {
        name: "auth",
        label: "Type",
        editable: true,
    },
    {
        name: "name",
        label: "Name",
        editable: true,
        cell: "string",
    },
    {
        name: "address",
        label: "Address",
        editable: true,
        cell: "string",
    },
    {
        name: "contact",
        label: "Contact",
        editable: true,
        cell: "string",
    },
    {
        name: "neighborhood",
        label: "Neighborhood",
        editable: true,
        cell: "string",
    },
    {
        name: "updated",
        label: "Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    },
    {
        name: "trees",
        label: "Adoption",
        sortable: false,
        editable: false,
        cell: AdoptTreesCell,
    },
    {
        label: "Delete",
        sortable: false,
        editable: false,
        cell: PersonDeleteCell,
    }
];
var AdoptAddCell = Backgrid.Cell.extend({
    initialize: function (options) {
        this.column = options.column;
        if (!(this.column instanceof Backgrid.Column)) {
            this.column = new Backgrid.Column(this.column);
        }
        this.listenTo(this.model, "backgrid:editing", this.postRender);
    },
    template: _.template('<i class="pointer fa fa-plus-square fa-1x"></i>'),
    events: {
        "click": "AddAdoption"
    },
    render: function () {
        var data = {};
        $(this.el).html(this.template(data));
        $(this.el).addClass('renderable');
        this.delegateEvents();
        return this;
    },
    AddAdoption: function (e) {
        console.log(e);
        console.log(this.model.get('tempid'));
        var person = FoodParent.Model.getInstance().getPersons().findWhere({ id: this.model.get('tempid') });
        var tree = FoodParent.View.getInstance().getPopupView().getCurrentTree();
        var r = confirm("Do you want assign tree '" + tree.getName() + "' to '" + person.getName() + "'");
        if (r == true) {
            e.preventDefault();
            var adopt = new FoodParent.Adopt({
                tree: tree.getId(),
                owner: person.getId(),
            });
            FoodParent.Model.getInstance().getAdopts().add(adopt);
            FoodParent.Model.getInstance().getPersons().updateTrees();
            FoodParent.View.getInstance().getPopupView().renderEditParent(tree);
        }
    },
});
var AdoptRemoveCell = Backgrid.Cell.extend({
    template: _.template('<i class="pointer fa fa-minus-square fa-1x"></i>'),
    events: {
        "click": "RemoveAdoption"
    },
    AddAdoption: function (e) {
    },
    render: function () {
        $(this.el).html(this.template());
        this.delegateEvents();
        return this;
    }
});
var PersonPopupColumn = [
    {
        name: "auth",
        label: "Type",
        editable: false,
    },
    {
        name: "name",
        label: "Name",
        editable: false,
        cell: "string",
    },
    {
        name: "contact",
        label: "Contact",
        editable: false,
        cell: "string",
    },
    {
        name: "trees",
        label: "Adoption",
        sortable: false,
        editable: false,
        cell: AdoptTreesCell,
    },
    {
        label: "Add",
        sortable: false,
        editable: false,
        cell: AdoptAddCell,
    },
    {
        label: "Remove",
        sortable: false,
        editable: false,
        cell: AdoptRemoveCell,
    },
    {
        name: "updated",
        label: "Updated",
        editable: false,
        cell: Backgrid.Cell.extend({ editor: DatePickerCellEditor }),
    }
];
