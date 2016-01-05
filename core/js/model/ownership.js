var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Ownership = (function (_super) {
        __extends(Ownership, _super);
        function Ownership(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "ownership.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "name": "",
            };
        }
        Ownership.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            return _super.prototype.parse.call(this, response, options);
        };
        Ownership.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Ownership.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Ownership.prototype.getName = function () {
            return this.get('name');
        };
        return Ownership;
    })(Backbone.Model);
    FoodParent.Ownership = Ownership;
    var Ownerships = (function (_super) {
        __extends(Ownerships, _super);
        function Ownerships(models, options) {
            _super.call(this, models, options);
            this.url = "ownerships.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Ownership;
        }
        return Ownerships;
    })(Backbone.Collection);
    FoodParent.Ownerships = Ownerships;
})(FoodParent || (FoodParent = {}));
