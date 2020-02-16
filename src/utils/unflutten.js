

export const unflutten = arr => {
  let tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

  for (let i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]["children"] = [];
  }

  for (let id in mappedArr) {
    mappedElem = mappedArr[id];
    if (mappedElem.parent || mappedElem.parent === 0) {
      try {
        mappedArr[mappedElem["parent"]]["children"].push(mappedElem);
      } catch (e) {
        tree.push(mappedElem);
      }
    }
    // If the element is at the root level, add it to first level elements array.
    else {
      tree.push(mappedElem);
    }
  }
  return tree;
};
