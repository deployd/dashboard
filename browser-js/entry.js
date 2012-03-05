// require('./view/divider-drag.js');
// require('./view/schema-edit-view.js');
// require('./view/sample-data-view.js');

// new require('./view/resources-view')();

require('./backbone-utils.js');

require('./view/undo-button-view');
require('./view/divider-drag');

var ResourcesView = require('./view/resources-view');
var ModelEditorView = require('./view/model-editor-view');

if ($('#resource-editor').length) {
  new ResourcesView();  
} else if ($('#model-editor').length) {
  new ModelEditorView();
}
