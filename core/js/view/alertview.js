var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var AlertViewFractory = (function () {
        function AlertViewFractory(args) {
            if (AlertViewFractory._instance) {
                throw new Error("Error: Instantiation failed: Use AlertViewFractory.getInstance() instead of new.");
            }
            AlertViewFractory._instance = this;
        }
        AlertViewFractory.getInstance = function () {
            return AlertViewFractory._instance;
        };
        AlertViewFractory.create = function (el, errorMode) {
            var view = new AlertView({ el: el });
            view.setErrorMode(errorMode);
            return view;
        };
        AlertViewFractory._instance = new AlertViewFractory();
        return AlertViewFractory;
    })();
    FoodParent.AlertViewFractory = AlertViewFractory;
    var PopupView = (function (_super) {
        __extends(PopupView, _super);
        function PopupView() {
            _super.apply(this, arguments);
        }
        return PopupView;
    })(FoodParent.BaseView);
    FoodParent.PopupView = PopupView;
    var AlertView = (function (_super) {
        __extends(AlertView, _super);
        function AlertView(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            //$(window).resize(_.debounce(that.customResize, Setting.getInstance().getResizeTimeout()));
            self.events = {
                "click .alert-confirm": "_mouseClick",
                "click .alert-cancel": "_mouseClick",
            };
            self.delegateEvents();
        }
        AlertView.prototype.setErrorMode = function (errorMode) {
            var self = this;
            self._errorMode = errorMode;
        };
        AlertView.prototype.render = function (args) {
            if (this.bRendered) {
                this.update(args);
                return;
            }
            this.bRendered = true;
            /////
            var self = this;
            if (self.bDebug)
                console.log(AlertView.TAG + "render()");
            var template = _.template(FoodParent.Template.getAlertViewTemplate());
            var data;
            var tag = "";
            switch (self._errorMode) {
                case FoodParent.ERROR_MODE.GEO_PERMISSION_ERROR:
                    tag += "<p>The device cannot find its's location information.<br />Please turn Geolocation setting on & refresh the page.</p>";
                    tag += "<div class='button-outer-frame button1'><div class='button-inner-frame alert-confirm'>Confirm</div></div>";
                    break;
            }
            data = {
                content: tag,
            };
            self.$el.html(template(data));
            self.setElement(self.$('#wrapper-alert'));
            self.setVisible();
            return self;
        };
        AlertView.prototype.update = function (args) {
            if (!this.bRendered) {
                this.render(args);
                return;
            }
            /////
            var self = this;
            if (self.bDebug)
                console.log(AlertView.TAG + "update()");
            return self;
        };
        AlertView.prototype._mouseEnter = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseEnter($(event.currentTarget), self);
        };
        AlertView.prototype._mouseClick = function (event) {
            var self = this;
            FoodParent.EventHandler.handleMouseClick($(event.currentTarget), self);
        };
        AlertView.prototype.setVisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().removeClass('hidden');
        };
        AlertView.prototype.setInvisible = function () {
            var self = this;
            FoodParent.Setting.getPopWrapperElement().addClass('hidden');
        };
        AlertView.TAG = "AlertView - ";
        return AlertView;
    })(PopupView);
    FoodParent.AlertView = AlertView;
})(FoodParent || (FoodParent = {}));
