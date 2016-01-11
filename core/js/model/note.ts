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
            response.pictures = Array<string>();
            if (response.picture != "") {
                response.pictures = response.picture.split(",");
            }
            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            if (clone["pictures"]) {
                clone["picture"] = clone["pictures"].toString();
            } 
            delete clone["pictures"];
            return clone;
        }
        public getId(): number {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }
        public getComment(): string {
            if (this.get('comment') != "") {
                return this.get('comment');
            }
            return "&nbsp;";
        }
        public setComment(comment: string): void {
            this.set('comment', comment);
        }
        
        public getBlankPicturePath(): string {
            return Setting.getCoreImageDir() + "picture-blank.jpg";
        }
        public getDateForDatePicker(): string {
            return moment(this.get('date')).format(Setting.getDateForDatePicker());
        }
        public getFormattedDate(): string {
            return moment(this.get('date')).format(Setting.getDateFormat());
        }
        public getFormattedDateTime(): string {
            return moment(this.get('date')).format(Setting.getDateTimeFormat());
        }
        public getFormattedHourTime(): string {
            return moment(this.get('date')).format(Setting.getDateHourFormat());
        }
        public getDateValueOf(): number {
            return moment(this.get('date')).valueOf();
        }
        public getRate(): number {
            return parseFloat(this.get('rate'));
        }
        public setRate(rate: number): void {
            this.set('rate', Math.floor(rate));
        }
        public getType(): number {
            return parseInt(this.get('type'));
        }
        public getTreeId(): number {
            return parseInt(this.get('tree'));
        }
        public addPicture(filename: string): void {
            if (this.get('pictures') == undefined) {
                this.set('pictures', new Array<string>());
            }
            this.get('pictures').push(filename);
        }
        public getPictures(): Array<string> {
            if (this.get('pictures') == undefined) {
                this.set('pictures', new Array<string>());
            }
            return this.get('pictures');
        }
        public getPicture(index: number): string {
            return this.get('pictures')[index];
        }
        public removePicture(filename: string): void {
            var self: Note = this;
            self.set('pictures', _.without(self.getPictures(), filename));
        }
        public setCover(index: number): void {
            var self: Note = this;
            var picture = self.getPictures()[index];
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        }
        public setCoverPicture(picture: string): void {
            var self: Note = this;
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        }
        public setDate(date: Moment): void {
            this.set('date', date.format(Setting.getDateTimeFormat()));
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

        public getLatestImageNoteOfDate(treeId: number, date: number, noteType: NoteType): Note {
            var self: Notes = this;
            if (self.models.length == 0) {
                return null;
            }
            self.sortByAscendingDate();
            var result: Note = self.findWhere({ type: treeId });

            $.each(self.models, function (index: number, note: Note) {
                if (date > note.getDateValueOf() && note.getType() == noteType && note.getTreeId() == treeId) {
                    result = note;
                } else {
                    return result;
                }
            });
            return result;
        }
    }
}