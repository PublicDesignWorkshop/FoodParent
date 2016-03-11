var AdoptionDateCell = Backgrid.Cell.extend({
    template: _.template('<div class="text-date btn-date"><%= date %></div>'),
    events: {
        "click .btn-date": "_updateDate",
    },
    _updateDate: function (e) {
    },
    render: function () {
        var self = this;
        var person = this.model;
        $(self.el).html(self.template({
            date: person.getUpdatedDate(),
        }));
        this.delegateEvents();
        return this;
    }
});
var AdoptionAuthCell = Backgrid.Cell.extend({
    template: _.template('<div><%= auth %></div>'),
    render: function () {
        var person = this.model;
        $(this.el).html(this.template({
            auth: FoodParent.Model.getAuths().findWhere({ id: person.getAuth() }).getName(),
        }));
        this.delegateEvents();
        return this;
    }
});
var AdoptionNameCell = Backgrid.Cell.extend({
    template: _.template('<div><%= name %></div>'),
    render: function () {
        var person = this.model;
        $(this.el).html(this.template({
            name: person.getName(),
        }));
        this.delegateEvents();
        return this;
    }
});
var AdoptionContactCell = Backgrid.Cell.extend({
    template: _.template('<div><%= contact %></div>'),
    render: function () {
        var person = this.model;
        $(this.el).html(this.template({
            contact: person.getContact(),
        }));
        this.delegateEvents();
        return this;
    }
});
var AdoptionNeighborhoodCell = Backgrid.Cell.extend({
    template: _.template('<div><%= neighborhood %></div>'),
    render: function () {
        var person = this.model;
        $(this.el).html(this.template({
            neighborhood: person.getNeighboorhood(),
        }));
        this.delegateEvents();
        return this;
    }
});
var AdoptionAddCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table"><i class="fa fa-plus-square"></i></div>'),
    events: {
        "click .btn-table": "_addAdoption",
    },
    _addAdoption: function (e) {
        var tree = FoodParent.Model.getTrees().findWhere({ id: parseInt($('.list-adoption').attr('data-target')) });
        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
        var person = this.model;
        FoodParent.EventHandler.handleAdoptionData(tree, person, FoodParent.DATA_MODE.CREATE, {}, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            FoodParent.View.getPopupView()._applyFilter();
            //(<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            FoodParent.View.getPopupView()._applyFilter();
            //(<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
        });
    },
    render: function () {
        var self = this;
        var person = this.model;
        var treeId = parseInt($('.list-adoption').attr('data-target'));
        if (FoodParent.Model.getAdopts().checkAdoption(treeId, person.getId())) {
            $(self.el).html('<div class="blank-marker-control-item"></div>');
        }
        else {
            $(self.el).html(self.template());
        }
        this.delegateEvents();
        return this;
    }
});
var AdoptionDeleteCell = Backgrid.Cell.extend({
    template: _.template('<div class="btn-table"><i class="fa fa-minus-square"></i></div>'),
    events: {
        "click .btn-table": "_removeAdoption",
    },
    _removeAdoption: function (e) {
        var tree = FoodParent.Model.getTrees().findWhere({ id: parseInt($('.list-adoption').attr('data-target')) });
        var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
        var person = this.model;
        FoodParent.EventHandler.handleAdoptionData(tree, person, FoodParent.DATA_MODE.DELETE, {}, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            new FoodParent.RefreshCurrentViewCommand().execute();
            //if (FoodParent.View.getManageTreesView()) {
            //    (<FoodParent.ManageTreesView>FoodParent.View.getManageTreesView()).renderTreeInfo(tree);
            //}
        }, function () {
            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
        }, function () {
            FoodParent.EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> successfully.", false);
            new FoodParent.RefreshCurrentViewCommand().execute();
        });
    },
    render: function () {
        var self = this;
        var person = this.model;
        var treeId = parseInt($('.list-adoption').attr('data-target'));
        if (FoodParent.Model.getAdopts().checkAdoption(treeId, person.getId())) {
            $(self.el).html(self.template());
        }
        else {
            $(self.el).html('<div class="btn-table-blank"></div>');
        }
        this.delegateEvents();
        return this;
    }
});
var AdoptionListCell = Backgrid.Cell.extend({
    events: {
        "click .btn-tree": "_panToTree",
    },
    _panToTree: function (event) {
        new FoodParent.ResetPopupViewCommand().execute();
        FoodParent.Router.getInstance().navigate("trees/" + $(event.currentTarget).attr('data-target'), { trigger: true, replace: true });
    },
    render: function () {
        this.template = _.template(FoodParent.Template.getAdoptTreeCellTemplate());
        var trees = new FoodParent.Trees(FoodParent.Model.getTrees().filterByIds(this.model.get('trees')));
        $(this.el).html(this.template({
            trees: trees,
        }));
        this.delegateEvents();
        return this;
    }
});
var AdoptionColumn = [
    {
        name: "auth",
        label: "Auth",
        editable: false,
        cell: AdoptionAuthCell,
    }, {
        name: "name",
        label: "Name",
        editable: false,
        cell: AdoptionNameCell,
    }, {
        name: "contact",
        label: "Contact",
        editable: false,
        cell: AdoptionContactCell,
    }, {
        name: "neighborhood",
        label: "Neighborhood",
        editable: false,
        cell: AdoptionNeighborhoodCell,
    }, {
        name: "trees",
        label: "Adoption",
        editable: false,
        cell: AdoptionListCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: AdoptionAddCell,
    }, {
        label: "",
        sortable: false,
        editable: false,
        cell: AdoptionDeleteCell,
    }
];
