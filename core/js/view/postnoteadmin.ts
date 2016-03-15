module FoodParent {
    export class PostNoteViewForAdmin extends PostNoteView {
        protected static TAG: string = "PostNoteViewForAdmin - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteViewForAdmin = this;
            self.bDebug = true;
            self.events = <any>{

            };
            self.delegateEvents();
        }
    }
}