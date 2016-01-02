var FoodParent;
(function (FoodParent) {
    var GeoLocation = (function () {
        function GeoLocation(args) {
            this.bDebug = true;
            if (GeoLocation._instance) {
                throw new Error("Error: Instantiation failed: Use GeoLocation.getInstance() instead of new.");
            }
            GeoLocation._instance = this;
            GeoLocation._instance.xhrPool = new Array();
        }
        GeoLocation.getInstance = function () {
            return GeoLocation._instance;
        };
        GeoLocation.reverseGeocoding = function (coordinate, success, error) {
            var jqxhr = $.getJSON(FoodParent.Setting.getReverseGeoCodingAddress(coordinate), function (data) {
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
        };
        GeoLocation._instance = new GeoLocation();
        GeoLocation.TAG = "GeoLocation - ";
        return GeoLocation;
    })();
    FoodParent.GeoLocation = GeoLocation;
})(FoodParent || (FoodParent = {}));
