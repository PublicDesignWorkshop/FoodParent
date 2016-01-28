module FoodParent {
    export class Donation extends Backbone.Model {
        url: string = "donation.php";
        private isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var self: Donation = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "type": 0,
                "place": 0,
                "tree": 0,
                "quantity": 0,
                "picture": '',
                "date": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.type = parseInt(response.type);
            response.place = parseInt(response.place);
            response.quantity = parseFloat(response.quantity);
            response.trees = response.tree.split(',').map(function (item) {
                return parseInt(item);
            });
            response.pictures = Array<string>();
            if (response.picture != "") {
                response.pictures = response.picture.split(",");
            }
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());
            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            clone["trees"] = _.sortBy(clone["trees"], function (obj: any) { return parseInt(obj); })
            clone["tree"] = clone["trees"].toString();
            delete clone["trees"];
            if (clone["pictures"]) {
                clone["picture"] = clone["pictures"].toString();
            }
            delete clone["pictures"];
            return clone;
        }
        public getPlaceId(): number {
            return parseFloat(this.get('place'));
        }
        public getTreeIds(): Array<number> {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array<number>());
            }
            return this.get("trees");
        }
        public getType(): number {
            return Math.floor(this.get("type"));
        }
        public setType(type: number): void {
            this.set('type', type);
        }
        public getComment(): string {
            var self: Donation = this;
            var comment = "<strong>" + self.getQuantity() + " lbs.</strong> of ";
            var treeIds = self.getTreeIds();
            $.each(treeIds, function (index: number, treeId: number) {
                var tree: Tree = Model.getTrees().findWhere({ id: Math.floor(treeId) });
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (index == 0) {
                    if (treeIds.length == 1) {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from tree ";
                    } else {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from trees ";
                    }
                }
                if (index < treeIds.length - 1) {
                    comment += "<strong>" + tree.getName() + "</strong>, ";
                } else {
                    comment += "<strong>" + tree.getName() + "</strong>.";
                }
            });
            return comment;
        }

        public getCommentWithDate(): string {
            var self: Donation = this;
            var comment = "<strong>" + self.getQuantity() + " lbs.</strong> of ";
            var treeIds = self.getTreeIds();
            $.each(treeIds, function (index: number, treeId: number) {
                var tree: Tree = Model.getTrees().findWhere({ id: Math.floor(treeId) });
                var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                if (index == 0) {
                    if (treeIds.length == 1) {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from tree ";
                    } else {
                        comment += "<strong><i>" + food.getName() + "</i></strong> has been donated from trees ";
                    }
                }
                if (index < treeIds.length - 1) {
                    comment += "<strong>" + tree.getName() + "</strong>, ";
                } else {
                    comment += "<strong>" + tree.getName() + "</strong> ";
                }
            });
            comment += "(" + self.getFormattedDate() + ")";
            return comment;
        }

        public addTreeId(id: number): void {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array<number>());
            }
            if (this.get("trees").indexOf(id) < 0) {
                this.get("trees").push(id);
            }
        }
        public hasTreeId(id: number): boolean {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array<number>());
            }
            if (this.get("trees").indexOf(id) < 0) {
                return false;
            }
            return true;
        }
        public removeTreeId(id: number): void {
            var temp = _.reject(this.get("trees"), function (obj: any) { return parseInt(obj) == id; });
            this.set("trees", temp);
        }
        public getId(): number {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }
        public getQuantity(): number {
            return parseFloat(this.get('quantity'));
        }
        public setQuantity(quantity: number): void {
            this.set('quantity', quantity);
        }
        public getCumulativeQuantity(): number {
            var self: Donation = this;
            var donations: Donations = new Donations(Model.getDonations().where({ place: self.getPlaceId() }));
            donations.sortByAscendingDate();
            var total = 0;
            $.each(donations.models, function (index: number, donation: Donation) {
                if (self.getEndOfDateValueOf() >= donation.getStartOfDateValueOf()) {
                    total += donation.getQuantity();
                } else {
                    return total;
                }
            });
            return total;
        }
        public setDate(date: string): void {
            this.set('date', date);
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
        public getStartOfDateValueOf(): number {
            return moment(this.get('date')).startOf('day').valueOf();
        }
        public getEndOfDateValueOf(): number {
            return moment(this.get('date')).endOf('day').valueOf();
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
            var self: Donation = this;
            self.set('pictures', _.without(self.getPictures(), filename));
        }
        public setCover(index: number): void {
            var self: Donation = this;
            var picture = self.getPictures()[index];
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        }
        public setCoverPicture(picture: string): void {
            var self: Donation = this;
            self.set('pictures', _.without(self.getPictures(), picture));
            self.getPictures().unshift(picture);
        }
    }

    export class Donations extends Backbone.Collection<Donation> {
        url: string = "donations.php";
        sortType: SortType = SortType.NONE;
        constructor(models?: Donation[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Donation;
        }

        public getIds(): Array<number> {
            var self: Donations = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Donation) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }

        public filterByIds(idArray): Array<Donation> {
            var self: Donations = this;
            var donations: Donations = new Donations(self.models);
            return donations.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        }

        comparator(model: Donation) {
            var self: Donations = this;
            switch (self.sortType) {
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
            var self: Donations = this;
            self.sortType = SortType.DESCENDING;
            self.sort();
        }

        public sortByAscendingDate(): void {
            var self: Donations = this;
            self.sortType = SortType.ASCENDING;
            self.sort();
        }

        public getLatestDonationOfDate(placeId: number, date: number): Donation {
            var self: Donations = this;
            if (self.models.length == 0) {
                return null;
            }
            self.sortByAscendingDate();
            var result: Donation = null;

            $.each(self.models, function (index: number, donation: Donation) {
                if (date > donation.getDateValueOf() && donation.getPlaceId() == placeId) {
                    result = donation;
                } else {
                    return result;
                }
            });
            return result;
        }
    }
}