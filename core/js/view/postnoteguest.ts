module FoodParent {
    export class PostNoteViewForGuest extends PostNoteView {
        protected static TAG: string = "PostNoteViewForGuest - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteViewForGuest = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-submit": "_submitNote",
                "click .image-group img": "_applyCoverPicture",
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
                header: "Post Note",
                name: food.getName() + " " + self._tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();

            // Create a new note.
            self._note = new Note({ type: NoteType.IMAGE, tree: self._tree.getId(), person: 0, comment: "", picture: "", rate: 0, date: moment(new Date()).format(Setting.getDateTimeFormat()) });

            // Render note info
            self.renderNoteInfo();
            
            // Register file upload event listner
            self.addFileUploadEventListener();

            return self;
        }
    }
}