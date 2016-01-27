var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Donation = (function (_super) {
        __extends(Donation, _super);
        function Donation(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "donation.php";
            this.isSavable = true;
            var self = this;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "place": 0,
                "tree": 0,
                "quantity": 0,
                "date": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Donation.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.trees = response.tree.split(',');
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            return _super.prototype.parse.call(this, response, options);
        };
        Donation.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            console.log(clone["trees"]);
            clone["tree"] = clone["trees"].toString();
            console.log(clone["tree"]);
            delete clone["trees"];
            return clone;
        };
        Donation.prototype.getPlaceId = function () {
            return parseFloat(this.get('place'));
        };
        Donation.prototype.getTreeIds = function () {
            return this.get("trees");
        };
        Donation.prototype.addTreeId = function (id) {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array());
            }
            this.get("trees").push(id);
        };
        Donation.prototype.removeTreeId = function (id) {
            var temp = _.reject(this.get("trees"), function (obj) { return parseInt(obj) == id; });
            this.set("trees", temp);
        };
        Donation.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Donation.prototype.getQuantity = function () {
            return parseFloat(this.get('quantity'));
        };
        Donation.prototype.setQuantity = function (quantity) {
            this.set('quantity', quantity);
        };
        Donation.prototype.setDate = function (date) {
            this.set('date', date);
        };
        Donation.prototype.getDateForDatePicker = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateForDatePicker());
        };
        Donation.prototype.getFormattedDate = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateFormat());
        };
        Donation.prototype.getFormattedDateTime = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateTimeFormat());
        };
        Donation.prototype.getFormattedHourTime = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateHourFormat());
        };
        Donation.prototype.getDateValueOf = function () {
            return moment(this.get('date')).valueOf();
        };
        return Donation;
    })(Backbone.Model);
    FoodParent.Donation = Donation;
    var Donations = (function (_super) {
        __extends(Donations, _super);
        function Donations(models, options) {
            _super.call(this, models, options);
            this.url = "donations.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Donation;
        }
        Donations.prototype.getIds = function () {
            var self = this;
            var result = Array();
            $.each(self.models, function (index, model) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        };
        Donations.prototype.filterByIds = function (idArray) {
            var self = this;
            var donations = new Donations(self.models);
            return donations.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        };
        return Donations;
    })(Backbone.Collection);
    FoodParent.Donations = Donations;
})(FoodParent || (FoodParent = {}));
