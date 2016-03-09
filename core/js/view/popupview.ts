module FoodParent {
    export class PopupView extends BaseView {
        public setVisible(): void {
            var self: PopupView = this;
            Setting.getPopWrapperElement().removeClass('hidden');
        }
        public setInvisible(): void {
            var self: PopupView = this;
            Setting.getPopWrapperElement().addClass('hidden');
        }
    }
}