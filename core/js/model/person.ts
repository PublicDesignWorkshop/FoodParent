module FoodParent {
    export class Person extends Backbone.Model {
        url: string = "person.php";
        public isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var that: Person = this;
            this.url = Setting.getInstance().getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "auth": 0,
                "name": "",
                "address": "",
                "contact": "",
                "neightboorhood": "",
                "updated": moment(new Date()).format(Setting.getInstance().getDateTimeFormat()),
            };

            that.off("change");
            that.on("change", function (model: Person, options) {
                if (that.isSavable == false) return;

                //var attributes = model.attributes;
                //attributes.auth = parseInt(attributes.auth);
                //attributes.updated = moment(new Date()).format(Setting.getInstance().getDateTimeFormat());
                that.isSavable = false;
                model.save(
                    {},
                    {
                        wait: true,
                        success: function (model: Person, response: any) {
                            console.log(model);
                            model.isSavable = true;
                        },
                        error: function (error, response) {
                        },
                    }
                    );
            });

        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.auth = parseInt(response.auth);
            response.updated = moment(response.updated).format(Setting.getInstance().getDateTimeFormat());

            response.trees = Model.getInstance().getAdopts().getTreeIds(response.id);

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
            return Math.floor(this.id);
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
        public getNeightboorhood(): string {
            var that: Person = this;
            return this.get('neightboorhood');
        }
    }
    export class Persons extends Backbone.Collection<Person> {
        url: string = "persons.php";
        constructor(models?: Person[], options?: any) {
            super(models, options);
            this.url = Setting.getInstance().getPhpDir() + this.url;
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

        public updateTrees(): void {
            var that: Persons = this;
            $.each(that.models, function (index: number, model: Person) {
                model.attributes.trees = Model.getInstance().getAdopts().getTreeIds(model.id);
            });
        }
    }
}