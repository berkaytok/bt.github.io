// Central theme configuration - Tangerine Color Scheme
export const theme = {
  colors: {
    home: {
      primary: '#ffffff',
      point: '#ffffff1a',
      line: '#ffffff80',
      gradient: {
        inner: '#C2BB0009',
        outer: '#00354726'
      }
    },
    geospatial: {
      primary: '#005E54',
      point: '#005E544d',
      line: '#005E54cc',
      gradient: {
        inner: '#005E5409',
        outer: '#00354726'
      }
    },
    cinematography: {
      primary: '#C2BB00',
      point: '#C2BB004d',
      line: '#C2BB00cc',
      gradient: {
        inner: '#C2BB0009',
        outer: '#00354726'
      }
    },
    agriculture: {
      primary: '#E1523D',
      point: '#E1523D4d',
      line: '#E1523Dcc',
      gradient: {
        inner: '#E1523D09',
        outer: '#00354726'
      }
    },
    inspections: {
      primary: '#ED8B16',
      point: '#ED8B164d',
      line: '#ED8B16cc',
      gradient: {
        inner: '#ED8B1609',
        outer: '#00354726'
      }
    },
    research: {
      primary: '#005E54',
      point: '#005E544d',
      line: '#005E54cc',
      gradient: {
        inner: '#005E5409',
        outer: '#00354726'
      }
    },
    contact: {
      primary: '#C2BB00',
      point: '#C2BB004d',
      line: '#C2BB00cc',
      gradient: {
        inner: '#C2BB0009',
        outer: '#E1523D26'
      }
    }
  }
};

// Helper function to get section colors
export function getSectionColors(section) {
  return theme.colors[section] || theme.colors.home;
}