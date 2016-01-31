module FoodParent {
    export class Tree extends Backbone.Model {
        url: string = "tree.php";
        private isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var self: Tree = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "lat": 0,
                "lng": 0,
                "address": "",
                "food": 0,
                "type": 0,
                "flag": 0,
                "owner": 0,
                "ownership": 0,
                "description": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
            /*
            self.off("change");
            self.on("change", function (model: Tree, options) {
                if (self.isSavable == false) return;
                self.isSavable = false;
                model.save(
                    {},
                    {
                        wait: true,
                        success: function (tree: Tree, response: any) {
                            console.log(tree);
                            self.isSavable = true;
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            EventHandler.handleDataChange("<i>" + food.getName() + " " + tree.getName() + "</i> has been changed successfully", true);
                        },
                        error: function (error, response) {
                            self.isSavable = true;
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        },
                    }
                );
            });
            */

        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.lat = parseFloat(response.lat);
            response.lng = parseFloat(response.lng);
            response.food = parseInt(response.food);
            response.type = parseInt(response.type);
            response.owner = parseInt(response.owner);
            response.ownership = parseInt(response.ownership);
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());
            response.flags = Array<number>();
            if (response.flag != "") {
                response.flags = response.flag.split(',').map(function (item) {
                    return parseInt(item);
                });
            }
            
            response.parents = Model.getAdopts().getParentIds(response.id);
            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            if (clone["flags"]) {
                clone["flag"] = clone["flags"].toString();
            }
            delete clone["flags"];
            delete clone["parents"];
            return clone;
        }
        public getFoodId(): number {
            return this.get('food');
        }
        public addFlag(flag: number): void {
            if (this.get('flags') == undefined) {
                this.set('flags', new Array<number>());
            }
            if (this.get("flags").indexOf(Math.floor(flag)) < 0) {
                this.get("flags").push(Math.floor(flag));
            }
        }
        public getFlags(): Array<number> {
            if (this.get('flags') == undefined) {
                this.set('flags', new Array<number>());
            }
            return this.get('flags');
        }

        public getCopiedFlags(): Array<number> {
            if (this.get('flags') == undefined) {
                return new Array<number>();
            }
            var temp: Array<number> = new Array<number>();
            $.each(this.get('flags'), function (index: number, item: number) {
                temp.push(item);
            });
            return temp;
        }
        public setFlags(flags: Array<number>) {
            this.set('flags', flags);
        }

        public getFlag(index: number): number {
            return this.get('flags')[index];
        }
        public removeFlag(flag: number): void {
            var self: Tree = this;
            self.set('flags', _.without(self.getFlags(), Math.floor(flag)));
            if (this.get('flags').length == 0) {
                this.get('flags').push(0);
            }
        }
        /*
        public getFlagId(): number {
            return this.get('flag');
        }
        */
        public getOwnershipId(): number {
            return Math.floor(this.get('ownership'));
        }
        public getName(): string {
            var self: Tree = this;
            return ' #' + self.getId();
        }
        public getLat(): number {
            return parseFloat(this.get('lat'));
        }
        public getLng(): number {
            return parseFloat(this.get('lng'));
        }
        public getId(): number {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }

        public getParents(): Persons {
            var persons: Persons = new Persons();
            $.each(this.get('parents'), function (index: number, item: number) {
                persons.add(Model.getPersons().findWhere({ id: item }));
            });
            return persons;
        }
        public getAddress(): string {
            return this.get('address');
        }
        public getLocation(): L.LatLng {
            return new L.LatLng(this.getLat(), this.getLng());
        }
        public getDescription(): string {
            if (this.get('description') == "") {
                return "&nbsp;";
            }
            return this.get('description');
        }
        public updateParents(): void {
            var self: Tree = this;
            self.attributes.parents = Model.getAdopts().getParentIds(self.id);
        }
    }
    export class Trees extends Backbone.Collection<Tree> {
        url: string = "trees.php";
        constructor(models?: Tree[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Tree;
        }

        public getIds(): Array<number> {
            var self: Trees = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Tree) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }

        public getFoodIds(): Array<number> {
            var self: Trees = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Tree) {
                if (result.indexOf(model.getFoodId()) == -1) {
                    result.push(model.getFoodId());
                }
            });
            return result;
        }
        /*
        public getFlagIds(): Array<number> {
            var self: Trees = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Tree) {
                if (result.indexOf(model.getFlagId()) == -1) {
                    result.push(model.getFlagId());
                }
            });
            return result;
        }
        */

        public filterByIds(idArray): Array<Tree> {
            var self: Trees = this;
            var trees: Trees = new Trees(self.models);
            return trees.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        }

        public filterByFoodIds(idArray): Trees {
            var self: Trees = this;
            var trees: Trees = new Trees(self.models);
            return new Trees(trees.filter(function (tree: Tree, index: number) {
                if ($.inArray(tree.getFoodId(), idArray) > -1) {
                    return true;
                }
                return false;
            }));
        }

        public filterByFlagIds(idArray): Trees {
            var self: Trees = this;
            var trees: Trees = new Trees();
            $.each(self.models, function (index: number, tree: Tree) {
                $.each(tree.getFlags(), function (index2: number, flag: number) {
                    if ($.inArray(flag, idArray) > -1) {
                        trees.add(tree);
                    }
                });
            });
            return trees;
        }

        public filterByOwnershipIds(idArray): Trees {
            var self: Trees = this;
            var trees: Trees = new Trees(self.models);
            return new Trees(trees.filter(function (tree: Tree, index: number) {
                if ($.inArray(tree.getOwnershipId(), idArray) > -1) {
                    return true;
                }
                return false;
            }));
        }

        public filterByAdoptStatus(idArray): Trees {
            var self: Trees = this;
            var trees: Trees = new Trees();
            $.each(self.models, function (index: number, tree: Tree) {
                if ($.inArray(0, idArray) > -1) {
                    if (tree.get('parents').length == 0) {
                        if (trees.where({ id: tree.getId() }) != undefined) {
                            trees.add(tree);
                        }

                    }
                }
                if ($.inArray(1, idArray) > -1) {
                    if (tree.get('parents').length >= 1) {
                        if (trees.where({ id: tree.getId() }) != undefined) {
                            trees.add(tree);
                        }
                    }
                }
            });
            return trees;
        }

        public getAssigned(trees: Trees): Trees {
            var self: Trees = this;
            $.each(self.models, function (index: number, model: Tree) {
                if (model.get('parents').length >= 1) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        }

        public getUnassigned(trees: Trees): Trees {
            var self: Trees = this;
            $.each(self.models, function (index: number, model: Tree) {
                if (model.get('parents').length == 0) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        }

        public getFromFoodId(trees: Trees, id: number): Trees {
            var self: Trees = this;
            $.each(self.models, function (index: number, model: Tree) {
                if (model.getFoodId() == id) {
                    if (trees.where({ id: model.getId() }) != undefined) {
                        trees.add(model);
                    }
                }
            });
            return trees;
        }

        public updateParents(): void {
            var self: Trees = this;
            $.each(self.models, function (index: number, tree: Tree) {
                tree.attributes.parents = Model.getAdopts().getParentIds(tree.id);
            });
        }

        public filterByParent(parentid: number): Trees {
            var self: Trees = this;
            var trees: Trees = new Trees();
            $.each(Model.getAdopts().models, function (index: number, adopt: Adopt) {
                if (adopt.getParentId() == parentid) {
                    var tree: Tree = Model.getTrees().findWhere({ id: adopt.getTreeId() });
                    trees.add(tree);
                }
            });
            return trees;
        }
    }
}