// const axios = require('axios');
// const cheerio = require('cheerio');

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import yts from 'yt-search';

const playlists = [
  {
      url: "https://gaana.com/playlist/gaana-dj-bollywood-top-50-1",
      category: "bollywood"
  },
  {
      url: "https://gaana.com/playlist/gaana-dj-punjabi-top-50-1",
      category: "punjabi"
  },
  {
      url: "https://gaana.com/playlist/gaana-dj-hip-hop-ind",
      category: "rap"
  }
];

const dbPath = './db.json';

let dbData;

function readDB() {
  let existingData = [];
  if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath);
      existingData = JSON.parse(fileData);
  }

  dbData = existingData;
}

function addToDB(songItem, category) {
  readDB();
  const dataMap = {};
  dbData.forEach(item => {
      dataMap[item.name] = { ...item };
  });
  
  if(dataMap[songItem.name] && !dataMap[songItem.name].category.includes(category)) {
    dataMap[songItem.name].category.push(category);
  } else if(!dataMap[songItem.name]) {
    dataMap[songItem.name] = { ...songItem };
  }

  fs.writeFileSync(dbPath, JSON.stringify(Object.values(dataMap)));

}

async function searchYouTube(songName) {
  try {
      const results = await yts('\"' + songName + ' audio\"');
      if (results.videos.length > 0) {
          return results.videos[0].url;
      } else {
          return '';
      }
  } catch (error) {
      return '';
  }
}

async function scrapePlaylist(url, category) {
  try {
      const { data } = await axios.get(url);

      const $ = cheerio.load(data);

      const urlElements = $('ul.list_data');
      let num = 0;
      let songsList = [];

      urlElements.each(async (i, elem) => {
          const $elem = $(elem);
          const songUrl = 'https://gaana.com' + $elem.find('a').attr('href');
          const songName = $elem.find('span.t_over').contents().filter(function() {
              return this.nodeType === 3; // Node.TEXT_NODE
          }).map(function() {
            if($(this).text().trim() == ',') return '';
              return $(this).text().trim();
          }).get().filter(text => text.length > 0).join(' ');
          const artists = $elem.find('a._link').map((i, el) => $(el).text()).get();
          num += 1;

          const ytlink = await searchYouTube(`${songName} ${artists[0]}`)
          if(ytlink?.length == 0) {
            console.log(songName);
            return;
          }

          const songItem = {
            name: songName,
            arists: artists,
            ytlink: ytlink,
            category: [category]
          };

          addToDB(songItem, category);
      });


  } catch (error) {
      console.error('Error fetching the page:', error);
  }
}


async function main() {
  playlists.forEach(async playlist => {
    await scrapePlaylist(playlist.url, playlist.category);
  })
}

main();

