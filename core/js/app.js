function mod(n, m) {
    return ((n % m) + m) % m;
}
Backbone.View.prototype.destroy = function () {
    if (this.views != undefined) {
        _.invoke(this.views, 'destroy');
        this.views.length = 0;
    }
    this.$el.removeData().unbind();
    this.remove();
    this.$el.find("*").remove();
    Backbone.View.prototype.remove.call(this);
    if (this.onDestroy) {
        this.onDestroy();
    }
};
$(document).ready(function () {
    var url = window.location;
    FoodParent.Setting.getInstance().setBaseUrl(url.origin + window.location.pathname);
    FoodParent.View.setElement({ el: $('#wrapper-main') });
    Backbone.history.start();
});
