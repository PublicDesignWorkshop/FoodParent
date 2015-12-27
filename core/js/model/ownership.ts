module FoodParent {
    export class Ownership extends Backbone.Model {
        url: string = "ownership.php";
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
            return this.id;
        }
        public getName(): string {
            return this.get('name');
        }
    }
    export class Ownerships extends Backbone.Collection<Ownership> {
        url: string = "ownerships.php";
        constructor(models?: Ownership[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Ownership;
        }
    }
}