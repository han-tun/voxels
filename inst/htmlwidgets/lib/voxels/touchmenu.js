function TouchMenu(rootEl, entries) {
  var host;
  var instances = [];
  var elementCount = 0;
  var touchTracker;
  var rootEntry;

  var findInitRoot = function(elems) {
    var root = null;

    for (var idx = 0; idx < elems.length; idx++) {
      var first = elems[idx];
      if (first.root) root = first;
    }

    return root;
  };

  var addParentToChildren = function(elem, parent) {
    if (parent) elem.parent = parent;

    for (var idx = 0; elem.children && idx < elem.children.length; idx++) {
      var child = elem.children[idx];
      addParentToChildren(child, elem)
    }
  };

  var addEntries = function(entries) {
    if (!entries) return;

    for (idx in entries) {
      addEntry(entries[idx]);
    }
  };

  var addEntry = function(entry) {
    if (entry.expanded) return;
    
    var className = entry.className ? " " + entry.className : "";

    var divEntry = createElement("div");
    divEntry.setAttribute("class", "touch-menu-entry" + className);
    divEntry.style.top = entry.position[1] + "px";
    divEntry.style.left = entry.position[0] + "px";
    if (entry.background) divEntry.style.background = entry.background;
    if (entry.label) divEntry.innerText = entry.label;
    if (entry.html) divEntry.innerHTML = entry.html;

    entry.element = divEntry;
    entry.expanded = true;

    instances.push(entry);

    host.appendChild(divEntry);
  };

  var removeEntry = function(entry) {
    if (entry.element)
      host.removeChild(entry.element);

    entry.expanded = false;
    var idx = instances.indexOf(entry);
    if (idx >= 0) instances.splice(idx, 1);
  };

  var mouseInsideEntry = function(e, entry) {
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var posEntry = Convert.offset(entry.element);
    
    return posEntry.left <= e.clientX + scrollLeft &&
           posEntry.left + posEntry.width >= e.clientX + scrollLeft &&
           posEntry.top <= e.clientY + scrollTop &&
           posEntry.top + posEntry.height >= e.clientY + scrollTop;
  };

  var distanceToEntry = function(e, entry) {
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var posEntry = Convert.offset(entry.element);
    
    var entryX = posEntry.left + posEntry.width / 2;
    var entryY = posEntry.top + posEntry.height / 2;

    return Math.pow(entryX - (e.clientX + scrollLeft), 2) + Math.pow(entryY - (e.clientY + scrollTop), 2);
  };

  var onDocumentMouseDown = function(e, data) {
    var mouseIsDown = false;

    for (var idx = 0; idx < instances.length; idx++) {
      var entry = instances[idx];
      if (mouseInsideEntry(e, entry)) {
        mouseIsDown = true;
        addEntries(entry.children);
      }
    }

    var data = {
      mouseIsDown: mouseIsDown
    };

    return onDocumentMouseMove(e, data);
  };

  var removeAllEntries = function(entries) {
    for (var idx = 0; idx < entries.length; idx++)
      removeEntry(entries[idx]);
  }

  var onDocumentMouseUp = function(e, data) {
    if (!data.mouseIsDown) return data;

    data.mouseIsDown = false;

    var toRemove = [];
    for (var idx = 0; idx < instances.length; idx++) {
      var entry = instances[idx];

      if (!entry.root) {
        toRemove.push(entry);
        if (entry.inactive) entry.inactive();
        if (entry.action && mouseInsideEntry(e, entry)) entry.action();
      }
    }

    for (var idx = 0; idx < toRemove.length; idx++) {
      toRemove[idx].expanded = false;
      removeEntry(toRemove[idx]);
    }

    return data;
  };

  var onDocumentMouseMove = function(e, data) {
    if (!data.mouseIsDown) return data;

    var overRoot = mouseInsideEntry(e, rootEntry);
    var overRoot = mouseInsideEntry(e, rootEntry);

    var closestElement = null;
    var closestDistance = null;

    for (var idx = 0; idx < instances.length; idx++) {
      var entry = instances[idx];
      if (!entry.root) {
        var distance = distanceToEntry(e, entry);
        if (!closestDistance || distance < closestDistance) {
          closestElement = entry.element;
          closestDistance = distance;
        }
      }
    }

    var activeEntry = null;
    var activeEntries = [rootEntry];

    for (var idx = 0; idx < instances.length; idx++) {
      var entry = instances[idx];
      var className = entry.className ? " " + entry.className : "";
      if (!overRoot && closestElement == entry.element) {
        entry.element.setAttribute("class", "touch-menu-entry touch-menu-entry-active" + className);
        if (entry.active) entry.active();
        addEntries(entry.children);
        activeEntries = [entry];
        activeEntry = entry;
      }
      else {
        if (entry.inactive) entry.inactive();
        if (entry.element) entry.element.setAttribute("class", "touch-menu-entry" + className);
      }
    }

    while (activeEntry && activeEntry.parent) {
      activeEntries.push(activeEntry.parent);
      activeEntry = activeEntry.parent;
    }

    var removeEntries = [];
    for (var i = 0; i < instances.length; i++) {
      var entry = instances[i];
      var activeParent = false;
      for (var j = 0; j < activeEntries.length; j++) {
        if (activeEntries[j] == entry.parent) activeParent = true;
      }
      if (!activeParent && !entry.root) {
        removeEntries.push(entry);
      }
    }
    removeAllEntries(removeEntries);

    data.closestElementId = closestElement ? closestElement.id : null;
    return data;
  };

  var createElement = function(type) {
    var elem = document.createElement(type);
    elem.id = "touch-menu-" + elementCount;
    elementCount++;

    return elem;
  };

  var init = function() {
    host = createElement("div");
    host.setAttribute("class", "touch-menu-root");

    rootEntry  = findInitRoot(entries);
    addParentToChildren(rootEntry);

    addEntries(entries);

    rootEl.appendChild(host);

    touchTracker = new TouchTracker(rootEl,
      function(start, last, end, time, data) {
        return onDocumentMouseDown(end, data);
      },
      function(start, last, end, time, data) {
        return onDocumentMouseMove(end, data);
      },
      function(start, last, end, time, data) {
        return onDocumentMouseUp(end, data);
      }
    );
  };

  init();
}