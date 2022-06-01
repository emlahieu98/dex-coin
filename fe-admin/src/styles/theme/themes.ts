const lightTheme = {
  primary: '#4869DE',
  secondary: '#A3E5FD',
  secondary2: '#FF4D4F',
  // stroke: '#f0f0f0',
  stroke: '#EBEBF0',
  text: 'rgba(0, 0, 0, 0.65)',
  disabled: 'rgba(0, 0, 0, 0.25)',
  textSecondary: 'rgba(58,52,51,0.7)',
  background: 'rgba(0, 0, 0, 0.65)',
  backgroundVariant: 'rgba(251,249,249,1)',
  border: 'rgba(58,52,51,0.12)',
  borderLight: 'rgba(58,52,51,0.05)',
  // Red palette
  redPrimary: '#BE1E2D',

  // pink
  pinkPrimary: '#EE496B',

  // Blue palette
  darkBlue1: '#1C75BC',
  darkBlue2: '#1985d9',
  darkBlue3: '#3161AD',

  // Green palette
  greenMedium: '#7EA802',
  greenMedium1: '#29CC97',

  // white palette
  whitePrimary: '#FFFFFF',

  // Gray pallete
  grayPrimary: '#ddd',
  gray1: '#6c757d',

  // Orange pallete
  orangePrimary: '#EB5757',

  // Black pallete
  blackPrimary: '#000',
};

const darkTheme: Theme = {
  primary: 'rgba(220,120,95,1)',
  secondary: '#A3E5FD',
  secondary2: '#FF4D4F',
  stroke: '#D9D9D9',
  disabled: 'rgba(0, 0, 0, 0.25)',
  text: 'rgba(241,233,231,1)',
  textSecondary: 'rgba(241,233,231,0.6)',
  background: 'rgba(0,0,0,1)',
  backgroundVariant: 'rgba(28,26,26,1)',
  border: 'rgba(241,233,231,0.15)',
  borderLight: 'rgba(241,233,231,0.05)',
  // Red palette
  redPrimary: '#BE1E2D',

  // pink
  pinkPrimary: '#EE496B',

  // Blue palette
  darkBlue1: '#1C75BC',
  darkBlue2: '#1985d9',
  darkBlue3: '#3161AD',

  // Green palette
  greenMedium: '#7EA802',
  greenMedium1: '#29CC97',

  // white palette
  whitePrimary: '#FFFFFF',

  // Gray pallete
  grayPrimary: '#ddd',
  gray1: '#6c757d',

  // Orange pallete
  orangePrimary: '#EB5757',

  // Black pallete
  blackPrimary: '#000',
};

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
