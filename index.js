import axios from "axios";
import * as cheerio from "cheerio";
import fs, { read } from "fs";
import yts from "yt-search";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import { randomUUID } from 'crypto';

const playlists = [
    {
        url: "https://gaana.com/playlist/gaana-dj-bollywood-top-50-1",
        category: "bollywood",
    },
    {
        url: "https://gaana.com/playlist/gaana-dj-punjabi-top-50-1",
        category: "punjabi",
    },
    {
        url: "https://gaana.com/playlist/gaana-dj-hip-hop-ind",
        category: "rap",
    },
];

const dbPath = "./db.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let dbData;

function readDB() {
    let existingData = [];
    if (fs.existsSync(dbPath)) {
        const fileData = fs.readFileSync(dbPath);
        existingData = JSON.parse(fileData);
    }

    dbData = existingData;
}

async function addToDB(songItem, category) {
    const dataMap = {};
    dbData.forEach((item) => {
        dataMap[item.name] = { ...item };
    });

    if (
        dataMap[songItem.name] &&
        !dataMap[songItem.name].category.includes(category)
    ) {
        dataMap[songItem.name].category.push(category);
    } else if (!dataMap[songItem.name]) {
        const id = randomUUID();
        songItem.id = id;
        dataMap[songItem.name] = { ...songItem };

        // const downloadMap = {
        //     0: 1,
        //     1: 3,
        //     2: 5,
        //     3: 10,
        //     4: 15,
        //     5: 30
        // };

        // const keys = Object.keys(downloadMap);

        // for (let i = 0; i < keys.length; i++) {
        //     const key = keys[i];
        //     const duration = downloadMap[key];
        //     const outputFilePath = `./songs/${id}-${key}.mp3`;
        //     console.log(outputFilePath);

        //     await new Promise((resolve, reject) => {
        //         const stream = ytdl(songItem.ytlink, {
        //             filter: 'audioonly',
        //             quality: 'highestaudio',
        //         }).on('response', () => {
        //             ffmpeg(stream)
        //                 .audioBitrate(128)
        //                 .setStartTime(0)
        //                 .setDuration(duration)
        //                 .save(outputFilePath)
        //                 .on('end', () => {
        //                     console.log(`Downloaded ${songItem.name} as ${outputFilePath}`);
        //                     resolve();
        //                 })
        //                 .on('error', (err) => {
        //                     console.error(`Error processing ${songItem.name}: ${err.message}`);
        //                     reject(err);
        //                 });
        //         }).on('error', (err) => {
        //             console.error(`Error downloading ${songItem.name}: ${err.message}`);
        //             reject(err);
        //         });
        //     });

        //     await delay(5000);
        // }
    }

    dbData = Object.values(dataMap);
}

async function searchYouTube(songName) {
    try {
        const results = await yts(songName + ' lyrics');
        if (results.videos.length > 0) {
            return results.videos[0].url;
        } else {
            return "";
        }
    } catch (error) {
        console.log(error);
        return "";
    }
}

async function scrapePlaylist(url, category) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(url);

            const $ = cheerio.load(data);

            const urlElements = $("ul.list_data");
            let num = 0;

            for(let i = 0; i < urlElements.length; i++) {
                const elem = urlElements[i];
                const $elem = $(elem);
                const songUrl =
                    "https://gaana.com" + $elem.find("a").attr("href");
                const songName = $elem
                    .find("span.t_over")
                    .contents()
                    .filter(function () {
                        return this.nodeType === 3; // Node.TEXT_NODE
                    })
                    .map(function () {
                        if ($(this).text().trim() == ",") return "";
                        return $(this).text().trim();
                    })
                    .get()
                    .filter((text) => text.length > 0)
                    .join(" ");
                const artists = $elem
                    .find("a._link")
                    .map((i, el) => $(el).text())
                    .get();

                const ytlink = await searchYouTube(`${songName} ${artists[0]}`);
                if (ytlink?.length == 0) {
                    console.log(
                        `Failed to find a yt link suitable for - ${songName} by ${artists}`
                    );
                    num += 1;
                    if (num === urlElements.length) {
                        resolve();
                    }
                    return;
                }

                const songItem = {
                    name: songName,
                    artists: artists,
                    ytlink: ytlink,
                    category: [category],
                };

                // await delay(5000);
                addToDB(songItem, category);
                num += 1;

                if (num === urlElements.length) {
                    resolve();
                }
            };
        } catch (error) {
            console.error("Error fetching the page:", error);
            reject(error);
        }
    });
}

async function main() {
    readDB();

    const scraperPromise = new Promise(async (resolve, reject) => {
        for (const [index, value] of playlists.entries()) {
            await scrapePlaylist(value.url, value.category);
            console.log(`${value.category} scraped`);

            if (index === playlists.length - 1) resolve();
        }
    });

    scraperPromise.then(() => {
        console.log("Done Scraping, Writing to Database");
        fs.writeFileSync(dbPath, JSON.stringify(dbData));
        console.log("Fin!");
    });
}

main();
