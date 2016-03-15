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
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(Template.getPostNoteViewForGuest());
            self.$el.append(template({
                header: "Post Note for " + food.getName() + " " + self._tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();
        }
    }
}