var Resource = module.exports = Backbone.Model.extend({
  defaults: {
    path: '',
    typeId: '',
    typeName: '',
    order: 0,

    c_saved: true
  }
});
