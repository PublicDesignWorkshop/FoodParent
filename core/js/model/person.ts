module FoodParent {
    export class Person extends Backbone.Model {
        url: string = "person.php";
        public isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var that: Person = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "auth": 0,
                "name": "",
                "address": "",
                "contact": "",
                "neighborhood": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.auth = parseInt(response.auth);
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());

            response.trees = Model.getAdopts().getTreeIds(response.id);

            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            delete clone["trees"];
            return clone;
        }
        public getId(): number {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }
        public getAuth(): number {
            var that: Person = this;
            return Math.floor(this.get('auth'));
        }
        public getName(): string {
            var that: Person = this;
            return this.get('name');
        }
        public getAddress(): string {
            var that: Person = this;
            return this.get('address');
        }
        public getContact(): string {
            var that: Person = this;
            return this.get('contact');
        }
        public getNeighboorhood(): string {
            var that: Person = this;
            return this.get('neighborhood');
        }
    }
    export class Persons extends Backbone.Collection<Person> {
        url: string = "persons.php";
        constructor(models?: Person[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Person;
        }

        public getIds(): Array<number> {
            var that: Persons = this;
            var result = Array<number>();
            $.each(that.models, function (index: number, model: Person) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }

        public getAssigned(persons: Persons): Persons {
            var that: Persons = this;
            $.each(that.models, function (index: number, model: Person) {
                if (model.get('trees').length >= 1) {
                    if (persons.where({ id: model.getId() }) != undefined) {
                        persons.add(model);
                    }
                }
            });
            return persons;
        }

        public getUnassigned(persons: Persons): Persons {
            var that: Persons = this;
            $.each(that.models, function (index: number, model: Person) {
                if (model.get('trees').length == 0) {
                    if (persons.where({ id: model.getId() }) != undefined) {
                        persons.add(model);
                    }
                }
            });
            return persons;
        }

        public filterByAuthIds(idArray): Persons {
            var self: Persons = this;
            var persons: Persons = new Persons(self.models);
            return new Persons(persons.filter(function (person: Person, index: number) {
                if ($.inArray(person.getAuth(), idArray) > -1) {
                    return true;
                }
                return false;
            }));
        }

        public filterByAdoptStatus(idArray): Persons {
            var self: Persons = this;
            var persons: Persons = new Persons();
            $.each(self.models, function (index: number, person: Person) {
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
        }

        public updateTrees(): void {
            var self: Persons = this;
            $.each(self.models, function (index: number, model: Person) {
                model.attributes.trees = Model.getAdopts().getTreeIds(model.id);
            });
        }

        public filterByIds(idArray): Array<Person> {
            var self: Persons = this;
            var persons: Persons = new Persons(self.models);
            return persons.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        }
    }
}