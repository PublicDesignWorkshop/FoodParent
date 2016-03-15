module FoodParent {
    export class PostNoteViewFactory {
        private static _instance: PostNoteViewFactory = new PostNoteViewFactory();
        private baseUrl: string;
        constructor(args?: any) {
            if (PostNoteViewFactory._instance) {
                throw new Error("Error: Instantiation failed: Use PostNoteViewFactory.getInstance() instead of new.");
            }
            PostNoteViewFactory._instance = this;
        }
        public static getInstance(): PostNoteViewFactory {
            return PostNoteViewFactory._instance;
        }
        public static create(el: JQuery, tree: Tree): PostNoteView {
            var view: PostNoteView = new PostNoteView({ el: el });
            view.setTree(tree);
            return view;
        }
    }
}