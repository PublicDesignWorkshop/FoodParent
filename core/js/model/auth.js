var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Auth = (function (_super) {
        __extends(Auth, _super);
        //url: string = "food.php";
        function Auth(attributes, options) {
            _super.call(this, attributes, options);
            //this.url = Setting.getInstance().getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "name": ""
            };
        }
        Auth.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            return _super.prototype.parse.call(this, response, options);
        };
        Auth.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Auth.prototype.getId = function () {
            return Math.floor(this.id);
        };
        Auth.prototype.getName = function () {
            return this.get('name');
        };
        return Auth;
    })(Backbone.Model);
    FoodParent.Auth = Auth;
    var Auths = (function (_super) {
        __extends(Auths, _super);
        //url: string = "foods.php";
        function Auths(models, options) {
            _super.call(this, models, options);
            //this.url = Setting.getInstance().getPhpDir() + this.url;
            this.model = Auth;
        }
        Auths.prototype.toArray = function () {
            var self = this;
            var result = new Array();
            $.each(self.models, function (index, model) {
                result.push([model.getName(), model.getId()]);
            });
            return result;
        };
        return Auths;
    })(Backbone.Collection);
    FoodParent.Auths = Auths;
})(FoodParent || (FoodParent = {}));
