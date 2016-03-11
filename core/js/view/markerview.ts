module FoodParent {
    export class MarkerFractory {
        private static _instance: MarkerFractory = new MarkerFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (MarkerFractory._instance) {
                throw new Error("Error: Instantiation failed: Use MarkerFractory.getInstance() instead of new.");
            }
            MarkerFractory._instance = this;
        }
        public static getInstance(): MarkerFractory {
            return MarkerFractory._instance;
        }

        public static getIcon(food: Food): L.Icon {
            return new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: Setting.getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, 48),
            });
        }

        public static create(tree: Tree, bCloseOnClick: boolean, editable: boolean): L.Marker {
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            var icon: L.Icon = new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: Setting.getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, 48),
            });
            if (editable) {
                var template = _.template(Template.getManageTreesPopupTemplateForAdmin());
                var data = {
                    id: tree.getId()
                }
            } else {
                template = _.template(Template.getManageTreesPopupTemplate3());
                data = {
                    id: tree.getId()
                }
            }
            
            var marker: L.Marker = new L.Marker(
                tree.getLocation(),
                {
                    id: tree.getId(),
                    icon: icon,
                    draggable: false,
                    riseOnHover: true,
                })
                .bindPopup(template(data),
                {
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
            L.DomEvent.addListener(marker.label, 'click', function (e) { this.togglePopup() }, marker);
            return marker;
        }

        public static create2(tree: Tree, bCloseOnClick: boolean): L.Marker {
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            var icon: L.Icon = new L.Icon({
                iconUrl: food.getIconPath(),
                shadowUrl: Setting.getMarkerShadowPath(),
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 40),
                shadowAnchor: new L.Point(9, 38),
                popupAnchor: new L.Point(0, 48),
            });

            var template = _.template(Template.getManageTreesPopupTemplate2());
            var data = {
                id: tree.getId()
            }
            var marker: L.Marker = new L.Marker(
                tree.getLocation(),
                {
                    id: tree.getId(),
                    icon: icon,
                    draggable: false,
                    riseOnHover: true,
                })
                .bindPopup(template(data),
                {
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
            L.DomEvent.addListener(marker.label, 'click', function (e) { this.togglePopup() }, marker);
            return marker;
        }
    }
}