var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var EditNoteViewForGuest = (function (_super) {
        __extends(EditNoteViewForGuest, _super);
        function EditNoteViewForGuest(options) {
            _super.call(this, options);
            var self = this;
            self.bDebug = true;
            self.events = {
                "click .evt-close": "_mouseClick",
                "click .evt-prev": "_prevNote",
                "click .evt-next": "_nextNote",
            };
            self.delegateEvents();
        }
        EditNoteViewForGuest.prototype.render = function (args) {
            _super.prototype.render.call(this, args);
            var self = this;
            var tree = FoodParent.Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
            var template = _.template(FoodParent.Template.getEditNoteViewForGuest());
            self.$el.append(template({
                header: "Tree Note",
                name: food.getName() + " " + tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
            // Register file upload event listner
            //self.addFileUploadEventListener();
            return self;
        };
        EditNoteViewForGuest.prototype.update = function (args) {
            _super.prototype.update.call(this, args);
            var self = this;
            if (self.bDebug)
                console.log(EditNoteViewForGuest.TAG + "update()");
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
        };
        EditNoteViewForGuest.prototype.renderNoteInfo = function () {
            var self = this;
            if (self.bDebug)
                console.log(EditNoteViewForGuest.TAG + "renderNoteInfo()");
            var parent = FoodParent.Model.getPersons().findWhere({ id: self._note.getPersonId() });
            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + FoodParent.Setting.getMaxRating().toFixed(2));
            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), FoodParent.Setting.getMaxRating() + 1, function (rate) {
                self.renderNoteInfo();
            });
            self.$('.input-amount').replaceWith('<div class="input-amount"></div>');
            var origAmount = self._note.getAmount();
            var amountLabel = (origAmount / 454).toFixed(1) + " lbs. (";
            if (origAmount > 10000) {
              amountLabel += (origAmount / 1000).toFixed(1) + " kg)";
            } else {
              amountLabel += origAmount + " grams)";
            }
            self.$('.input-amount').html(amountLabel);
            self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
            self.$('.input-comment').html(htmlDecode(self._note.getComment()));
            var today = new Date();
            self.$('.text-note-date').html(self._note.getFormattedDate());
            self.$('.input-date').attr({ 'data-value': self._note.getFormattedDate() });
            self.$('.input-date').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    self._note.setDate(moment(this.get()).hour(moment(new Date()).hour()));
                    self.renderNoteInfo();
                }
            });
            // Fill out name of the author
            self.$('.input-contact').html(parent.getName());
        };
        EditNoteViewForGuest.TAG = "EditNoteViewForGuest - ";
        return EditNoteViewForGuest;
    })(FoodParent.EditNoteView);
    FoodParent.EditNoteViewForGuest = EditNoteViewForGuest;
})(FoodParent || (FoodParent = {}));
