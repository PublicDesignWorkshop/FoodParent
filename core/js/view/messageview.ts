module FoodParent {
    export class MessageViewFractory {
        private static _instance: MessageViewFractory = new MessageViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (MessageViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use MessageViewFractory.getInstance() instead of new.");
            }
            MessageViewFractory._instance = this;
        }
        public static getInstance(): MessageViewFractory {
            return MessageViewFractory._instance;
        }
        public static create(el: JQuery, message: string, undoable: boolean): MessageView {
            var view: MessageView = new MessageView({ el: el });
            view.setMessage(message);
            view.setUndoable(undoable);
            return view;
        }
    }

    export class MessageView extends BaseView {
        private static TAG: string = "MessageView - ";
        private _message: string;
        private _undoable: boolean;
        private _timer: any;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: MessageView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .undo": "_mouseClick",
                //"click .alert-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: MessageView = this;
            if (self.bDebug) console.log(MessageView.TAG + "render()");
            /*
            var template = _.template(Template.getAlertViewTemplate());
            var data: any;
            var tag: string = "";
            switch (self._errorMode) {
                case ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>"
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
                case ERROR_MODE.SEVER_CONNECTION_ERROR:
                    tag += "<p>There is a server connection error.<br/>If the issue won't be solved by the refreshing page,";
                    tag += "<br/>please contact <a href='mailto:" + Setting.getDevContact() + "'>" + Setting.getDevContact() + "</a>.</p>";
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
            }
            data = {
                content: tag,
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-alert'));

            self.setVisible();
            */
            var template: any;
            if (self._undoable) {
                template = _.template("");
            } else {
                template = _.template(Template.getMessageViewTemplate());
            }
            
            var data = {
                content: self._message,
            }
            self.$el.html(template(data));
            self.setElement(self.$('.outer-frame'));
            self.setVisible();
            if (self._timer) {
                clearTimeout(self._timer);
            }
            self._timer = setTimeout(function () {
                self.setInvisible();
            }, 500);

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: MessageView = this;
            if (self.bDebug) console.log(MessageView.TAG + "update()");
            return self;
        }
        public setMessage(message: string): void {
            var self: MessageView = this;
            self._message = message;
        }
        public setUndoable(undoable: boolean): void {
            var self: MessageView = this;
            self._undoable = undoable;
        }

        private _mouseEnter(event: Event): void {
            var self: MessageView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: MessageView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: MessageView = this;
            Setting.getMessageWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: MessageView = this;
            Setting.getMessageWrapperElement().addClass('hidden');
            clearTimeout(self._timer);
        }
    }
}