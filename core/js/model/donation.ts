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
                "place": 0,
                "tree": 0,
                "quantity": 0,
                "date": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.trees = response.tree.split(',');
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());
            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            clone["tree"] = clone["trees"].toString();
            delete clone["trees"];
            return clone;
        }
        public getPlaceId(): number {
            return parseFloat(this.get('place'));
        }
        public getTreeIds(): Array<number> {
            return this.get("trees");
        }
        public addTreeId(id: number): void {
            if (this.get("trees") == undefined) {
                this.set("trees", new Array<number>());
            }
            this.get("trees").push(id);
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
    }

    export class Donations extends Backbone.Collection<Donation> {
        url: string = "donations.php";
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

    }
}