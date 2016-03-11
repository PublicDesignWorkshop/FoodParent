var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var ConfirmViewFractory = (function () {
        function ConfirmViewFractory(args) {
            if (ConfirmViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use ConfirmViewFractory.getInstance() instead of new.");
            }
            ConfirmViewFractory._instance = this;
        }
        ConfirmViewFractory.getInstance = function () {
            return ConfirmViewFractory._instance;
        };
        ConfirmViewFractory.create = function (el, message, command) {
            var view = new ConfirmView({ el: el });
            view.setMessage(message);
            view.setCommand(command);
            return view;
        };
        ConfirmViewFractory._instance = new ConfirmViewFractory();
        return ConfirmViewFractory;
    })();
    FoodParent.ConfirmViewFractory = ConfirmViewFractory;
    var ConfirmView = (function (_super) {
        __extends(ConfirmView, _super);
        function ConfirmView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .evt-submit": "_executeCommand",
                "click .evt-close": "_mouseClick",
            };
            self.delegateEvents();
        }
        ConfirmView.prototype.setMessage = function (message) {
            var self = this;
            self._message = message;
        };
        ConfirmView.prototype.setCommand = function (command) {
            var self = this;
            self._command = command;
        };
        ConfirmView.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(ConfirmView.TAG + "render()");
            var template = _.template(FoodParent.Template.getConfirmViewTemplate());
            var data = {
                header: "Deleting Tree",
                message: self._message,
            };
            self.$el.append(template(data));
            self.setElement(self.$('#wrapper-confirm'));
            self.setVisible();
            return self;
        };
        ConfirmView.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(ConfirmView.TAG + "update()");
            return self;
        };
        ConfirmView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        ConfirmView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ConfirmView.prototype._executeCommand = function (event) {
            var self = this;
            self._command.execute();
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        ConfirmView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        ConfirmView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        ConfirmView.TAG = "ConfirmView - ";
        return ConfirmView;
    })(FoodParent.PopupView);
    FoodParent.ConfirmView = ConfirmView;
})(FoodParent || (FoodParent = {}));
