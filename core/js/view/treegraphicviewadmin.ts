module FoodParent {
    export class TreeGraphicViewForAdmin extends TreeGraphicView {
        protected static TAG: string = "TreeGraphicViewForGuest - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: TreeGraphicViewForAdmin = this;
            self.bDebug = true;
            self.events = <any>{
                "click .btn-date": "_applyDatePreset",
            };
            self.delegateEvents();
        }
    }
}