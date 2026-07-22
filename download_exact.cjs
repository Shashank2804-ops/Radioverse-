const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const files = [
  {
    key: "deltoid-muscle",
    title: "File:Deltoid Muscle.png",
    aliases: ["deltoid"]
  },
  {
    key: "biceps-brachii",
    title: "File:Biceps brachii muscle06.png",
    aliases: ["biceps"]
  },
  {
    key: "triceps",
    title: "File:Triceps brachii muscle06.png",
    aliases: ["triceps-brachii"]
  },
  {
    key: "quadriceps-femoris",
    title: "File:Quadriceps.png",
    aliases: ["quadriceps"],
    fallbackTitle: "File:202304 Quadriceps femoris muscle.svg"
  }
];

function curlGet(url) {
  const cmd = `curl -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36" "${url}"`;
  return execSync(cmd).toString();
}

function curlDownload(url, dest) {
  const cmd = `curl -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36" -o "${dest}" "${url}"`;
  execSync(cmd);
}

async function resolveAndDownload(item, publicDir, muscularDir) {
  console.log(`\nResolving: ${item.key} (Title: ${item.title})`);
  let fileTitle = item.title;
  let infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  let infoBody = curlGet(infoUrl);
  let infoData = JSON.parse(infoBody);
  let pages = infoData.query.pages;
  let pageId = Object.keys(pages)[0];
  let page = pages[pageId];

  // If missing or not found, try fallback if available
  if (pageId === "-1" && item.fallbackTitle) {
    console.log(`Main file not found, trying fallback: ${item.fallbackTitle}`);
    fileTitle = item.fallbackTitle;
    infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
    infoBody = curlGet(infoUrl);
    infoData = JSON.parse(infoBody);
    pages = infoData.query.pages;
    pageId = Object.keys(pages)[0];
    page = pages[pageId];
  }

  if (page.imageinfo && page.imageinfo[0]) {
    let imageUrl = page.imageinfo[0].url;
    console.log(`Resolved URL: ${imageUrl}`);

    // Convert SVG to PNG thumbnail if needed
    if (imageUrl.toLowerCase().endsWith(".svg")) {
      console.log(`Resolving PNG thumbnail for SVG...`);
      const thumbUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
      const thumbBody = curlGet(thumbUrl);
      const thumbData = JSON.parse(thumbBody);
      const tPages = thumbData.query.pages;
      const tPageId = Object.keys(tPages)[0];
      const tPage = tPages[tPageId];
      if (tPage.imageinfo && tPage.imageinfo[0] && tPage.imageinfo[0].thumburl) {
        imageUrl = tPage.imageinfo[0].thumburl;
        console.log(`Resolved SVG PNG thumbnail: ${imageUrl}`);
      }
    }

    const extension = imageUrl.toLowerCase().endsWith(".png") ? "png" : "jpg";
    const tempDest = path.join(publicDir, `_temp_exact_${item.key}.${extension}`);

    console.log(`Downloading...`);
    curlDownload(imageUrl, tempDest);
    console.log(`Download complete.`);

    const destPaths = [
      path.join(publicDir, `${item.key}.jpg`),
      path.join(muscularDir, `${item.key}.jpg`)
    ];

    for (const alias of item.aliases) {
      destPaths.push(path.join(publicDir, `${alias}.jpg`));
      destPaths.push(path.join(muscularDir, `${alias}.jpg`));
    }

    for (const dest of destPaths) {
      fs.copyFileSync(tempDest, dest);
      console.log(`Saved to: ${dest}`);
    }

    fs.unlinkSync(tempDest);
    console.log(`Successfully completed all paths for ${item.key}!`);
  } else {
    console.log(`Error: Could not resolve URL for ${fileTitle}`);
  }
}

async function main() {
  const publicDir = path.join(__dirname, "public");
  const muscularDir = path.join(__dirname, "public", "assets", "anatomy", "muscular");

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(muscularDir)) fs.mkdirSync(muscularDir, { recursive: true });

  for (const item of files) {
    try {
      await resolveAndDownload(item, publicDir, muscularDir);
    } catch (e) {
      console.error(`Failed to process ${item.key}:`, e.message);
    }
  }

  console.log("\n========================================");
  console.log("All exact downloads completed successfully!");
}

main();
