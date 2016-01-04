﻿module FoodParent {
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

    export class AlertViewFractory {
        private static _instance: AlertViewFractory = new AlertViewFractory();
        private baseUrl: string;
        constructor(args?: any) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        public static getInstance(): AlertViewFractory {
            return AlertViewFractory._instance;
        }
        public static create(el: JQuery, errorMode: ERROR_MODE): AlertView {
            var view: AlertView = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            return view;
        }
    }

    export class PopupView extends BaseView {

    }

    export class AlertView extends PopupView {
        private static TAG: string = "AlertView - ";
        private _errorMode: ERROR_MODE;
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: AlertView = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = <any>{
                "click .alert-confirm": "_mouseClick",
                "click .alert-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        public setErrorMode(errorMode: ERROR_MODE): void {
            var self: AlertView = this;
            self._errorMode = errorMode;
        }
        public render(args?: any): any {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "render()");

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

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self: AlertView = this;
            if (self.bDebug) console.log(AlertView.TAG + "update()");
            return self;
        }
        private _mouseEnter(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseEnter($(event.currentTarget), self);
        }
        private _mouseClick(event: Event): void {
            var self: AlertView = this;
            EventHandler.handleMouseClick($(event.currentTarget), self);
        }

        public setVisible(): void {
            var self: AlertView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: AlertView = this;
            Setting.getPopWrapperElement().addClass('hidden');
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
                "click .confirm-confirm": "_executeCommand",
                "click .confirm-cancel": "_mouseClick",
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
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self: ConfirmView = this;
            if (self.bDebug) console.log(ConfirmView.TAG + "render()");


            var tag: string = "";
            tag += "<p>" + self._message + "<br/> This action cannot be undone.</p>";
            tag += "<div class='confirm-button-group'>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-confirm'>Confirm</div></div>";
            tag += "<div class='button-outer-frame button1'><div class='button-inner-frame confirm-cancel'>Cancel</div></div>";
            tag += "</div>";
            var template = _.template(Template.getConfirmViewTemplate());
            var data = {
                content: tag,
            }
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-confirm'));

            self.setVisible();

            return self;
        }

        public update(args?: any): any {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
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