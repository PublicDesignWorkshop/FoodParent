var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ManageDonationsViewFractory = (function () {
        function ManageDonationsViewFractory(args) {
            if (ManageDonationsViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ManageDonationsViewFractory.getInstance() instead of new.");
            }
            ManageDonationsViewFractory._instance = this;
        }
        ManageDonationsViewFractory.getInstance = function () {
            return ManageDonationsViewFractory._instance;
        };
        ManageDonationsViewFractory.create = function (el, viewMode, id) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.MAP) {
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                view = new ManageDonationsTableView({ el: el });
                view.setTreeId(id);
            }
            return view;
        };
        ManageDonationsViewFractory._instance = new ManageDonationsViewFractory();
        return ManageDonationsViewFractory;
    })();
    FoodParent.ManageDonationsViewFractory = ManageDonationsViewFractory;
    var ManageDonationsView = (function (_super) {
        __extends(ManageDonationsView, _super);
        function ManageDonationsView() {
            _super.apply(this, arguments);
            this.renderTreeInfo = function (tree) {
            };
        }
        ManageDonationsView.prototype.setTreeId = function (id) {
            this._id = id;
        };
        return ManageDonationsView;
    })(FoodParent.BaseView);
    FoodParent.ManageDonationsView = ManageDonationsView;
    var ManageDonationsTableView = (function (_super) {
        __extends(ManageDonationsTableView, _super);
        function ManageDonationsTableView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .switch-map": "_mouseClick",
                "click .filter-checkbox": "_applyFilter",
                "click .add-tree": "_addNewTree",
            };
            self.delegateEvents();
        }
        ManageDonationsTableView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return self;
            }
            this.bRendered = true;
            var self = this;
            if (self.bDebug)
                console.log(ManageDonationsTableView.TAG + "render()");
            var template = _.template(FoodParent.Template.getManageDonationsTableViewTemplate());
            var data = {};
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-mdonations'));
            self.resize();
            return self;
        };
        ManageDonationsTableView.TAG = "ManageDonationsTableView - ";
        return ManageDonationsTableView;
    })(ManageDonationsView);
    FoodParent.ManageDonationsTableView = ManageDonationsTableView;
})(FoodParent || (FoodParent = {}));
