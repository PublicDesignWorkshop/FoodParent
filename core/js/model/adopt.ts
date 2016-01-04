module FoodParent {
    export class Adopt extends Backbone.Model {
        url: string = "adopt.php";
        private isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var self: Adopt = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "tree": "",
                "owner": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };

            self.off("change");
            self.on("change", function (model: Adopt, options) {
                if (self.isSavable == false) return;
                self.isSavable = false;
                model.save(
                    {},
                    {
                        wait: true,
                        success: function (model: Adopt, response: any) {
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
            response.tree = parseInt(response.tree);
            response.owner = parseInt(response.owner);
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());
            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        }
        public getId(): number {
            return Math.floor(this.id);
        }
        public getTreeId(): number {
            var self: Adopt = this;
            return Math.floor(self.get('tree'));
        }
        public getOwnerId(): number {
            var self: Adopt = this;
            return Math.floor(self.get('owner'));
        }
    }
    export class Adopts extends Backbone.Collection<Adopt> {
        url: string = "adopts.php";
        constructor(models?: Adopt[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Adopt;
        }

        public getIds(): Array<number> {
            var self: Adopts = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Adopt) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }

        public getTreeIds(ownerId: number): Array<number> {
            var self: Adopts = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Adopt) {
                if (model.getOwnerId() == ownerId) {
                    if (result.indexOf(model.getTreeId()) == -1) {
                        result.push(model.getTreeId());
                    }
                }
            });
            return result;
        }

        public getParentIds(treeId: number): Array<number> {
            var self: Adopts = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Adopt) {
                if (model.getTreeId() == treeId) {
                    if (result.indexOf(model.getOwnerId()) == -1) {
                        result.push(model.getOwnerId());
                    }
                }
            });
            return result;
        }
    }
}