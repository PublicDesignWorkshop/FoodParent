module FoodParent {
    export abstract class Command {
        public execute(): any {

        }
        public undo(): any {

        }
    }

    export class CreateHomeViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: CreateHomeViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: CreateHomeViewCommand = this;
            View.addChild(HomeViewFractory.create(self._el).render());
        }
        public undo(): any {

        }
    }
    export class CreateNavViewCommand implements Command {
        private _el: JQuery;
        constructor(args?: any) {
            var self: CreateNavViewCommand = this;
            self._el = args.el;
        }
        public execute(): any {
            var self: CreateNavViewCommand = this;
            View.setNavView(NavViewFractory.create(self._el).render());
        }
        public undo(): any {

        }
    }
    export class FocusMenuLeftCommand implements Command {
        public execute(): any {
            var self: FocusMenuLeftCommand = this;
            View.getNavView().focusOnLeft();
        }
        public undo(): any {

        }
    }
    export class FocusMenuRightCommand implements Command {
        public execute(): any {
            var self: FocusMenuLeftCommand = this;
            View.getNavView().focusOnRight();
        }
        public undo(): any {

        }
    }

}