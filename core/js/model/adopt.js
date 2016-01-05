var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Adopt = (function (_super) {
        __extends(Adopt, _super);
        function Adopt(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "adopt.php";
            var self = this;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "tree": "",
                "parent": "",
                "updated": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Adopt.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.tree = parseInt(response.tree);
            response.parent = parseInt(response.parent);
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            return _super.prototype.parse.call(this, response, options);
        };
        Adopt.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Adopt.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Adopt.prototype.getTreeId = function () {
            var self = this;
            return Math.floor(self.get('tree'));
        };
        Adopt.prototype.getParentId = function () {
            var self = this;
            return Math.floor(self.get('parent'));
        };
        return Adopt;
    })(Backbone.Model);
    FoodParent.Adopt = Adopt;
    var Adopts = (function (_super) {
        __extends(Adopts, _super);
        function Adopts(models, options) {
            _super.call(this, models, options);
            this.url = "adopts.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Adopt;
        }
        Adopts.prototype.getIds = function () {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        };
        Adopts.prototype.getTreeIds = function (personId) {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (model.getParentId() == personId) {
                    if (result.indexOf(model.getTreeId()) == -1) {
                        result.push(model.getTreeId());
                    }
                }
            });
            return result;
        };
        Adopts.prototype.getParentIds = function (treeId) {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (model.getTreeId() == treeId) {
                    if (result.indexOf(model.getParentId()) == -1) {
                        result.push(model.getParentId());
                    }
                }
            });
            return result;
        };
        return Adopts;
    })(Backbone.Collection);
    FoodParent.Adopts = Adopts;
})(FoodParent || (FoodParent = {}));
