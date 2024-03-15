type ColorMap = {
  [key: string]: string;
};

export const Colors = (color: string): string | undefined => {
  const colorMap: ColorMap = {
    green: '#4bce97',
    yellow_dark: '#946f00',
    orange: '#faa53d',
    red: '#f87462',
    red_dark: '#ca3521',
    blue: '#579dff',
    sky_dark: '#1d7f8c',
    black_light: '#dcdfe4',
    pink_dark: '#ae4787',
    purple: '#9f8fef',
    // add more colors from trello labels
  };

  return colorMap[color];
};
