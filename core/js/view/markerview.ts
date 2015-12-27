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
        public static create(id: number, name: string, icon: L.Icon, location: L.LatLng, bCloseOnClick: boolean): L.Marker {
            var template = _.template(Template.getManageTreesPopupTemplate());
            var data = {
                id: id,
                name: name,
            }
            return new L.Marker(
                location,
                {
                    id: id,
                    icon: icon,
                    draggable: false,
                    riseOnHover: true,
                })
                .bindPopup(template(data),
                {
                    closeButton: false,
                    closeOnClick: bCloseOnClick,
                });
        }
    }
}