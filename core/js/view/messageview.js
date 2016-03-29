var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var MessageViewFractory = (function () {
        function MessageViewFractory(args) {
            if (MessageViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use MessageViewFractory.getInstance() instead of new.");
            }
            MessageViewFractory._instance = this;
        }
        MessageViewFractory.getInstance = function () {
            return MessageViewFractory._instance;
        };
        MessageViewFractory.create = function (el, message, undoable) {
            var view = new MessageView({ el: el });
            view.setMessage(message);
            view.setUndoable(undoable);
            return view;
        };
        MessageViewFractory._instance = new MessageViewFractory();
        return MessageViewFractory;
    })();
    FoodParent.MessageViewFractory = MessageViewFractory;
    var MessageView = (function (_super) {
        __extends(MessageView, _super);
        function MessageView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .undo": "_mouseClick",
            };
            self.delegateEvents();
        }
        MessageView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(MessageView.TAG + "render()");
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
            var template;
            if (self._undoable) {
                template = _.template("");
            }
            else {
                template = _.template(FoodParent.Template.getMessageViewTemplate());
            }
            var data = {
                content: self._message,
            };
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
        };
        MessageView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(MessageView.TAG + "update()");
            return self;
        };
        MessageView.prototype.setMessage = function (message) {
            var self = this;
            self._message = message;
        };
        MessageView.prototype.setUndoable = function (undoable) {
            var self = this;
            self._undoable = undoable;
        };
        MessageView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        MessageView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        MessageView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getMessageWrapperElement().removeClass('hidden');
        };
        MessageView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getMessageWrapperElement().addClass('hidden');
            clearTimeout(self._timer);
        };
        MessageView.TAG = "MessageView - ";
        return MessageView;
    })(FoodParent.BaseView);
    FoodParent.MessageView = MessageView;
})(FoodParent || (FoodParent = {}));
