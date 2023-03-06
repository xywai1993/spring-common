function getSvgLists() {
  const svgFiles = import.meta.glob('/src/assets/svg/**/*.svg', { eager: true });

  const list = [];
  for (const i in svgFiles) {
    list.push(
      i.replace('/src/assets/svg/', '').replace('.svg', '').replace(new RegExp('/', 'g'), '-'),
    );
  }
  return list;
}

export default {
  prefix: 'sa',
  icons: getSvgLists(),
};
