const fs = require('fs');
const path = require('path');

const packsPath = path.join(__dirname, "packs");

const definitions = [];
const names = [];
fs.readdirSync(packsPath).forEach(function(pack) {
  const packName = pack.split('.')[0];
  names.push(packName);
  const def = fs.readFileSync(path.join(packsPath, pack), 'utf8');
  definitions.push(def.replace('definition', packName));
});

fs.writeFileSync('dist/packs.js', `${definitions.join("\n")}\nconst definitions = [${names.join(',')}];`);
