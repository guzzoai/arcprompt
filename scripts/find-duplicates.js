const { tools } = require('../lib/tools-data');

const names = tools.map(t => t.name);
const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

console.log('Duplicate tool names found:');
uniqueDuplicates.forEach(name => {
  const instances = tools.filter(t => t.name === name);
  console.log(`- ${name}: ${instances.length} instances`);
  instances.forEach((tool, i) => {
    console.log(`  [${i+1}] ID: ${tool.id}, Category: ${tool.category}, URL: ${tool.url}`);
  });
});

console.log(`\nTotal tools: ${tools.length}`);
console.log(`Unique tools: ${new Set(names).size}`);
console.log(`Duplicates to remove: ${tools.length - new Set(names).size}`);