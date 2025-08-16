// Central theme configuration
export const theme = {
  colors: {
    home: {
      primary: '#ffffff',
      point: '#ffffff1a',
      line: '#ffffff80',
      gradient: {
        inner: '#04785709',
        outer: '#064e3b26'
      }
    },
    geospatial: {
      primary: '#b8430d',
      point: '#b8430d4d',
      line: '#b8430dcc',
      gradient: {
        inner: '#b8430d09',
        outer: '#92220626'
      }
    },
    cinematography: {
      primary: '#14b8a6',
      point: '#2dd4bf4d',
      line: '#14b8a6cc',
      gradient: {
        inner: '#2dd4bf09',
        outer: '#14b8a626'
      }
    },
    agriculture: {
      primary: '#22c55e',
      point: '#22c55e4d',
      line: '#22c55ecc',
      gradient: {
        inner: '#22c55e09',
        outer: '#16a34a26'
      }
    },
    inspections: {
      primary: '#6366f1',
      point: '#6366f14d',
      line: '#6366f1cc',
      gradient: {
        inner: '#6366f109',
        outer: '#4f46e526'
      }
    },
    research: {
      primary: '#a855f7',
      point: '#a855f74d',
      line: '#a855f7cc',
      gradient: {
        inner: '#a855f709',
        outer: '#9333ea26'
      }
    },
    contact: {
      primary: '#f59e0b',
      point: '#f59e0b4d',
      line: '#f59e0bcc',
      gradient: {
        inner: '#f59e0b09',
        outer: '#d9770626'
      }
    }
  }
};

// Helper function to get section colors
export function getSectionColors(section) {
  return theme.colors[section] || theme.colors.home;
}