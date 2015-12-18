Backbone.View.prototype.destroy = function () {
    // chain call for removing all children views under curent view.
    if (this.children != undefined) {
        _.invoke(this.children, 'destroy');
        this.children.length = 0;
        delete this.children;
    }

    // remove binded event of current view (comment out since it will be handled by remove() call.
    //this.undelegateEvents();

    // remove jquery data
    this.$el.removeData().unbind(); 

    // remove view from dom (most browswer's remove() also handle unbind().
    this.remove();
    //this.unbind();

    // remove child doms (I am not exactly sure to call this.. This iterates all children dom elements, so it can make program slower).
    this.$el.find("*").remove();

    // I believe most of remove related function will be handled by this remove() call.
    Backbone.View.prototype.remove.call(this);

    // remove any model bind events if it's defined. (onDestroy() function should be defined manually in each view).
    if (this.onDestroy) {
        this.onDestroy();
    }
}

module FoodParent {
    export class BaseView extends Backbone.View<Backbone.Model> {
        protected bDebug: boolean = false;
        private bRendered: boolean = false; // Check whether this view is rendered or not. This status will be used for indicator either to create dom elements or just update contents.
        protected children: Array<BaseView>; // children views tree list
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: BaseView = this;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update();
                return;
            }
            this.bRendered = true;
        }
        
        public update(args?: any): any {
            if (!this.bRendered) {
                this.render();
                return;
            }
        }
        
        public getIsRendered(): boolean {
            return this.bRendered;
        }
        
        public getWidth(): number {
            return this.$el.innerWidth();
        }
        public getHeight(): number {
            return this.$el.innerHeight();
        }

        // traverse the graph, executing the provided callback on this node and it's children
        // execute the callback before traversing the children
        public traverse(callback: (obj: BaseView) => void) {
            callback(this);
            this.children.forEach(function (view) {
                view.traverse(callback);
            });
        }

        public addChild(view: BaseView) {
            var self: BaseView = this;
            if (self.children == undefined) {
                self.children = new Array<BaseView>();
            }
            self.children.push(view);
        }

        public getChildren(): Array<BaseView> {
            var self: BaseView = this;
            return self.children;
        }

        public animActive(): void {

        }

        public animInactive(): void {

        }

        public setVisible(): void {
            // invisible class is defined in app.css
            this.$el.removeClass('invisible');
            //this.$el.css({ opacity: 1 });
        }

        public setInvisible(): void {
            // invisible class is defined in app.css
            this.$el.addClass('invisible');
            //this.$el.css({ opacity: 0 });
        }
    }
}