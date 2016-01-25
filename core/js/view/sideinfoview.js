var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var SideInfoView = (function (_super) {
        __extends(SideInfoView, _super);
        function SideInfoView(options) {
            var _this = this;
            _super.call(this, options);
            this.bActive = true;
            this.renderRecentActivity = function () {
                var that = _this;
                if (that.tree) {
                    var template = _.template(FoodParent.Template.getInstance().getRecentActivityTemplate());
                    var notes = new FoodParent.Notes(FoodParent.Model.getInstance().getNotes().where({ tree: that.tree.getId() }));
                    FoodParent.Model.getInstance().getNotes().sortByDescendingDate();
                    var data = {
                        recent: FoodParent.Localization.getInstance().getRecentText(),
                        notes: notes.first(FoodParent.Setting.getInstance().getNumRecentActivityShown()),
                    };
                    that.$('.wrapper-recent-activity').html(template(data));
                }
            };
            this.renderTreeInfo = function () {
                var that = _this;
                if (that.tree) {
                    var food = FoodParent.Model.getInstance().getFoods().findWhere({ id: that.tree.getFoodId() });
                    var flag = FoodParent.Model.getInstance().getFlags().findWhere({ id: that.tree.getFlagId() });
                    var ownership = FoodParent.Model.getInstance().getOwnerships().findWhere({ id: that.tree.getOwnershipId() });
                    var template = _.template(FoodParent.Template.getInstance().getSideInfoViewTemplate());
                    var data = {
                        name: food.getName() + that.tree.getName(),
                        location: '@ ' + that.tree.getLat().toFixed(4) + ", " + that.tree.getLng().toFixed(4),
                        flag: FoodParent.Localization.getInstance().getFlagText(),
                        flags: FoodParent.Model.getInstance().getFlags(),
                        ownership: FoodParent.Localization.getInstance().getOwnershipText(),
                        ownerships: FoodParent.Model.getInstance().getOwnerships(),
                        foods: FoodParent.Model.getInstance().getFoods(),
                    };
                    that.$el.html(template(data));
                    that.renderFlagInfo(flag);
                    that.renderOwnershipInfo(ownership);
                    FoodParent.Controller.getInstance().fetchNotes([that.tree.getId()], FoodParent.Setting.getInstance().getNumRecentActivityShown(), 0, that.renderRecentActivity);
                    that.renderTableToggle();
                }
                else {
                    that.$el.html("");
                }
                return that;
            };
            this.renderFlagInfo = function (flag) {
                var that = _this;
                $.each(that.$('.flag-radio'), function (index, item) {
                    if (parseInt($(item).attr('data-flag')) == flag.getId()) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                        that.currentFlag = parseInt($(item).attr('data-flag'));
                    }
                    else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                    }
                });
            };
            this.renderOwnershipInfo = function (ownership) {
                var that = _this;
                $.each(that.$('.ownership-radio'), function (index, item) {
                    if (parseInt($(item).attr('data-ownership')) == ownership.getId()) {
                        $(item).addClass('active');
                        $(item).find('input').prop({ 'checked': 'checked' });
                        that.currentOwnership = parseInt($(item).attr('data-ownership'));
                    }
                    else {
                        $(item).removeClass('active');
                        $(item).find('input').prop({ 'checked': '' });
                    }
                });
            };
            var that = this;
            that.events = {
                "click .flag-radio": "_clickFlagRadio",
                "click .ownership-radio": "_clickOwnershipRadio",
                "click .filter-checkbox": "_clickFilterCheckbox",
            };
            that.delegateEvents();
            that.views = new Array();
        }
        SideInfoView.prototype.render = function () {
            var that = this;
            if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                var template = _.template(FoodParent.Template.getInstance().getTreesSideInfoViewTemplate());
                var data = {
                    food: FoodParent.Model.getInstance().getFoods(),
                };
                that.$el.html(template(data));
            }
            else if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.PEOPLE) {
                var template = _.template(FoodParent.Template.getInstance().getPeopleSideInfoViewTemplate());
                var data2 = {};
                that.$el.html(template(data2));
            }
            else {
                var template = _.template(FoodParent.Template.getInstance().getEmptySideInfoViewTemplate());
                var data3 = {};
                that.$el.html(template(data3));
            }
            that.renderTableToggle();
            return that;
        };
        SideInfoView.prototype.render2 = function (bChecked) {
            var that = this;
            if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                var template = _.template(FoodParent.Template.getInstance().getTreesSideInfoViewTemplate());
                var data = {
                    food: FoodParent.Model.getInstance().getFoods(),
                };
                that.$el.html(template(data));
            }
            that.renderTableToggle(bChecked);
            return that;
        };
        SideInfoView.prototype.customRender = function (tree) {
            var that = this;
            that.tree = tree;
            FoodParent.Controller.getInstance().fetchFlags(FoodParent.Controller.getInstance().fetchTypes, that.renderTreeInfo);
        };
        SideInfoView.prototype.renderTableToggle = function (bChecked) {
            var that = this;
            that.$('#toggle-table').bootstrapToggle({
                on: 'Graphic',
                off: 'Table',
                size: 'small',
                onstyle: 'default',
            });
            if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                if (bChecked != undefined) {
                    if (bChecked) {
                        that.$('#toggle-table').bootstrapToggle('on');
                    }
                    else {
                        that.$('#toggle-table').bootstrapToggle('off');
                    }
                }
                that.$('#toggle-table').change(function () {
                    that.render2($(this).prop('checked'));
                    that.mapView.SetIsGraphicView($(this).prop('checked'));
                });
            }
            else if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.PEOPLE) {
                that.$('#toggle-table').bootstrapToggle('off');
                that.$('#toggle-table').prop({ disabled: 'disabled' });
            }
        };
        SideInfoView.prototype._clickFilterCheckbox = function (event) {
            var that = this;
            setTimeout(function () {
                if ($(event.target).find('input').prop('name') == 'showall') {
                    if ($(event.target).find('input').prop('checked') == true) {
                        $.each(that.$('.filter-checkbox'), function (index, item) {
                            $(item).addClass('active');
                            $(item).find('input').prop({ 'checked': 'checked' });
                        });
                    }
                    else {
                        $.each(that.$('.filter-checkbox'), function (index, item) {
                            $(item).removeClass('active');
                            $(item).find('input').prop({ 'checked': '' });
                        });
                    }
                }
                else if ($(event.target).find('input').prop('name') != 'showall') {
                    var isAllChecked = true;
                    $.each(that.$('.filter-checkbox'), function (index, item) {
                        if ($(item).find('input').prop('name') != 'showall') {
                            if ($(item).find('input').prop('checked') == false) {
                                isAllChecked = false;
                            }
                        }
                    });
                    if (isAllChecked) {
                        that.$('.filter-checkbox').find('input[name="showall"]').parent().addClass('active');
                        that.$('.filter-checkbox').find('input[name="showall"]').prop({ 'checked': 'checked' });
                    }
                    else if ($(event.target).find('input').prop('checked') == false) {
                        that.$('.filter-checkbox').find('input[name="showall"]').parent().removeClass('active');
                        that.$('.filter-checkbox').find('input[name="showall"]').prop({ 'checked': '' });
                    }
                }
                var trees = new FoodParent.Trees();
                var persons = new FoodParent.Persons();
                if (that.$('.filter-checkbox').find('input[name="showall"]').prop('checked')) {
                    if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                        trees = FoodParent.Model.getInstance().getTrees();
                    }
                    else if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.PEOPLE) {
                        persons = FoodParent.Model.getInstance().getPersons();
                    }
                }
                if (that.$('.filter-checkbox').find('input[name="assigned"]').prop('checked')) {
                    if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                        trees = FoodParent.Model.getInstance().getTrees().getAssigned(trees);
                        console.log(trees);
                    }
                    else if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.PEOPLE) {
                        persons = FoodParent.Model.getInstance().getPersons().getAssigned(persons);
                    }
                }
                if (that.$('.filter-checkbox').find('input[name="unassigned"]').prop('checked')) {
                    if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                        trees = FoodParent.Model.getInstance().getTrees().getUnassigned(trees);
                    }
                    else if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.PEOPLE) {
                        persons = FoodParent.Model.getInstance().getPersons().getUnassigned(persons);
                    }
                }
                $.each(that.$('.filter-checkbox'), function (index, item) {
                    if (($(item).find('input').prop('name') != 'showall') && ($(item).find('input').prop('name') != 'assigned') && ($(item).find('input').prop('name') != 'unassigned')) {
                        if ($(item).find('input').prop('checked')) {
                            trees = FoodParent.Model.getInstance().getTrees().getFromFoodId(trees, parseInt($(item).find('input').prop('name')));
                        }
                    }
                });
                if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.TREES) {
                    that.mapView.customRender(trees);
                }
                else if (FoodParent.View.getInstance().getViewType() == FoodParent.MainViewType.PEOPLE) {
                    that.personsView.renderGrid(persons);
                }
            }, 1);
        };
        SideInfoView.prototype._clickFlagRadio = function (event) {
            var that = this;
            $.each(that.$('.flag-radio'), function (index, item) {
                if (item == event.target) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                }
                else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
            if (that.currentFlag != parseInt($(event.target).attr('data-flag')) && that.tree) {
                that.currentFlag = parseInt($(event.target).attr('data-flag'));
                that.tree.save({
                    flag: parseInt($(event.target).attr('data-flag')),
                }, {
                    wait: true,
                    success: function (model, response) {
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
                var note = new FoodParent.Note({
                    type: FoodParent.NoteType.INFO,
                    tree: that.tree.getId(),
                    person: 0,
                    comment: "Flag is changed to '" + FoodParent.Model.getInstance().getFlags().findWhere({ id: parseInt($(event.target).attr('data-flag')) }).getName() + "'",
                    picture: "",
                    rate: 0,
                    date: moment(new Date()).format(FoodParent.Setting.getInstance().getDateTimeFormat()),
                });
                note.save({}, {
                    wait: true,
                    success: function (model, response) {
                        FoodParent.Model.getInstance().getNotes().add(model);
                        that.renderRecentActivity();
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            }
        };
        SideInfoView.prototype._clickOwnershipRadio = function (event) {
            var that = this;
            $.each(that.$('.ownership-radio'), function (index, item) {
                if (item == event.target) {
                    $(item).addClass('active');
                    $(item).find('input').prop({ 'checked': 'checked' });
                }
                else {
                    $(item).removeClass('active');
                    $(item).find('input').prop({ 'checked': '' });
                }
            });
            if (that.currentOwnership != parseInt($(event.target).attr('data-ownership')) && that.tree) {
                that.currentOwnership = parseInt($(event.target).attr('data-ownership'));
                that.tree.save({
                    ownership: parseInt($(event.target).attr('data-ownership')),
                }, {
                    wait: true,
                    success: function (model, response) {
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
                var note = new FoodParent.Note({
                    type: FoodParent.NoteType.INFO,
                    tree: that.tree.getId(),
                    person: 0,
                    comment: "Ownership is changed to '" + FoodParent.Model.getInstance().getOwnerships().findWhere({ id: parseInt($(event.target).attr('data-ownership')) }).getName() + "'",
                    picture: "",
                    rate: 0,
                    date: moment(new Date()).format(FoodParent.Setting.getInstance().getDateTimeFormat()),
                });
                note.save({}, {
                    wait: true,
                    success: function (model, response) {
                        FoodParent.Model.getInstance().getNotes().add(model);
                        that.renderRecentActivity();
                    },
                    error: function (error) {
                        console.log(error);
                    },
                });
            }
        };
        SideInfoView.prototype.setMapView = function (view) {
            this.mapView = view;
        };
        SideInfoView.prototype.setPersonsView = function (view) {
            this.personsView = view;
        };
        return SideInfoView;
    })(Backbone.View);
    FoodParent.SideInfoView = SideInfoView;
})(FoodParent || (FoodParent = {}));
