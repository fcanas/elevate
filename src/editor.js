function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}

function initializeEditorContent(editor) {
  if (supportsLocalStorage()) {
    var program = window.localStorage['Elevator.js'];
    if (program !== undefined) {
      // Load program from local storage
      editor.setValue(program);
    } else {
      // Otherwise load the default Elevator.js
      var request = new XMLHttpRequest();
      request.open('GET', 'Elevator.js', true);
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == '200') {
          editor.setValue(request.responseText);
        }
      };
      request.send(null);
    }
  }
}

var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
document.getElementById('editor').style.fontSize = '14px';

initializeEditorContent(editor);

eval(editor.getValue());
editor.commands.addCommand({
  name: 'saveProgram',
  bindKey: {win: 'Ctrl-S',  mac: 'Ctrl-S'},
  exec: function(editor) {
    var program = editor.getValue();
    if (supportsLocalStorage()) {
      window.localStorage['Elevator.js'] = program;
    }
    eval(program);
  },
  readOnly: false
});
editor.commands.addCommand({
  name: 'runProgram',
  bindKey: {win: 'Ctrl-R',  mac: 'Ctrl-R'},
  exec: function(editor) {
    eval(editor.getValue());
  },
  readOnly: false
});
