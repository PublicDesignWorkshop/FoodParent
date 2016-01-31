module FoodParent {
    export class Flag extends Backbone.Model {
        url: string = "flag.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "name": "",
            };
        }
        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
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
        public getName(): string {
            return this.get('name');
        }
    }
    export class Flags extends Backbone.Collection<Flag> {
        url: string = "flags.php";
        sortType: SortType = SortType.ASCENDING;
        constructor(models?: Flag[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Flag;
        }

        comparator(model: Flag) {
            var that: Flags = this;
            switch (that.sortType) {
                case SortType.NONE:
                    return 0;
                    break;
                case SortType.ASCENDING:
                    return model.get('name');
                    break;
                case SortType.DESCENDING:
                    return -model.get('name');
                    break;
            }
        }

        public sortByDescendingName(): void {
            var that: Flags = this;
            that.sortType = SortType.DESCENDING;
            that.sort();
        }

        public sortByAscendingName(): void {
            var self: Flags = this;
            //that.sortType = SortType.ASCENDING;
            //that.sort();
            self.models = _.sortBy(self.models, 'name');
        }
    }
}