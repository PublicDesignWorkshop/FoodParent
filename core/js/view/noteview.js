var FoodParent;
(function (FoodParent) {
    var PostNoteViewFactory = (function () {
        function PostNoteViewFactory(args) {
            if (PostNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PostNoteViewFactory.getInstance() instead of new.");
            }
            PostNoteViewFactory._instance = this;
        }
        PostNoteViewFactory.getInstance = function () {
            return PostNoteViewFactory._instance;
        };
        PostNoteViewFactory.create = function (el, tree) {
            var view = new FoodParent.PostNoteView({ el: el });
            view.setTree(tree);
            return view;
        };
        PostNoteViewFactory._instance = new PostNoteViewFactory();
        return PostNoteViewFactory;
    })();
    FoodParent.PostNoteViewFactory = PostNoteViewFactory;
})(FoodParent || (FoodParent = {}));
