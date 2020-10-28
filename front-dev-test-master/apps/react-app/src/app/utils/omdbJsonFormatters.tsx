
// Formatting functions for the OMDB API copied from https://github.com/misterhat/omdb/blob/master/index.js
// No point reinventing the wheel ¯\_(ツ)_/¯
// Made a pass to make more 'TS friendly'...

export function formatYear(year: string) {
    let from: number, to: number;
    let yearSplit = year.split('–');
  
    if (yearSplit.length === 2) {
        from = +yearSplit[0];
  
        if (yearSplit[1]) {
            to = +yearSplit[1];
        }
        return { from: from, to: to };
    }
    return +yearSplit;
  }
  
  export function formatRuntime(raw: string) {
      let hours: any, minutes: any;
  
      if (!raw) {
          return null;
      }
  
      hours = raw.match(/(\d+) h/);
      minutes = raw.match(/(\d+) min/);
  
      hours = hours ? hours[1] : 0;
      minutes = minutes ? +minutes[1] : 0;
  
      return (hours * 60) + minutes;
  }
  
  export function formatList(raw: string) {
      let list: string[];
  
      if (!raw) {
          return [];
      }
  
      list = raw.replace(/\(.+?\)/g, '').split(', ');
      list = list.map(function (item) {
          return item.trim();
      });
  
      return list;
  }
  
  export function formatAwards(raw: string) {
      let wins: any, nominations: any;
  
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
