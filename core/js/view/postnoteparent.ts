module FoodParent {
    export class PostNoteViewForParent extends PostNoteView {
        protected static TAG: string = "PostNoteViewForParent - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteViewForParent = this;
            self.bDebug = true;
            self.events = <any>{

            };
            self.delegateEvents();
        }
    }
}