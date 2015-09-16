var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
document.getElementById('editor').style.fontSize = '14px';
eval(editor.getValue());
editor.commands.addCommand({
  name: 'saveProgram',
  bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
  exec: function(editor) {
    eval(editor.getValue());
  },
  readOnly: false
});
editor.commands.addCommand({
  name: 'runProgram',
  bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
  exec: function(editor) {
    eval(editor.getValue());
  },
  readOnly: false
});
