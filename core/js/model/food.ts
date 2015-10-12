module FoodParent {
    export class Food extends Backbone.Model {
        url: string = "food.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            this.url = Setting.getInstance().getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "name": "",
                "icon": "",
                "description": "",
                "updated": moment(new Date()).format(Setting.getInstance().getDateTimeFormat()),
            };
        }
        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
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
        public getName(): string {
            return this.get('name');
        }
        public getIconPath(): string {
            return Setting.getInstance().getCoreImageDir() + this.get('icon');
        }
    }
    export class Foods extends Backbone.Collection<Food> {
        url: string = "foods.php";
        constructor(models?: Food[], options?: any) {
            super(models, options);
            this.url = Setting.getInstance().getPhpDir() + this.url;
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
    }
}