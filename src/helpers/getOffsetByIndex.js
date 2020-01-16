const getOffsetByIndex = index => {
  let offset = 0;
  for (let i = 0; i < index; i += 1) {
    const elementLayout = _layoutsMap[i];
    if (elementLayout && elementLayout.height) {
      offset += _layoutsMap[i].height;
    }
  }
  return offset;
};

const addToLayoutsMap = (layout, index) => {
  _layoutsMap[index] = layout;
};