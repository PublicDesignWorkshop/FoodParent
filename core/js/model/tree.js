var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "tree.php";
            this.isSavable = true;
            var self = this;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "lat": 0,
                "lng": 0,
                "address": "",
                "food": 0,
                "type": 0,
                "flag": 0,
                "owner": 0,
                "ownership": 0,
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
                        self.isSavable = true;
                    },
                    error: function (error, response) {
                    },
                });
            });
        }
        Tree.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.lat = parseFloat(response.lat);
            response.lng = parseFloat(response.lng);
            response.food = parseInt(response.food);
            response.type = parseInt(response.type);
            response.flag = parseInt(response.flag);
            response.owner = parseInt(response.owner);
            response.ownership = parseInt(response.ownership);
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            response.owners = FoodParent.Model.getAdopts().getOwnerIds(response.id);
            return _super.prototype.parse.call(this, response, options);
        };
        Tree.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            delete clone["owners"];
            return clone;
        };
        Tree.prototype.getFoodId = function () {
            return this.get('food');
        };
        Tree.prototype.getFlagId = function () {
            return this.get('flag');
        };
        Tree.prototype.getOwnershipId = function () {
            return Math.floor(this.get('ownership'));
        };
        Tree.prototype.getName = function () {
            var self = this;
            return ' #' + self.getId();
        };
        Tree.prototype.getLat = function () {
            return parseFloat(this.get('lat'));
        };
        Tree.prototype.getLng = function () {
            return parseFloat(this.get('lng'));
        };
        Tree.prototype.getId = function () {
            return Math.floor(this.id);
        };
        Tree.prototype.getLocation = function () {
            return new L.LatLng(this.getLat(), this.getLng());
        };
        return Tree;
    })(Backbone.Model);
    FoodParent.Tree = Tree;
    var Trees = (function (_super) {
        __extends(Trees, _super);
        function Trees(models, options) {
            _super.call(this, models, options);
            this.url = "trees.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Tree;
        }
        Trees.prototype.getIds = function () {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        };
        Trees.prototype.getFoodIds = function () {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (result.indexOf(model.getFoodId()) == -1) {
                    result.push(model.getFoodId());
                }
            });
            return result;
        };
        Trees.prototype.getFlagIds = function () {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (result.indexOf(model.getFlagId()) == -1) {
                    result.push(model.getFlagId());
                }
            });
            return result;
        };
        Trees.prototype.filterById = function (idArray) {
            var self = this;
            var trees = new Trees(self.models);
            return trees.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        };
        Trees.prototype.getAssigned = function (trees) {
            var self = this;
            $.each(self.models, function (index, model) {
                if (model.get('owners').length >= 1) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        };
        Trees.prototype.getUnassigned = function (trees) {
            var self = this;
            $.each(self.models, function (index, model) {
                if (model.get('owners').length == 0) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        };
        Trees.prototype.getFromFoodId = function (trees, id) {
            var self = this;
            $.each(self.models, function (index, model) {
                if (model.getFoodId() == id) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        };
        return Trees;
    })(Backbone.Collection);
    FoodParent.Trees = Trees;
})(FoodParent || (FoodParent = {}));
