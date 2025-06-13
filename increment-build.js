const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Get current build number
let buildNumber = appJson.expo.ios?.buildNumber || '1.1.0';
let [major, minor, patch] = buildNumber.split('.').map(Number);

// Increment patch version (or modify as needed)
patch += 1;
buildNumber = `${major}.${minor}.${patch}`;

// Update app.json
appJson.expo.ios = { ...appJson.expo.ios, buildNumber };
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

console.log(`Updated iOS buildNumber to ${buildNumber}`);
