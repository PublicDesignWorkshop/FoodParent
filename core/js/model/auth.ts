module FoodParent {
    export class Auth extends Backbone.Model {
        url: string = "auth.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            this.url = Setting.getPhpDir() + this.url;
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
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }
        public getName(): string {
            return this.get('name');
        }
    }
    export class Auths extends Backbone.Collection<Auth> {
        url: string = "auths.php";
        constructor(models?: Auth[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Auth;
        }

        toArray(): any {
            var self: Auths = this;
            var result = new Array();
            $.each(self.models, function (index: number, model: Auth) {
                result.push([model.getName(), model.getId()]);
            });
            return result;
        }
    }
}