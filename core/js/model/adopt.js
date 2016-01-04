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
            this.isSavable = true;
            var self = this;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "tree": "",
                "owner": "",
                "updated": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
            self.off("change");
            self.on("change", function (model, options) {
                if (self.isSavable == false)
                    return;
                self.isSavable = false;
                model.save({}, {
                    wait: true,
                    success: function (model, response) {
                        console.log(model);
                        model.isSavable = true;
                    },
                    error: function (error, response) {
                    },
                });
            });
        }
        Adopt.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.tree = parseInt(response.tree);
            response.owner = parseInt(response.owner);
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
            return Math.floor(this.id);
        };
        Adopt.prototype.getTreeId = function () {
            var self = this;
            return Math.floor(self.get('tree'));
        };
        Adopt.prototype.getOwnerId = function () {
            var self = this;
            return Math.floor(self.get('owner'));
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
        Adopts.prototype.getTreeIds = function (ownerId) {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (model.getOwnerId() == ownerId) {
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
                    if (result.indexOf(model.getOwnerId()) == -1) {
                        result.push(model.getOwnerId());
                    }
                }
            });
            return result;
        };
        return Adopts;
    })(Backbone.Collection);
    FoodParent.Adopts = Adopts;
})(FoodParent || (FoodParent = {}));
