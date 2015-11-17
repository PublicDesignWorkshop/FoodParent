module FoodParent {
    export class Auth extends Backbone.Model {
        //url: string = "food.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            //this.url = Setting.getInstance().getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "name": ""
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
            return Math.floor(this.id);
        }
        public getName(): string {
            return this.get('name');
        }
    }
    export class Auths extends Backbone.Collection<Auth> {
        //url: string = "foods.php";
        constructor(models?: Auth[], options?: any) {
            super(models, options);
            //this.url = Setting.getInstance().getPhpDir() + this.url;
            this.model = Auth;
        }

        toArray(): any {
            var that: Auths = this;
            var result = new Array();
            $.each(that.models, function (index: number, model: Auth) {
                result.push([model.getName(), model.getId()]);
            });
            console.log(result);
            return result;
        }

    }
}