var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    (function (SortType) {
        SortType[SortType["NONE"] = 0] = "NONE";
        SortType[SortType["DESCENDING"] = 1] = "DESCENDING";
        SortType[SortType["ASCENDING"] = 2] = "ASCENDING";
    })(FoodParent.SortType || (FoodParent.SortType = {}));
    var SortType = FoodParent.SortType;
    (function (NoteType) {
        NoteType[NoteType["ALL"] = 0] = "ALL";
        NoteType[NoteType["IMAGE"] = 1] = "IMAGE";
        NoteType[NoteType["INFO"] = 2] = "INFO";
        NoteType[NoteType["PICKUP"] = 3] = "PICKUP";
    })(FoodParent.NoteType || (FoodParent.NoteType = {}));
    var NoteType = FoodParent.NoteType;
    var Note = (function (_super) {
        __extends(Note, _super);
        function Note(attributes, options) {
            _super.call(this, attributes, options);
            this.url = "note.php";
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.defaults = {
                "id": 0,
                "type": 0,
                "tree": 0,
                "person": 0,
                "comment": "",
                "picture": "",
                "rate": 0,
                "date": moment(new Date()).format(FoodParent.Setting.getDateTimeFormat()),
            };
        }
        Note.prototype.parse = function (response, options) {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.type = parseFloat(response.type);
            response.tree = parseFloat(response.tree);
            response.person = parseInt(response.person);
            response.rate = parseFloat(response.rate);
            response.date = moment(response.date).format(FoodParent.Setting.getDateTimeFormat());
            response.pictures = Array();
            if (response.picture != "") {
                response.pictures = response.picture.split(",");
            }
            return _super.prototype.parse.call(this, response, options);
        };
        Note.prototype.toJSON = function (options) {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            if (clone["pictures"]) {
                clone["picture"] = clone["pictures"].toString();
            }
            delete clone["pictures"];
            return clone;
        };
        Note.prototype.getId = function () {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        };
        Note.prototype.getComment = function () {
            if (this.get('comment') != "") {
                return this.get('comment');
            }
            return "&nbsp;";
        };
        Note.prototype.setComment = function (comment) {
            this.set('comment', comment);
        };
        Note.prototype.getBlankPicturePath = function () {
            return FoodParent.Setting.getCoreImageDir() + "picture-blank.jpg";
        };
        Note.prototype.getDateForDatePicker = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateForDatePicker());
        };
        Note.prototype.getFormattedDate = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateFormat());
        };
        Note.prototype.getFormattedDateTime = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateTimeFormat());
        };
        Note.prototype.getFormattedHourTime = function () {
            return moment(this.get('date')).format(FoodParent.Setting.getDateHourFormat());
        };
        Note.prototype.getDateValueOf = function () {
            return moment(this.get('date')).valueOf();
        };
        Note.prototype.getRate = function () {
            return parseFloat(this.get('rate'));
        };
        Note.prototype.setRate = function (rate) {
            this.set('rate', Math.floor(rate));
        };
        Note.prototype.getType = function () {
            return parseInt(this.get('type'));
        };
        Note.prototype.getTreeId = function () {
            return parseInt(this.get('tree'));
        };
        Note.prototype.getPersonId = function () {
            return parseInt(this.get('person'));
        };
        Note.prototype.setPersonId = function (personId) {
            this.set('person', Math.floor(personId));
        };
        Note.prototype.addPicture = function (filename) {
            if (this.get('pictures') == undefined) {
                this.set('pictures', new Array());
            }
            this.get('pictures').push(filename);
        };
        Note.prototype.getPictures = function () {
            if (this.get('pictures') == undefined) {
                this.set('pictures', new Array());
            }
            return this.get('pictures');
        };
        Note.prototype.getPicture = function (index) {
            return this.get('pictures')[index];
        };
        Note.prototype.removePicture = function (filename) {
            var self = this;
            self.set('pictures', _.without(self.getPictures(), filename));
        };
        Note.prototype.setCover = function (index) {
            var self = this;
            var picture = self.getPictures()[index];
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        };
        Note.prototype.setCoverPicture = function (picture) {
            var self = this;
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        };
        Note.prototype.setDate = function (date) {
            this.set('date', date.format(FoodParent.Setting.getDateTimeFormat()));
        };
        return Note;
    })(Backbone.Model);
    FoodParent.Note = Note;
    var Notes = (function (_super) {
        __extends(Notes, _super);
        function Notes(models, options) {
            _super.call(this, models, options);
            this.url = "notes.php";
            this.sortType = SortType.NONE;
            this.url = FoodParent.Setting.getPhpDir() + this.url;
            this.model = Note;
        }
        Notes.prototype.comparator = function (model) {
            var that = this;
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
        };
        Notes.prototype.sortByDescendingDate = function () {
            var that = this;
            that.sortType = SortType.DESCENDING;
            that.sort();
        };
        Notes.prototype.sortByAscendingDate = function () {
            var that = this;
            that.sortType = SortType.ASCENDING;
            that.sort();
        };
        Notes.prototype.getLatestImageNoteOfDate = function (treeId, date, noteType) {
            var self = this;
            if (self.models.length == 0) {
                return null;
            }
            self.sortByAscendingDate();
            var result = self.findWhere({ type: treeId });
            $.each(self.models, function (index, note) {
                if (date > note.getDateValueOf() && note.getType() == noteType && note.getTreeId() == treeId) {
                    result = note;
                }
                else {
                    return result;
                }
            });
            return result;
        };
        return Notes;
    })(Backbone.Collection);
    FoodParent.Notes = Notes;
})(FoodParent || (FoodParent = {}));
