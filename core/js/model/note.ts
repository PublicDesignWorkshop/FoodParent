module FoodParent {
    export enum SortType {
        NONE, DESCENDING, ASCENDING
    }
    export enum NoteType {
        NONE, IMAGE, INFO, PICKUP
    }
    export class Note extends Backbone.Model {
        url: string = "note.php";
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "type": 0,
                "tree": 0,
                "person": 0,
                "comment": "",
                "picture": "",
                "rate": 0,
                "date": moment(new Date()).format(Setting.getDateTimeFormat()),
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
            response.date = moment(response.date).format(Setting.getDateTimeFormat());
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
        public getComment(): string {
            return this.get('comment');
        }
        public getPicturePath(): string {
            return Setting.getContentPictureDir() + this.get('picture');
        }
        public getFakePicturePath(): string {
            return Setting.getCoreImageDir() + "placeholder-image.jpg";
        }
        public getFormattedDate(): string {
            return moment(this.get('date')).format(Setting.getDateFormat());
        }
        public getFormattedDateTime(): string {
            return moment(this.get('date')).format(Setting.getDateTimeFormat());
        }
        public getDateValueOf(): number {
            return moment(this.get('date')).valueOf();
        }
        public getRate(): number {
            return parseFloat(this.get('rate'));
        }
    }
    export class Notes extends Backbone.Collection<Note> {
        url: string = "notes.php";
        sortType: SortType = SortType.NONE;
        constructor(models?: Note[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Note;
        }
        comparator(model: Note) {
            var that: Notes = this;
            switch (that.sortType) {
                case SortType.NONE:
                    return 0;
                    break;
                case SortType.ASCENDING:
                    return model.getDateValueOf();
                    break;
                case SortType.DESCENDING:
                    return -model.getDateValueOf();
                    break;
            }
        }

        public sortByDescendingDate(): void {
            var that: Notes = this;
            that.sortType = SortType.DESCENDING;
            that.sort();
        }

        public sortByAscendingDate(): void {
            var that: Notes = this;
            that.sortType = SortType.ASCENDING;
            that.sort();
        }
    }
}