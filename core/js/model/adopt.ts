module FoodParent {
    export class Adopt extends Backbone.Model {
        url: string = "adopt.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var self: Adopt = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "tree": "",
                "parent": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.tree = parseInt(response.tree);
            response.parent = parseInt(response.parent);
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
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }
        public getTreeId(): number {
            var self: Adopt = this;
            return Math.floor(self.get('tree'));
        }
        public getParentId(): number {
            var self: Adopt = this;
            return Math.floor(self.get('parent'));
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

        public getTreeIds(personId: number): Array<number> {
            var self: Adopts = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Adopt) {
                if (model.getParentId() == personId) {
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
                    if (result.indexOf(model.getParentId()) == -1) {
                        result.push(model.getParentId());
                    }
                }
            });
            return result;
        }

        public checkAdoption(treeId: number, parentId: number): boolean {
            var self: Adopts = this;
            if (self.findWhere({ tree: treeId, parent: parentId })) {
                return true;
            }
            return false;
        }
    }
}