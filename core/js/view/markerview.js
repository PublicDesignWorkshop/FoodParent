var FoodParent;
(function (FoodParent) {
    var MarkerFractory = (function () {
        function MarkerFractory(args) {
            if (MarkerFractory._instance) {
                throw new Error("Error: Instantiation failed: Use MarkerFractory.getInstance() instead of new.");
            }
            MarkerFractory._instance = this;
        }
        MarkerFractory.getInstance = function () {
            return MarkerFractory._instance;
        };
        MarkerFractory.getIcon = function (food) {
            return new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: FoodParent.Setting.getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, 48),
            });
        };
        MarkerFractory.create = function (tree, bCloseOnClick) {
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            var icon = new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: FoodParent.Setting.getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, 48),
            });
            var template = _.template(FoodParent.Template.getManageTreesPopupTemplate());
            var data = {
                id: tree.getId()
            };
            var marker = new L.Marker(tree.getLocation(), {
                id: tree.getId(),
                icon: icon,
                draggable: false,
                riseOnHover: true,
            })
                .bindPopup(template(data), {
                closeButton: false,
                closeOnClick: bCloseOnClick,
            })
                .bindLabel(food.getName() + " " + tree.getName(), {
                clickable: true,
                noHide: true,
                direction: 'right'
            });
            marker.on('dragend', function (e) {
                this.openPopup();
            });
            L.DomEvent.addListener(marker.label, 'click', function (e) { this.togglePopup(); }, marker);
            return marker;
        };
        MarkerFractory.create2 = function (tree, bCloseOnClick) {
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            var icon = new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: FoodParent.Setting.getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, 48),
            });
            var template = _.template(FoodParent.Template.getManageTreesPopupTemplate2());
            var data = {
                id: tree.getId()
            };
            var marker = new L.Marker(tree.getLocation(), {
                id: tree.getId(),
                icon: icon,
                draggable: false,
                riseOnHover: true,
            })
                .bindPopup(template(data), {
                closeButton: false,
                closeOnClick: bCloseOnClick,
            })
                .bindLabel(food.getName() + " " + tree.getName(), {
                clickable: true,
                noHide: true,
                direction: 'right'
            });
            marker.on('dragend', function (e) {
                this.openPopup();
            });
            L.DomEvent.addListener(marker.label, 'click', function (e) { this.togglePopup(); }, marker);
            return marker;
        };
        MarkerFractory._instance = new MarkerFractory();
        return MarkerFractory;
    })();
    FoodParent.MarkerFractory = MarkerFractory;
})(FoodParent || (FoodParent = {}));
