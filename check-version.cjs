const fs = require("fs");
const packageJson = require("./package.json");

const packageFile = packageJson;
let currentVersion = packageJson.version;
let [major, minor, patch] = currentVersion
  .split(".")
  ?.map((item) => parseInt(item));

let newVersion = "";

if (patch === 9) {
  let newPatch = 0;
  let newMinor = minor + 1;
  let newMajor = major;

  if (newMinor > 9) {
    newMinor = 0;
    newMajor = major + 1;
  }

  newVersion = `${newMajor}.${newMinor}.${newPatch}`;
} else {
  let newPatch = patch + 1;
  let newMinor = minor;
  let newMajor = major;

  newVersion = `${newMajor}.${newMinor}.${newPatch}`;
}

if (newVersion !== currentVersion) {
  packageFile.version = newVersion;

  fs.writeFileSync("./package.json", JSON.stringify(packageFile, null, 2));
  console.log(`Version updated to ${newVersion}`);
} else {
  console.log("No version update required");
}
