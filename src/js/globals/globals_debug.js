const isDebugMode = true;

const debugState = {
  lang: { skip: true, lang: 'pt_BR' },
  name: { skip: true, name: 'Username' },
  menu: { skip: true, id: 1 },
  customMenu: {
    skip: true,
    getData: () => {
      return { mode: 'b', operation: 'minus', difficulty: 2, label: true };
    },
  },
  map: { skip: true },
  end: { skip: false, stop: false },
};

const debugFunctions = {
  grid: () => {
    const grid = 2;
    const h = 1920 / (grid + 0.5);
    const v = 1080 / (grid + 0.5);
    for (let i = 0; i < grid; i++) {
      game.add.geom.rect(
        h / 2 + i * h,
        0,
        h / 2,
        1080,
        '',
        0,
        colors.blue,
        0.3
      );
      game.add.geom.rect(
        0,
        v / 2 + i * v,
        1920,
        v / 2,
        '',
        0,
        colors.blue,
        0.3
      );
    }
  },
};
