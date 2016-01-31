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
            this.sortType = FoodParent.SortType.ASCENDING;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Flag;
        }
        Flags.prototype.comparator = function (model) {
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
        Flags.prototype.sortByDescendingName = function () {
            var that = this;
            that.sortType = FoodParent.SortType.DESCENDING;
            that.sort();
        };
        Flags.prototype.sortByAscendingName = function () {
            var self = this;
            //that.sortType = SortType.ASCENDING;
            //that.sort();
            self.models = _.sortBy(self.models, 'name');
        };
        return Flags;
    })(Backbone.Collection);
    FoodParent.Flags = Flags;
})(FoodParent || (FoodParent = {}));
