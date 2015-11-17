module FoodParent {
    export class Adopt extends Backbone.Model {
        url: string = "adopt.php";
        private isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var that: Adopt = this;
            this.url = Setting.getInstance().getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "tree": "",
                "owner": "",
                "updated": moment(new Date()).format(Setting.getInstance().getDateTimeFormat()),
            };

            that.off("change");
            that.on("change", function (model: Adopt, options) {
                if (that.isSavable == false) return;
                that.isSavable = false;
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
            response.updated = moment(response.updated).format(Setting.getInstance().getDateTimeFormat());
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
            var that: Adopt = this;
            return Math.floor(this.get('tree'));
        }
        public getOwnerId(): number {
            var that: Adopt = this;
            return Math.floor(this.get('owner'));
        }
    }
    export class Adopts extends Backbone.Collection<Adopt> {
        url: string = "adopts.php";
        constructor(models?: Adopt[], options?: any) {
            super(models, options);
            this.url = Setting.getInstance().getPhpDir() + this.url;
            this.model = Adopt;
        }

        public getIds(): Array<number> {
            var that: Adopts = this;
            var result = Array<number>();
            $.each(that.models, function (index: number, model: Adopt) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }

        public getTreeIds(ownerId: number): Array<number> {
            var that: Adopts = this;
            var result = Array<number>();
            $.each(that.models, function (index: number, model: Adopt) {
                if (model.getOwnerId() == ownerId) {
                    if (result.indexOf(model.getTreeId()) == -1) {
                        result.push(model.getTreeId());
                    }
                }
            });
            return result;
        }

        public getOwnerIds(treeId: number): Array<number> {
            var that: Adopts = this;
            var result = Array<number>();
            $.each(that.models, function (index: number, model: Adopt) {
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