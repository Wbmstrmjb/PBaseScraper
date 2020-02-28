const rp = require('request-promise');
const request = require('request');
const http = require('http');
const fs = require('fs');
const path = require('path');
const $ = require('cheerio');

const url = 'https://pbase.com/larpman/export';

const makeDirectoryFromUrl = function(url: string, rootPath: string) {
    const directory = path.basename(url);

    const fullPath = path.join(rootPath, directory);

    if (!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath);
    }

    return fullPath;
}

const processGalleries = async function(url: string, rootPath: string) {
    console.log('Processing gallery: ' + url);

    //const currentPath = makeDirectoryFromUrl(url, rootPath);

    const il = await getImageLinks(url);
    const sg = await getSubGalleries(url);

    var currentPath = rootPath;
    
    if ((sg || []).length > 0) {
        currentPath = makeDirectoryFromUrl(url, rootPath);
    }

    console.log('IL:');
    console.log(il);

    asyncForEach((il || []), async (img: string) => {
        const imgPath = path.join(currentPath, img.substring(img.length-20, img.length));
        downloadImage(img, imgPath);
        console.log(img);
    });

    console.log('SG:');
    console.log(sg);
    
    asyncForEach((sg || []), async (gallery: string) => {
        await processGalleries(gallery, currentPath);
        console.log(gallery);
    });
}

const getImageLinks = async function(url: string): Promise<string[]> {
    try {
        const html = await rp(url);
        
        const images = $('a[imgsize="original"]', html);
        const imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            imageLinks.push(images[i].attribs.imgurl);
        }
        
        return imageLinks;
    }
    catch (err) { }
}

const downloadImage = async function(url: string, imgPath: string) {
    let file = fs.createWriteStream(imgPath);
         
    await new Promise((resolve, reject) => {
        let stream = request({
            uri: url,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            gzip: true
        })
        .pipe(file)
        .on('finish', () => {
            console.log(`The file is finished downloading.`);
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
    .catch(error => {
        console.log(`Something happened: ${error}`);
    });
}

const getSubGalleries = async function(url: string): Promise<string[]> {
    try {
        const html = await rp(url);

        const galleries = $('tr > td.thumbnail > a.thumbnail', html);
        const subGalleries = [];
        for (let i = 0; i < galleries.length; i++) {
            subGalleries.push(galleries[i].attribs.href);
        }
        
        return subGalleries;
    }
    catch (err) { }
}

const asyncForEach = async function(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

processGalleries(url, './images/');