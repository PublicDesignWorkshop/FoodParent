module FoodParent {
    export class PostNoteViewForGuest extends PostNoteView {
        protected static TAG: string = "PostNoteViewForGuest - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteViewForGuest = this;
            self.bDebug = true;
            self.events = <any>{

            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render();
            var self: PostNoteViewForGuest = this;
            if (self.bDebug) console.log(PostNoteViewForGuest.TAG + "render()");

        }
    }
}