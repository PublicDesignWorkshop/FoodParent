var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Person = (function (_super) {
        __extends(Person, _super);
        function Person(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "person.php";
            this.isSavable = true;
            var that = this;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "auth": 0,
                "name": "",
                "address": "",
                "contact": "",
                "neighborhood": "",
                "updated": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Person.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.auth = parseInt(response.auth);
            response.updated = moment(response.updated).format(FoodParent.Setting.getDateTimeFormat());
            response.trees = FoodParent.Model.getAdopts().getTreeIds(response.id);
            return _super.prototype.parse.call(this, response, options);
        };
        Person.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            delete clone["trees"];
            return clone;
        };
        Person.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Person.prototype.getAuth = function () {
            var that = this;
            return Math.floor(this.get('auth'));
        };
        Person.prototype.getName = function () {
            var that = this;
            return this.get('name');
        };
        Person.prototype.getAddress = function () {
            var that = this;
            return this.get('address');
        };
        Person.prototype.getContact = function () {
            var that = this;
            return this.get('contact');
        };
        Person.prototype.getNeighboorhood = function () {
            var that = this;
            return this.get('neighborhood');
        };
        return Person;
    })(Backbone.Model);
    FoodParent.Person = Person;
    var Persons = (function (_super) {
        __extends(Persons, _super);
        function Persons(models, options) {
            _super.call(this, models, options);
            this.url = "persons.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Person;
        }
        Persons.prototype.getIds = function () {
            var that = this;
            var result = Array();
            $.each(that.models, function (index, model) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        };
        Persons.prototype.getAssigned = function (persons) {
            var that = this;
            $.each(that.models, function (index, model) {
                if (model.get('trees').length >= 1) {
                    if (persons.where({ id: model.getId() }) != undefined) {
                        persons.add(model);
                    }
                }
            });
            return persons;
        };
        Persons.prototype.getUnassigned = function (persons) {
            var that = this;
            $.each(that.models, function (index, model) {
                if (model.get('trees').length == 0) {
                    if (persons.where({ id: model.getId() }) != undefined) {
                        persons.add(model);
                    }
                }
            });
            return persons;
        };
        Persons.prototype.filterByAuthIds = function (idArray) {
            var self = this;
            var persons = new Persons(self.models);
            return new Persons(persons.filter(function (person, index) {
                if ($.inArray(person.getAuth(), idArray) > -1) {
                    return true;
                }
                return false;
            }));
        };
        Persons.prototype.filterByAdoptStatus = function (idArray) {
            var self = this;
            var persons = new Persons();
            $.each(self.models, function (index, person) {
                if ($.inArray(0, idArray) > -1) {
                    if (person.get('trees').length == 0) {
                        if (persons.where({ id: person.getId() }) != undefined) {
                            persons.add(person);
                        }
                    }
                }
                if ($.inArray(1, idArray) > -1) {
                    if (person.get('trees').length >= 1) {
                        if (persons.where({ id: person.getId() }) != undefined) {
                            persons.add(person);
                        }
                    }
                }
            });
            return persons;
        };
        Persons.prototype.filterByAdoptStatusForTree = function (idArray, treeId) {
            var self = this;
            var persons = new Persons();
            $.each(self.models, function (index, person) {
                if ($.inArray(0, idArray) > -1) {
                    console.log($.inArray(treeId, person.get('trees')));
                    if (person.get('trees').length == 0 || $.inArray(treeId, person.get('trees')) < 0) {
                        if (persons.where({ id: person.getId() }) != undefined) {
                            persons.add(person);
                        }
                    }
                }
                if ($.inArray(1, idArray) > -1) {
                    if ($.inArray(treeId, person.get('trees')) > -1) {
                        if (persons.where({ id: person.getId() }) != undefined) {
                            persons.add(person);
                        }
                    }
                }
            });
            return persons;
        };
        Persons.prototype.updateTrees = function () {
            var self = this;
            $.each(self.models, function (index, model) {
                model.attributes.trees = FoodParent.Model.getAdopts().getTreeIds(model.id);
            });
        };
        Persons.prototype.filterByIds = function (idArray) {
            var self = this;
            var persons = new Persons(self.models);
            return persons.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        };
        return Persons;
    })(Backbone.Collection);
    FoodParent.Persons = Persons;
})(FoodParent || (FoodParent = {}));
