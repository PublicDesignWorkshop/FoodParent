module FoodParent {
    export class MarkerViewFactory {
        private static _instance: MarkerViewFactory = new MarkerViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (MarkerViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use MarkerViewFactory.getInstance() instead of new.");
            }
            MarkerViewFactory._instance = this;
        }
        public static getInstance(): MarkerViewFactory {
            return MarkerViewFactory._instance;
        }
        public create(tree: Tree): Backbone.View<Backbone.Model> {
            var view = new MarkerView();
            var food: Food = Model.getInstance().getFoods().findWhere({id: tree.getFoodId() });
            var icon: L.Icon = new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: Setting.getInstance().getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, -40),
            });
            view.create(
                tree.getId(),
                food.getName() + tree.getName(), 
                icon,
                tree.getLat(), 
                tree.getLng()
                );
            return view;
        }

        public create2(tree: Tree): Backbone.View<Backbone.Model> {
            var view = new MarkerView();
            var food: Food = Model.getInstance().getFoods().findWhere({ id: tree.getFoodId() });
            var icon: L.Icon = new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: Setting.getInstance().getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, -40),
            });
            view.create2(
                tree.getId(),
                food.getName() + tree.getName(),
                icon,
                tree.getLat(),
                tree.getLng()
                );
            return view;
        }
    }
} 