var FoodParent;
(function (FoodParent) {
    var Template = (function () {
        function Template(args) {
            if (Template._instance) {
                throw new Error("Error: Instantiation failed: Use Template.getInstance() instead of new.");
            }
            Template._instance = this;
        }
        Template.getInstance = function () {
            return Template._instance;
        };
        Template.getHomeViewTemplate = function () {
            var template = '';
            template += '<div id="wrapper-home">';
            template += '<div class="home-menu-left">';
            template += '<div class="title-left">Food</div>';
            template += '<div class="enter-left"><i class="fa fa-angle-left"></i> manage food assets</div>';
            template += '</div>';
            template += '<div class="home-menu-right">';
            template += '<div class="title-right">Parent</div>';
            template += '<div class="enter-left">parent food assets <i class="fa fa-angle-right"></i></div>';
            template += '</div>';
            template += '</div>';
            return template;
        };
        Template.getNavViewTemplate = function () {
            var template = '';
            template += '<div id="background-nav-right">';
            template += '</div>';
            template += '<div id="background-nav-left">';
            template += '</div>';
            return template;
        };
        Template._instance = new Template();
        return Template;
    })();
    FoodParent.Template = Template;
})(FoodParent || (FoodParent = {}));
