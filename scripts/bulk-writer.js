import { execSync } from 'child_process';

const count = 50;
console.log(`Starting bulk writing of ${count} articles...`);

// Helper for sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  for (let i = 1; i <= count; i++) {
    console.log(`\n--- Writing Article ${i}/${count} ---`);
    try {
      // Execute the auto-writer script
      const output = execSync('node scripts/auto-writer.js', { encoding: 'utf-8' });
      console.log(output.trim());
      
      // Check if the script skipped because no new articles were found
      if (output.includes('All recent articles have already been published')) {
        console.log('No more new articles available in RSS feeds. Stopping.');
        break;
      }
      
      // Sleep for 3 seconds to avoid any API rate limits
      console.log('Sleeping 3 seconds...');
      await sleep(3000);
    } catch (error) {
      console.error(`Error writing article ${i}:`, error.message);
      // Wait a bit longer if there was an error (e.g. rate limit)
      await sleep(10000);
    }
  }

  console.log('\nBulk writing complete! Committing and pushing all new articles to GitHub...');
  try {
    execSync('git add src/content/blog/', { stdio: 'inherit' });
    // Check if there are changes staged
    const status = execSync('git diff --staged --name-only', { encoding: 'utf-8' });
    if (status.trim() === '') {
      console.log('No new articles to commit.');
      return;
    }
    execSync('git commit -m "Auto-post: Generate new marketing and technology articles in bulk"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('Successfully pushed all articles to GitHub!');
  } catch (gitError) {
    console.error('Failed to commit and push changes:', gitError.message);
  }
}

run();
