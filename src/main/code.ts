import MessageEmitter from '../utils/MessageEmitter';
import './store';

figma.showUI(__html__, {
  width: 285,
  height: 530,
});

const transformNode = (node) => ({
  id: node.id,
  name: node.name,
  width: node.width,
  height: node.height,
  type: node.type,
  parentId: node.parent.id,
  childrenCount: node.children?.length || 0,
});

const getNodes = (nodes) => (nodes || []).map(transformNode);

const __fontCache: FontName[] = [];

const getFont = async (textNode: TextNode) => {
  if (textNode.fontName === figma.mixed) {
    const len = textNode.characters.length;
    for (let i = 0; i < len; i++) {
      const font = textNode.getRangeFontName(i, i + 1) as FontName;
      if (
        !__fontCache.some(
          (f) => f.family === font.family && f.style === font.style
        )
      ) {
        await figma.loadFontAsync(font);
        __fontCache.push(font);
      }
    }
  } else {
    const font = textNode.fontName;
    if (
      !__fontCache.some(
        (f) => f.family === font.family && f.style === font.style
      )
    ) {
      await figma.loadFontAsync(textNode.fontName);
      __fontCache.push(textNode.fontName);
    }
  }
};

figma.on('selectionchange', async () => {
  MessageEmitter.emit('selection', getNodes(figma.currentPage.selection));
});

const getPositionFromData = (data) => {
  const { dropPosition, windowSize, offset } = data;

  // Thanks to @jackiecorn https://github.com/jackiecorn/figma-plugin-drag-and-drop
  const bounds = figma.viewport.bounds;
  const zoom = figma.viewport.zoom;
  const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;

  const xFromCanvas = hasUI
    ? dropPosition.clientX - leftPaneWidth
    : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 48 : dropPosition.clientY;

  return {
    x: bounds.x + xFromCanvas / zoom - offset.x,
    y: bounds.y + yFromCanvas / zoom - offset.y,
  };
};

MessageEmitter.on('drop image', (data) => {
  const { x, y } = getPositionFromData(data);
  const imageHash = figma.createImage(data.image).hash;

  const rect = figma.createRectangle();
  rect.resize(200, 200);
  figma.currentPage.appendChild(rect);

  rect.x = x;
  rect.y = y;

  rect.fills = []
    .filter((fill) => fill.type !== 'IMAGE')
    .concat({
      type: 'IMAGE',
      imageHash,
      scaleMode: 'FILL',
    });
});

MessageEmitter.answer('create items frame', async ({ data, isDragAndDrop }) => {
  if (isDragAndDrop || !figma.currentPage.selection.length) {
    const frame = figma.createFrame();

    frame.name = 'covr images';
    frame.resize(200, 200);

    if (data && Object.keys(data).length > 0) {
      const { x, y } = getPositionFromData(data);
      frame.x = x;
      frame.y = y;
    } else {
      figma.viewport.scrollAndZoomIntoView([frame]);
    }

    return frame.id;
  }

  return null;
});

MessageEmitter.answer(
  'selection count',
  () => figma.currentPage.selection.length
);

MessageEmitter.on('insert item', ({ data, parentId, selectionIndex }) => {
  const parentNode = figma.getNodeById(parentId);

  if (selectionIndex !== null && !parentNode) {
    replaceNodeFill(figma.currentPage.selection[selectionIndex], data);
  } else {
    if (parentNode && parentNode.type === 'FRAME') {
      const rect = figma.createRectangle();
      rect.resize(200, 200);

      const imageHash = figma.createImage(data).hash;

      rect.fills = []
        .filter((fill) => fill.type !== 'IMAGE')
        .concat({
          type: 'IMAGE',
          imageHash,
          scaleMode: 'FILL',
        });

      parentNode.layoutMode = 'VERTICAL';
      parentNode.appendChild(rect);
    }
  }
});

const NOT_VALID_FILL_NODES = [
  'GROUP',
  'SLICE',
  'CONNECTOR',
  'CODE_BLOCK',
  'WIDGET',
  'EMBED',
  'LINK_UNFURL',
  'MEDIA',
];

const replaceNodeFill = (node, data) => {
  if (
    !figma.currentPage.selection.some((node) =>
      NOT_VALID_FILL_NODES.includes(node.type)
    )
  ) {
    const fills: Paint[] = JSON.parse(JSON.stringify(node.fills || []));

    const imageHash = figma.createImage(data).hash;
    node.fills = fills
      .filter((fill) => fill.type !== 'IMAGE')
      .concat({
        type: 'IMAGE',
        imageHash,
        scaleMode: 'FILL',
      });
  }
};

MessageEmitter.on('set image', (data) => {
  const selection = figma.currentPage.selection;

  if (selection.some((node) => NOT_VALID_FILL_NODES.includes(node.type))) {
    figma.notify('Please select a valid target or use drag&drop');
  } else {
    for (const node of figma.currentPage.selection) {
      replaceNodeFill(node, data);
    }
  }
});

MessageEmitter.on('set text', async (data) => {
  const selection = figma.currentPage.selection;

  if (!selection.some((node) => node.type === 'TEXT')) {
    figma.notify('Please select at least one text layer');
  } else {
    for (const node of figma.currentPage.selection) {
      if (node && node.type === 'TEXT') {
        await getFont(node);
        node.characters = data;
      }
    }
  }
});
