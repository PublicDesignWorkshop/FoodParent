var FoodParent;
(function (FoodParent) {
    var MapViewFactory = (function () {
        function MapViewFactory(args) {
            if (MapViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use MapViewFactory.getInstance() instead of new.");
            }
            MapViewFactory._instance = this;
        }
        MapViewFactory.getInstance = function () {
            return MapViewFactory._instance;
        };
        MapViewFactory.prototype.create = function (el) {
            return new FoodParent.MapView({ el: el });
        };
        MapViewFactory._instance = new MapViewFactory();
        return MapViewFactory;
    })();
    FoodParent.MapViewFactory = MapViewFactory;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=mapviewfactory.js.map