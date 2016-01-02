module FoodParent {
    export interface ReverseGeoLocation {
        city: string;
        country: string;
        county: string;
        postcode: string;
        road: string;
        state: string;
        latitude: string;
        longitude: string;
    }
    export class GeoLocation {
        private static _instance: GeoLocation = new GeoLocation();
        private static TAG: string = "GeoLocation - ";
        private bDebug: boolean = true;
        private xhrPool: Array<JQueryXHR>;
        constructor(args?: any) {
            if (GeoLocation._instance) {
                throw new Error("Error: Instantiation failed: Use GeoLocation.getInstance() instead of new.");
            }
            GeoLocation._instance = this;
            GeoLocation._instance.xhrPool = new Array<JQueryXHR>();
        }
        public static getInstance(): GeoLocation {
            return GeoLocation._instance;
        }
        public static reverseGeocoding(coordinate: L.LatLng, success?: Function, error?: Function): void {
            var jqxhr = $.getJSON(Setting.getReverseGeoCodingAddress(coordinate), function (data) {
                //console.log(data);
                if (success) {
                    success({
                        city: data.address.city,
                        country: data.address.country,
                        county: data.address.county,
                        postcode: data.address.postcode,
                        road: data.address.road,
                        state: data.address.state,
                        latitude: data.lat,
                        longitude: data.lon
                    });
                }
            }).fail(function () {
                if (error) {
                    error();
                }
            });
        }
    }
}