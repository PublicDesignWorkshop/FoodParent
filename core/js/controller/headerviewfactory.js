var FoodParent;
(function (FoodParent) {
    var HeaderFactory = (function () {
        function HeaderFactory(args) {
            if (HeaderFactory._instance) {
                throw new Error("Error: Instantiation failed: Use HeaderFactory.getInstance() instead of new.");
            }
            HeaderFactory._instance = this;
        }
        HeaderFactory.getInstance = function () {
            return HeaderFactory._instance;
        };
        HeaderFactory.prototype.create = function (el) {
            return new FoodParent.HeaderView({ el: el });
        };
        HeaderFactory._instance = new HeaderFactory();
        return HeaderFactory;
    })();
    FoodParent.HeaderFactory = HeaderFactory;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=headerviewfactory.js.map