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
        MapViewFactory.prototype.create = function (el, bCentered) {
            var view = new FoodParent.MapView({ el: el });
            view.setIsCentered(true);
            return view;
        };
        MapViewFactory.prototype.create2 = function (el, bCentered) {
            var view = new FoodParent.MapView({ el: el });
            view.setIsCentered(false);
            return view;
        };
        MapViewFactory._instance = new MapViewFactory();
        return MapViewFactory;
    })();
    FoodParent.MapViewFactory = MapViewFactory;
})(FoodParent || (FoodParent = {}));
