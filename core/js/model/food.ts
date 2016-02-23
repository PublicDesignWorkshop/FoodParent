module FoodParent {
    export class Food extends Backbone.Model {
        url: string = "food.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "name": "",
                "icon": "",
                "description": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
        }
        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
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
        public getName(): string {
            return this.get('name');
        }
        public getIconPath(): string {
            return Setting.getContentIconDir() + this.get('icon');
        }
    }
    export class Foods extends Backbone.Collection<Food> {
        url: string = "foods.php";
        sortType: SortType = SortType.ASCENDING;
        constructor(models?: Food[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Food;
        }

        public getUndetectedIds(ids: Array<number>): Array<number> {
            var that: Foods = this;
            var result = Array<number>();
            result = ids;
            $.each(that.models, function (index: number, model: Food) {
                var i = result.indexOf(model.getId());
                if (i != -1) {
                    result.splice(i, 1);
                }
            });
            return result;
        }

        toArray(): any {
            var that: Foods = this;
            var result = new Array();
            $.each(that.models, function (index: number, model: Food) {
                result.push([model.getName(), model.getId()]);
            });
            return result;
        }

        comparator(model: Food) {
            var self: Food = this;
            switch (self.sortType) {
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
            var self: Foods = this;
            //that.sortType = SortType.ASCENDING;
            //that.sort();
            self.models = _.sortBy(self.models, 'name');
        }
    }
}