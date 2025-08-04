const fs = require('fs');
const path = require('path');

// Read the current tools data file
const toolsDataPath = path.join(__dirname, '../lib/tools-data.ts');
const content = fs.readFileSync(toolsDataPath, 'utf-8');

// Extract the tools array using regex
const toolsMatch = content.match(/export const tools: Tool\[\] = (\[[\s\S]*?\])/);
if (!toolsMatch) {
  console.error('Could not find tools array in file');
  process.exit(1);
}

const toolsArrayText = toolsMatch[1];
const tools = JSON.parse(toolsArrayText);

console.log(`Original tools count: ${tools.length}`);

// Find duplicates and select best version
const seenNames = new Map();
const uniqueTools = [];

tools.forEach(tool => {
  const normalizedName = tool.name.trim().toLowerCase();
  
  if (!seenNames.has(normalizedName)) {
    // First occurrence - add it
    seenNames.set(normalizedName, tool);
    uniqueTools.push(tool);
  } else {
    // Duplicate found - compare and keep the better one
    const existing = seenNames.get(normalizedName);
    const current = tool;
    
    // Scoring criteria (higher is better):
    // - More complete description (longer)
    // - More tags
    // - More roles
    // - More detailed pricing info
    // - Prefer newer/updated URLs
    
    const existingScore = 
      (existing.description?.length || 0) * 0.1 +
      (existing.tags?.length || 0) * 2 +
      (existing.roles?.length || 0) * 2 +
      (existing.pricing?.length || 0) * 0.1 +
      (existing.url?.includes('openai.com') ? 5 : 0) + // Prefer official sites
      (existing.url?.includes('https://') ? 1 : 0);
      
    const currentScore = 
      (current.description?.length || 0) * 0.1 +
      (current.tags?.length || 0) * 2 +
      (current.roles?.length || 0) * 2 +
      (current.pricing?.length || 0) * 0.1 +
      (current.url?.includes('openai.com') ? 5 : 0) +
      (current.url?.includes('https://') ? 1 : 0);
    
    if (currentScore > existingScore) {
      // Replace with better version
      const index = uniqueTools.findIndex(t => t.name.toLowerCase() === normalizedName);
      if (index !== -1) {
        uniqueTools[index] = current;
        seenNames.set(normalizedName, current);
        console.log(`Replaced ${tool.name} (score: ${existingScore.toFixed(1)} -> ${currentScore.toFixed(1)})`);
      }
    } else {
      console.log(`Keeping existing ${tool.name} (score: ${currentScore.toFixed(1)} vs ${existingScore.toFixed(1)})`);
    }
  }
});

// Reassign IDs sequentially
uniqueTools.forEach((tool, index) => {
  tool.id = index + 1;
});

console.log(`\nDeduplication complete:`);
console.log(`Original: ${tools.length} tools`);
console.log(`Deduplicated: ${uniqueTools.length} tools`);
console.log(`Removed: ${tools.length - uniqueTools.length} duplicates`);

// Generate the new file content
const newContent = content.replace(
  /export const tools: Tool\[\] = \[[\s\S]*?\]/,
  `export const tools: Tool[] = ${JSON.stringify(uniqueTools, null, 2)}`
);

// Write the deduplicated file
fs.writeFileSync(toolsDataPath, newContent);
console.log(`\nUpdated ${toolsDataPath} with deduplicated tools`);

// Show category distribution
const categoryStats = {};
uniqueTools.forEach(tool => {
  categoryStats[tool.category] = (categoryStats[tool.category] || 0) + 1;
});
console.log('\nCategory distribution after deduplication:');
Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`${category}: ${count} tools`);
  });