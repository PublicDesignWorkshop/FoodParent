var FoodParent;
(function (FoodParent) {
    var TreesViewFactory = (function () {
        function TreesViewFactory(args) {
            if (TreesViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use TreesViewFactory.getInstance() instead of new.");
            }
            TreesViewFactory._instance = this;
        }
        TreesViewFactory.getInstance = function () {
            return TreesViewFactory._instance;
        };
        TreesViewFactory.prototype.create = function (el) {
            return new FoodParent.TreesView({ el: el });
        };
        TreesViewFactory._instance = new TreesViewFactory();
        return TreesViewFactory;
    })();
    FoodParent.TreesViewFactory = TreesViewFactory;
})(FoodParent || (FoodParent = {}));
