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
                "type": 0,
                "place": 0,
                "tree": 0,
                "quantity": 0,
                "picture": '',
                "date": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Donation.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.type = parseInt(response.type);
            response.place = parseInt(response.place);
            response.quantity = parseFloat(response.quantity);
            response.trees = response.tree.split(',').map(function (item) {
                return parseInt(item);
            });
            response.pictures = Array();
            if (response.picture != "") {
                response.pictures = response.picture.split(",");
            }
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            return _super.prototype.parse.call(this, response, options);
        };
        Donation.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            clone["trees"] = _.sortBy(clone["trees"], function (obj) { return parseInt(obj); });
            clone["tree"] = clone["trees"].toString();
            delete clone["trees"];
            if (clone["pictures"]) {
                clone["picture"] = clone["pictures"].toString();
            }
            delete clone["pictures"];
            return clone;
        };
        Donation.prototype.getPlaceId = function () {
            return parseFloat(this.get('place'));
        };
        Donation.prototype.getTreeIds = function () {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array());
            }
            return this.get("trees");
        };
        Donation.prototype.getType = function () {
            return Math.floor(this.get("type"));
        };
        Donation.prototype.setType = function (type) {
            this.set('type', type);
        };
        Donation.prototype.getComment = function () {
            var self = this;
            var comment = "<strong>" + self.getQuantity() + " lbs.</strong> of ";
            var treeIds = self.getTreeIds();
            $.each(treeIds, function (index, treeId) {
                var tree = FoodParent.Model.getTrees().findWhere({ id: Math.floor(treeId) });
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (index == 0) {
                    if (treeIds.length == 1) {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from tree ";
                    }
                    else {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from trees ";
                    }
                }
                if (index < treeIds.length - 1) {
                    comment += "<strong>" + tree.getName() + "</strong>, ";
                }
                else {
                    comment += "<strong>" + tree.getName() + "</strong>.";
                }
            });
            return comment;
        };
        Donation.prototype.getCommentWithDate = function () {
            var self = this;
            var comment = "<strong>" + self.getQuantity() + " lbs.</strong> of ";
            var treeIds = self.getTreeIds();
            $.each(treeIds, function (index, treeId) {
                var tree = FoodParent.Model.getTrees().findWhere({ id: Math.floor(treeId) });
                var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (index == 0) {
                    if (treeIds.length == 1) {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from tree ";
                    }
                    else {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from trees ";
                    }
                }
                if (index < treeIds.length - 1) {
                    comment += "<strong>" + tree.getName() + "</strong>, ";
                }
                else {
                    comment += "<strong>" + tree.getName() + "</strong> ";
                }
            });
            comment += "(" + self.getFormattedDate() + ")";
            return comment;
        };
        Donation.prototype.addTreeId = function (id) {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array());
            }
            if (this.get("trees").indexOf(id) < 0) {
                this.get("trees").push(id);
            }
        };
        Donation.prototype.hasTreeId = function (id) {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array());
            }
            if (this.get("trees").indexOf(id) < 0) {
                return false;
            }
            return true;
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
        Donation.prototype.getCumulativeQuantity = function () {
            var self = this;
            var donations = new Donations(FoodParent.Model.getDonations().where({ place: self.getPlaceId() }));
            donations.sortByAscendingDate();
            var total = 0;
            $.each(donations.models, function (index, donation) {
                if (self.getEndOfDateValueOf() >= donation.getStartOfDateValueOf()) {
                    total += donation.getQuantity();
                }
                else {
                    return total;
                }
            });
            return total;
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
        Donation.prototype.getStartOfDateValueOf = function () {
            return moment(this.get('date')).startOf('day').valueOf();
        };
        Donation.prototype.getEndOfDateValueOf = function () {
            return moment(this.get('date')).endOf('day').valueOf();
        };
        Donation.prototype.addPicture = function (filename) {
            if (this.get('pictures') == undefined) {
                this.set('pictures', new Array());
            }
            this.get('pictures').push(filename);
        };
        Donation.prototype.getPictures = function () {
            if (this.get('pictures') == undefined) {
                this.set('pictures', new Array());
            }
            return this.get('pictures');
        };
        Donation.prototype.getPicture = function (index) {
            return this.get('pictures')[index];
        };
        Donation.prototype.removePicture = function (filename) {
            var self = this;
            self.set('pictures', _.without(self.getPictures(), filename));
        };
        Donation.prototype.setCover = function (index) {
            var self = this;
            var picture = self.getPictures()[index];
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        };
        Donation.prototype.setCoverPicture = function (picture) {
            var self = this;
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        };
        return Donation;
    })(Backbone.Model);
    FoodParent.Donation = Donation;
    var Donations = (function (_super) {
        __extends(Donations, _super);
        function Donations(models, options) {
            _super.call(this, models, options);
            this.url = "donations.php";
            this.sortType = FoodParent.SortType.NONE;
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
        Donations.prototype.comparator = function (model) {
            var self = this;
            switch (self.sortType) {
                case FoodParent.SortType.NONE:
                    return 0;
                    break;
                case FoodParent.SortType.ASCENDING:
                    return model.getDateValueOf();
                    break;
                case FoodParent.SortType.DESCENDING:
                    return -model.getDateValueOf();
                    break;
            }
        };
        Donations.prototype.sortByDescendingDate = function () {
            var self = this;
            self.sortType = FoodParent.SortType.DESCENDING;
            self.sort();
        };
        Donations.prototype.sortByAscendingDate = function () {
            var self = this;
            self.sortType = FoodParent.SortType.ASCENDING;
            self.sort();
        };
        Donations.prototype.getLatestDonationOfDate = function (placeId, date) {
            var self = this;
            if (self.models.length == 0) {
                return null;
            }
            self.sortByAscendingDate();
            var result = null;
            $.each(self.models, function (index, donation) {
                if (date > donation.getDateValueOf() && donation.getPlaceId() == placeId) {
                    result = donation;
                }
                else {
                    return result;
                }
            });
            return result;
        };
        return Donations;
    })(Backbone.Collection);
    FoodParent.Donations = Donations;
})(FoodParent || (FoodParent = {}));
