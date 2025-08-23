// Central theme configuration - Tangerine Color Scheme
export const theme = {
  colors: {
    home: {
      primary: '#F23E2E',
      point: '#F23E2E1a',
      line: '#F23E2E80',
      gradient: {
        inner: '#B6E1F220',
        outer: '#F23E2E08'
      }
    },
    geospatial: {
      primary: '#335928',
      point: '#3359284d',
      line: '#335928cc',
      gradient: {
        inner: '#B6E1F220',
        outer: '#33592808'
      }
    },
    cinematography: {
      primary: '#F2B705',
      point: '#F2B7054d',
      line: '#F2B705cc',
      gradient: {
        inner: '#B6E1F220',
        outer: '#F2B70508'
      }
    },
    agriculture: {
      primary: '#F2B077',
      point: '#F2B0774d',
      line: '#F2B077cc',
      gradient: {
        inner: '#B6E1F220',
        outer: '#F2B07708'
      }
    },
    inspections: {
      primary: '#6B7280',
      point: '#6B72804d',
      line: '#6B7280cc',
      gradient: {
        inner: '#B6E1F220',
        outer: '#6B728008'
      }
    },
    research: {
      primary: '#2B4025',
      point: '#2B40254d',
      line: '#2B4025cc',
      gradient: {
        inner: '#B6E1F220',
        outer: '#2B402508'
      }
    },
    contact: {
      primary: '#F27405',
      point: '#F274054d',
      line: '#F27405cc',
      gradient: {
        inner: '#B6E1F220',
        outer: '#F2740508'
      }
    }
  }
};

// Helper function to get section colors
export function getSectionColors(section) {
  return theme.colors[section] || theme.colors.home;
}