var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ManagePeopleViewFractory = (function () {
        function ManagePeopleViewFractory(args) {
            if (ManagePeopleViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManagePeopleViewFractory.getInstance() instead of new.");
            }
            ManagePeopleViewFractory._instance = this;
        }
        ManagePeopleViewFractory.getInstance = function () {
            return ManagePeopleViewFractory._instance;
        };
        ManagePeopleViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                view = new ManagePeopleTableView({ el: el });
                view.setPeopleId(id);
            }
            return view;
        };
        ManagePeopleViewFractory._instance = new ManagePeopleViewFractory();
        return ManagePeopleViewFractory;
    })();
    FoodParent.ManagePeopleViewFractory = ManagePeopleViewFractory;
    var ManagePeopleView = (function (_super) {
        __extends(ManagePeopleView, _super);
        function ManagePeopleView() {
            _super.apply(this, arguments);
        }
        ManagePeopleView.prototype.setPeopleId = function (id) {
            this._id = id;
        };
        return ManagePeopleView;
    })(FoodParent.BaseView);
    FoodParent.ManagePeopleView = ManagePeopleView;
    var ManagePeopleTableView = (function (_super) {
        __extends(ManagePeopleTableView, _super);
        function ManagePeopleTableView(options) {
            var _this = this;
            _super.call(this, options);
            this.renderPersons = function () {
                var self = _this;
                FoodParent.Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(function () {
                    // add grid instance for existing data
                    self.renderPersonsList(FoodParent.Model.getPersons());
                    //self.renderFilterList();
                }, function () {
                    FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            };
            this.renderPersonsList = function (persons) {
                var self = _this;
                var optionValues = new Array();
                optionValues.push({ name: "Authorization", values: FoodParent.Model.getAuths().toArray() });
                PersonColumn[0].cell = Backgrid.SelectCell.extend({
                    editor: Backgrid.AuthSelectCellEditor,
                    optionValues: optionValues,
                });
                var grid = new Backgrid.Grid({
                    columns: PersonColumn,
                    collection: persons,
                    emptyText: FoodParent.Setting.getNoDataText(),
                });
                grid.render();
                //grid.sort("name", "ascending");
                self.$(".list-people").html(grid.el);
            };
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {};
            self.delegateEvents();
        }
        ManagePeopleTableView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(ManagePeopleTableView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManagePeopleTableViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mpeople'));
            self.resize();
            self.renderPersons();
        };
        ManagePeopleTableView.prototype.resize = function () {
            $('#content-mpeople-table').css({ width: FoodParent.View.getWidth() - $('#wrapper-tablemenu').outerWidth() });
            $('#wrapper-main').css({ height: FoodParent.View.getHeight() - 60 });
            $('#wrapper-mpeople').css({ height: FoodParent.View.getHeight() - 60 });
            $('.collapsible-list').css({ height: FoodParent.View.getHeight() - 60 - 34 * 2 - 20 });
        };
        ManagePeopleTableView.TAG = "ManageTreesMapView - ";
        return ManagePeopleTableView;
    })(ManagePeopleView);
    FoodParent.ManagePeopleTableView = ManagePeopleTableView;
})(FoodParent || (FoodParent = {}));
