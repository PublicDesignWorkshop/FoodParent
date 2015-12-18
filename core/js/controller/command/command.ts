module FoodParent {
    export abstract class Command {
        constructor(args?: any) {

        }
        public execute(args?: any): any {

        }
        public undo(): any {

        }
    }

    export class SetViewCommand implements Command {
        constructor(args?: any) {

        }
        public execute(el: JQuery): any {

        }
        public undo(): any {

        }
    }

    export class AddViewCommand implements Command {
        constructor(args?: any) {

        }
        public execute(parent: JQuery): any {

        }
        public undo(): any {

        }
    }
}