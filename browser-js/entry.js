// require('./view/divider-drag.js');
// require('./view/schema-edit-view.js');
// require('./view/sample-data-view.js');

// new require('./view/resources-view')();

require('./backbone-utils.js');

require('./view/undo-button-view');
require('./view/divider-drag');

var AppView = require('./view/app-view');
var router = require('./router');

var appView = new AppView();

Backbone.history.start({pushState: true});