import fs from 'fs';
import path from 'path';

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.startsWith('---')) return; // Already migrated

  const lines = content.split('\n');
  let taskName = '';
  let date = '';
  let link = '';
  let taskType = '';
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      if (!taskName) taskName = line.replace(/^#\s*/, '').trim();
    } else if (line.startsWith('Date:')) {
      date = line.replace(/^Date:\s*/, '').trim();
    } else if (line.startsWith('LINK:')) {
      link = line.replace(/^LINK:\s*/, '').trim();
    } else if (line.startsWith('Task Type:')) {
      taskType = line.replace(/^Task Type:\s*/, '').trim();
    }
    
    // Find the end of this metadata block
    if (i > 0 && line === '' && date && link) {
        // Keep looking or just assume it's somewhere here
    }
  }
  
  if (!taskName) {
    taskName = path.basename(filePath, '.md').replace(/ [a-f0-9]{32}$/, '').trim();
  }

  const frontmatter = [
    '---',
    `Task: "${taskName.replace(/"/g, '\\"')}"`,
    date ? `Date: "${date}"` : '',
    link ? `LINK: "${link}"` : '',
    taskType ? `Task Type: "${taskType}"` : '',
    '---',
    ''
  ].filter(Boolean).join('\n');

  fs.writeFileSync(filePath, frontmatter + '\n' + content);
  console.log(`Migrated ${path.basename(filePath)}`);
}

function migrateDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      migrateFile(path.join(dir, file));
    }
  }
}

migrateDir('ref/Work Dashboard/To Do List/To Do List');
migrateDir('data/uploads');
