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
        MarkerFractory.create = function (id, name, icon, location, bCloseOnClick) {
            var template = _.template(FoodParent.Template.getManageTreesPopupTemplate());
            var data = {
                id: id,
                name: name,
            };
            return new L.Marker(location, {
                id: id,
                icon: icon,
                draggable: false,
                riseOnHover: true,
            })
                .bindPopup(template(data), {
                closeButton: false,
                closeOnClick: bCloseOnClick,
            });
        };
        MarkerFractory._instance = new MarkerFractory();
        return MarkerFractory;
    })();
    FoodParent.MarkerFractory = MarkerFractory;
})(FoodParent || (FoodParent = {}));
