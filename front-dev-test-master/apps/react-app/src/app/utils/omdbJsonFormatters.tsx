
// Formatting functions for the OMDB API copied from https://github.com/misterhat/omdb/blob/master/index.js
// No point reinventing the wheel ¯\_(ツ)_/¯
// TODO: Worth having another pass to make TS friendly...

export function formatYear(year) {
    var from, to;
    year = year.split('–');
  
    if (year.length === 2) {
        from = +year[0];
  
        if (year[1]) {
            to = +year[1];
        }
        return { from: from, to: to };
    }
    return +year;
  }
  
  export function formatRuntime(raw) {
      var hours, minutes;
  
      if (!raw) {
          return null;
      }
  
      hours = raw.match(/(\d+) h/);
      minutes = raw.match(/(\d+) min/);
  
      hours = hours ? hours[1] : 0;
      minutes = minutes ? +minutes[1] : 0;
  
      return (hours * 60) + minutes;
  }
  
  export function formatList(raw) {
      var list;
  
      if (!raw) {
          return [];
      }
  
      list = raw.replace(/\(.+?\)/g, '').split(', ');
      list = list.map(function (item) {
          return item.trim();
      });
  
      return list;
  }
  
  export function formatAwards(raw) {
      var wins, nominations;
  
      if (!raw) {
          return { wins: 0, nominations: 0, text: '' };
      }
  
      wins = raw.match(/(\d+) wins?/i);
      nominations = raw.match(/(\d+) nominations?/i);
  
      return {
          wins: wins ? +wins[1] : 0,
          nominations: nominations ? +nominations[1] : 0,
          text: raw
      };
  }
