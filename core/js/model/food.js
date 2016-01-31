var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Food = (function (_super) {
        __extends(Food, _super);
        function Food(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "food.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "name": "",
                "icon": "",
                "description": "",
                "updated": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Food.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            return _super.prototype.parse.call(this, response, options);
        };
        Food.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        };
        Food.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Food.prototype.getName = function () {
            return this.get('name');
        };
        Food.prototype.getIconPath = function () {
            return FoodParent.Setting.getContentIconDir() + this.get('icon');
        };
        return Food;
    })(Backbone.Model);
    FoodParent.Food = Food;
    var Foods = (function (_super) {
        __extends(Foods, _super);
        function Foods(models, options) {
            _super.call(this, models, options);
            this.url = "foods.php";
            this.sortType = FoodParent.SortType.ASCENDING;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Food;
        }
        Foods.prototype.getUndetectedIds = function (ids) {
            var that = this;
            var result = Array();
            result = ids;
            $.each(that.models, function (index, model) {
                var i = result.indexOf(model.getId());
                if (i != -1) {
                    result.splice(i, 1);
                }
            });
            return result;
        };
        Foods.prototype.toArray = function () {
            var that = this;
            var result = new Array();
            $.each(that.models, function (index, model) {
                result.push([model.getName(), model.getId()]);
            });
            return result;
        };
        Foods.prototype.comparator = function (model) {
            var that = this;
            switch (that.sortType) {
                case FoodParent.SortType.NONE:
                    return 0;
                    break;
                case FoodParent.SortType.ASCENDING:
                    return model.get('name');
                    break;
                case FoodParent.SortType.DESCENDING:
                    return -model.get('name');
                    break;
            }
        };
        Foods.prototype.sortByDescendingName = function () {
            var that = this;
            that.sortType = FoodParent.SortType.DESCENDING;
            that.sort();
        };
        Foods.prototype.sortByAscendingName = function () {
            var self = this;
            //that.sortType = SortType.ASCENDING;
            //that.sort();
            self.models = _.sortBy(self.models, 'name');
        };
        return Foods;
    })(Backbone.Collection);
    FoodParent.Foods = Foods;
})(FoodParent || (FoodParent = {}));
