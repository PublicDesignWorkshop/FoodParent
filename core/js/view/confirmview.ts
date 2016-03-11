module FoodParent {
    export class ConfirmViewFractory {
        private static _instance: ConfirmViewFractory = new ConfirmViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (ConfirmViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ConfirmViewFractory.getInstance() instead of new.");
            }
            ConfirmViewFractory._instance = this;
        }
        public static getInstance(): ConfirmViewFractory {
            return ConfirmViewFractory._instance;
        }
        public static create(el: JQuery, message: string, command: Command): ConfirmView {
            var view: ConfirmView = new ConfirmView({ el: el });
            view.setMessage(message);
            view.setCommand(command);
            return view;
        }
    }

    export class ConfirmView extends PopupView {
        private static TAG: string = "ConfirmView - ";
        private _message: string;
        private _command: Command;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: ConfirmView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .evt-submit": "_executeCommand",
                "click .evt-close": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setMessage(message: string): void {
            var self: ConfirmView = this;
            self._message = message;
        }
        public setCommand(command: Command): void {
            var self: ConfirmView = this;
            self._command = command;
        }
        public render(args?: any): any {
            super.render(args);
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "render()");
            var template = _.template(Template.getConfirmViewTemplate());
            var data = {
                header: "Deleting Tree",
                message: self._message,
            }
            self.$el.append(template(data));
            self.setElement(self.$('#wrapper-confirm'));

            self.setVisible();

            return self;
        }

        public update(args?: any): any {
            super.update(args);
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: ConfirmView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: ConfirmView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }
        private _executeCommand(event: Event): void {
            var self: ConfirmView = this;
            self._command.execute();
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: ConfirmView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: ConfirmView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }
}