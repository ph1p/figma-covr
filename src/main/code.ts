import MessageEmitter from '../utils/MessageEmitter';
import './store';

figma.showUI(__html__, {
  width: 300,
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

MessageEmitter.on('drop image', (data) => {
  const { dropPosition, windowSize, offset, image } = data;

  // Thanks to @jackiecorn https://github.com/jackiecorn/figma-plugin-drag-and-drop
  const bounds = figma.viewport.bounds;
  const zoom = figma.viewport.zoom;
  const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;

  const xFromCanvas = hasUI
    ? dropPosition.clientX - leftPaneWidth
    : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 48 : dropPosition.clientY;

  const rect = figma.createRectangle();
  rect.resize(200, 200);
  figma.currentPage.appendChild(rect);

  rect.x = bounds.x + xFromCanvas / zoom - offset.x;
  rect.y = bounds.y + yFromCanvas / zoom - offset.y;

  const imageHash = figma.createImage(image).hash;

  rect.fills = []
    .filter((fill) => fill.type !== 'IMAGE')
    .concat({
      type: 'IMAGE',
      imageHash,
      scaleMode: 'FILL',
    });
});

MessageEmitter.on('set image', (data) => {
  const selection = figma.currentPage.selection;

  if (
    !selection.some((node) => node.type !== 'GROUP' && node.type !== 'SLICE')
  ) {
    figma.notify('Please select a valid target or use drag&drop');
  } else {
    for (const node of figma.currentPage.selection) {
      if (node && node.type !== 'GROUP' && node.type !== 'SLICE') {
        const imageHash = figma.createImage(data).hash;

        const fills: Paint[] = JSON.parse(JSON.stringify(node.fills || []));

        node.fills = fills
          .filter((fill) => fill.type !== 'IMAGE')
          .concat({
            type: 'IMAGE',
            imageHash,
            scaleMode: 'FILL',
          });
      }
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
