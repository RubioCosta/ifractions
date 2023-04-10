const isDebugMode = true;

const debugState = {
  lang: { status: true, lang: 'it_IT' },
  name: { status: true, name: 'Username' },
  menu: { status: true, id: 0 },
  customMenu: {
    status: true,
    getData: () => {
      return { mode: 'b', operation: 'plus', difficulty: 1, label: true };
    },
  },
  map: { status: true },
  end: { status: false, stop: false },
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
