module FoodParent {
    export class MarkerView extends Backbone.View<Backbone.Model> {
        marker: L.Marker;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var that: MarkerView = this;
        }
        public create(id: number, name: string, icon: L.Icon, lat: number, lng: number): void {
            var that: MarkerView = this;

            var template = _.template(Template.getInstance().getMapPopupTemplate());
            var data = {
                name: name,
                id: id,
            }
            that.marker = new L.Marker(new L.LatLng(lat, lng),
                {
                    icon: icon,
                    draggable: false,
                    riseOnHover: true,
                    name: name,
                    id: id,
                })
                .bindPopup(template(data),
                {
                    closeButton: false,
                });

        }

        public create2(id: number, name: string, icon: L.Icon, lat: number, lng: number): void {
            var that: MarkerView = this;

            var template = _.template(Template.getInstance().getSmallMapPopupTemplate());
            var data = {
                name: name,
                id: id,
            }
            that.marker = new L.Marker(new L.LatLng(lat, lng),
                {
                    icon: icon,
                    draggable: false,
                    riseOnHover: true,
                    closeOnClick: false,
                    name: name,
                    id: id,
                })
                .bindPopup(template(data),
                {
                    closeButton: false,
                    closeOnClick: false,
                });

        }

        public getMarker(): L.Marker {
            return this.marker;
        }
    }
}