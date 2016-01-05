var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Flag = (function (_super) {
        __extends(Flag, _super);
        function Flag(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "flag.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "name": "",
            };
        }
        Flag.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            return _super.prototype.parse.call(this, response, options);
        };
        Flag.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Flag.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Flag.prototype.getName = function () {
            return this.get('name');
        };
        return Flag;
    })(Backbone.Model);
    FoodParent.Flag = Flag;
    var Flags = (function (_super) {
        __extends(Flags, _super);
        function Flags(models, options) {
            _super.call(this, models, options);
            this.url = "flags.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Flag;
        }
        return Flags;
    })(Backbone.Collection);
    FoodParent.Flags = Flags;
})(FoodParent || (FoodParent = {}));
