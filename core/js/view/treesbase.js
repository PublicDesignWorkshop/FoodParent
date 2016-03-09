var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var TreesViewFractory = (function () {
        function TreesViewFractory(args) {
            if (TreesViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesViewFractory.getInstance() instead of new.");
            }
            TreesViewFractory._instance = this;
        }
        TreesViewFractory.getInstance = function () {
            return TreesViewFractory._instance;
        };
        TreesViewFractory.create = function (el, viewMode, id, credential) {
            var view;
            if (viewMode == FoodParent.VIEW_MODE.MAP) {
                if (credential == FoodParent.CREDENTIAL_MODE.GUEST) {
                    view = new FoodParent.TreesMapViewForGuest({ el: el });
                }
                else if (credential == FoodParent.CREDENTIAL_MODE.PARENT) {
                    view = new FoodParent.TreesMapViewForParent({ el: el });
                }
                else if (credential == FoodParent.CREDENTIAL_MODE.ADMIN) {
                    view = new FoodParent.TreesMapViewForParent({ el: el });
                }
                view.setTreeId(id);
            }
            else if (viewMode == FoodParent.VIEW_MODE.TABLE) {
                //view = new ManageTreesTableView({ el: el });
                view.setTreeId(id);
            }
            return view;
        };
        TreesViewFractory._instance = new TreesViewFractory();
        return TreesViewFractory;
    })();
    FoodParent.TreesViewFractory = TreesViewFractory;
    var TreesView = (function (_super) {
        __extends(TreesView, _super);
        function TreesView() {
            _super.apply(this, arguments);
            this.renderTreeInfo = function (tree) { };
            this.removeTreeInfo = function () { };
            this.renderFilterList = function () { };
            this.closeMapFilter = function () { };
        }
        TreesView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            return self;
        };
        TreesView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            return self;
        };
        TreesView.prototype.resize = function () {
            _super.prototype.resize.call(this);
            var self = this;
        };
        TreesView.prototype.setTreeId = function (id) {
            this._id = id;
        };
        TreesView.prototype._applyFilter = function (event) { };
        return TreesView;
    })(FoodParent.BaseView);
    FoodParent.TreesView = TreesView;
})(FoodParent || (FoodParent = {}));
