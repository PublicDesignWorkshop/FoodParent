module FoodParent {
    export class Note extends Backbone.Model {
        url: string = "note.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            this.url = Setting.getInstance().getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "type": 0,
                "tree": 0,
                "person": 0,
                "comment": "",
                "picture": "",
                "rate": 0,
                "date": moment(new Date()).format(Setting.getInstance().getDateTimeFormat()),
            };
        }
        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.type = parseFloat(response.type);
            response.tree = parseFloat(response.tree);
            response.person = parseInt(response.person);
            response.rate = parseFloat(response.rate);
            response.date = moment(response.date).format(Setting.getInstance().getDateTimeFormat());
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
        public getPicturePath(): string {
            return Setting.getInstance().getContentsImageDir() + this.get('picture');
        }
        public getFakePicturePath(): string {
            return Setting.getInstance().getCoreImageDir() + "placeholder-image.jpg";
        }
    }
    export class Notes extends Backbone.Collection<Note> {
        url: string = "notes.php";
        constructor(models?: Note[], options?: any) {
            super(models, options);
            this.url = Setting.getInstance().getPhpDir() + this.url;
            this.model = Note;
        }
    }
}