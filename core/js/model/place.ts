module FoodParent {
    export class Place extends Backbone.Model {
        url: string = "place.php";
        private isSavable = true;
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
            var self: Place = this;
            this.url = Setting.getPhpDir() + this.url;
            this.defaults = <any>{
                "id": 0,
                "lat": 0,
                "lng": 0,
                "name": "",
                "address": "",
                "description": "",
                "updated": moment(new Date()).format(Setting.getDateTimeFormat()),
            };
            /*
            self.off("change");
            self.on("change", function (model: Tree, options) {
                if (self.isSavable == false) return;
                self.isSavable = false;
                model.save(
                    {},
                    {
                        wait: true,
                        success: function (tree: Tree, response: any) {
                            console.log(tree);
                            self.isSavable = true;
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            EventHandler.handleDataChange("<i>" + food.getName() + " " + tree.getName() + "</i> has been changed successfully", true);
                        },
                        error: function (error, response) {
                            self.isSavable = true;
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        },
                    }
                );
            });
            */

        }

        parse(response: any, options?: any): any {
            if (response.id != null) {
                response.id = parseInt(response.id);
            }
            response.lat = parseFloat(response.lat);
            response.lng = parseFloat(response.lng);
            response.updated = moment(response.updated).format(Setting.getDateTimeFormat());

            return super.parse(response, options);
        }
        toJSON(options?: any): any {
            var clone = this.clone().attributes;
            if (this.id != null) {
                clone["id"] = this.id;
            }
            return clone;
        }
        public getFoodId(): number {
            return this.get('food');
        }
        public getFlagId(): number {
            return this.get('flag');
        }
        public getOwnershipId(): number {
            return Math.floor(this.get('ownership'));
        }
        public getName(): string {
            return this.get('name');
        }
        public getLocation(): L.LatLng {
            return new L.LatLng(this.getLat(), this.getLng());
        }
        public getLat(): number {
            return parseFloat(this.get('lat'));
        }
        public getLng(): number {
            return parseFloat(this.get('lng'));
        }
        public getId(): number {
            if (this.id != undefined) {
                return Math.floor(this.id);
            }
            return null;
        }
        public getDescription(): string {
            if (this.get('description') == "") {
                return "&nbsp;";
            }
            return this.get('description');
        }
    }

    export class Places extends Backbone.Collection<Place> {
        url: string = "places.php";
        constructor(models?: Place[], options?: any) {
            super(models, options);
            this.url = Setting.getPhpDir() + this.url;
            this.model = Place;
        }

        public getIds(): Array<number> {
            var self: Places = this;
            var result = Array<number>();
            $.each(self.models, function (index: number, model: Place) {
                if (result.indexOf(model.getId()) == -1) {
                    result.push(model.getId());
                }
            });
            return result;
        }
        

        public filterByIds(idArray): Array<Place> {
            var self: Places = this;
            var places: Places = new Places(self.models);
            return places.reset(_.map(idArray, function (id) { return this.get(id); }, this));
        }
        
    }
}