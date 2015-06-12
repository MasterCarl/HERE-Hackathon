// Add render controls
function renderControls(map, title, buttons) {
  var containerNode = document.createElement('div');

  containerNode.innerHTML = '<h4 class="title">' + title + '</h4><div class="btn-group"></div>';
  containerNode.setAttribute('style',
      'position:absolute;top:0;left:0;background-color:#fff; padding:10px;text-align:center');

  Object.keys(buttons).forEach(function (label) {
    var input = document.createElement('input');
    input.value = label;
    input.type = 'button';
    input.onclick = buttons[label];
    input.className="btn btn-sm btn-default"
    containerNode.lastChild.appendChild(input);
  });

  map.getElement().appendChild(containerNode);
}