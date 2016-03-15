module FoodParent {
    export class PostNoteViewForAdmin extends PostNoteView {
        protected static TAG: string = "PostNoteViewForAdmin - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: PostNoteViewForAdmin = this;
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
            var self: PostNoteViewForAdmin = this;
            if (self.bDebug) console.log(PostNoteViewForAdmin.TAG + "render()");
            var food: Food = Model.getFoods().findWhere({ id: self._tree.getFoodId() });
            var template = _.template(Template.getPostNoteViewForAdmin());
            self.$el.append(template({
                header: "Post Note",
                name: food.getName() + " " + self._tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();

            Controller.checkIsLoggedIn(function (response) {
                // Create a new note.
                self._note = new Note({ type: NoteType.IMAGE, tree: self._tree.getId(), person: parseInt(response.id), comment: "", picture: "", rate: 0, date: moment(new Date()).format(Setting.getDateTimeFormat()) });

                var parent: Person = Model.getPersons().findWhere({ id: parseInt(response.id) });

                // Fill out name of the author
                self.$('.input-contact').html(parent.getName());

                // Render note info
                self.renderNoteInfo();
            
                // Register file upload event listner
                self.addFileUploadEventListener();
            }, function (response) {
                new ResetPopupViewCommand().execute();
                Backbone.history.loadUrl(Backbone.history.fragment);
            }, function () {
                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
            });

            return self;
        }
    }
}