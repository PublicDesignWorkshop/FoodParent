var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Place = (function (_super) {
        __extends(Place, _super);
        function Place(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "place.php";
            this.isSavable = true;
            var self = this;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "lat": 0,
                "lng": 0,
                "name": "",
                "address": "",
                "description": "",
                "updated": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
            /*
            self.off("change");
            self.on("change", function (model: Tree, options) {
                if (self.isSavable == false) return;
                self.isSavable = false;
                model.save(
                    {},
                    {
                        wait: true,
                        success: function (tree: Tree, response: any) {
                            console.log(tree);
                            self.isSavable = true;
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            EventHandler.handleDataChange("<i>" + food.getName() + " " + tree.getName() + "</i> has been changed successfully", true);
                        },
                        error: function (error, response) {
                            self.isSavable = true;
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        },
                    }
                );
            });
            */
        }
        Place.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.lat = parseFloat(response.lat);
            response.lng = parseFloat(response.lng);
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            return _super.prototype.parse.call(this, response, options);
        };
        Place.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Place.prototype.getFoodId = function () {
            return this.get('food');
        };
        Place.prototype.getFlagId = function () {
            return this.get('flag');
        };
        Place.prototype.getOwnershipId = function () {
            return Math.floor(this.get('ownership'));
        };
        Place.prototype.getName = function () {
            return this.get('name');
        };
        Place.prototype.getLocation = function () {
            return new L.LatLng(this.getLat(), this.getLng());
        };
        Place.prototype.getLat = function () {
            return parseFloat(this.get('lat'));
        };
        Place.prototype.getLng = function () {
            return parseFloat(this.get('lng'));
        };
        Place.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Place.prototype.getDescription = function () {
            if (this.get('description') == "") {
                return "&nbsp;";
            }
            return this.get('description');
        };
        return Place;
    })(Backbone.Model);
    FoodParent.Place = Place;
    var Places = (function (_super) {
        __extends(Places, _super);
        function Places(models, options) {
            _super.call(this, models, options);
            this.url = "places.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Place;
        }
        Places.prototype.getIds = function () {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        };
        Places.prototype.filterByIds = function (idArray) {
            var self = this;
            var places = new Places(self.models);
            return places.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        };
        return Places;
    })(Backbone.Collection);
    FoodParent.Places = Places;
})(FoodParent || (FoodParent = {}));
