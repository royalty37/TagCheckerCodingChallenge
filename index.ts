import TagChecker from './src/TagChecker';
import * as fs from 'fs';
import * as path from 'path';

const processInputFiles = () => {
  const inputDir = path.join(__dirname, 'input');
  const outputDir = path.join(__dirname, 'output');
  
  // Create directories if they don't exist
  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
    console.log(`Created input directory: ${inputDir}`);
    console.log('Please add your test files to the input directory.');
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log('No .txt files found in input directory.');
    return;
  }
  
  const tagChecker = new TagChecker();
  
  files.forEach(filename => {
    const inputPath = path.join(inputDir, filename);
    const outputPath = path.join(outputDir, filename.replace('.txt', '_output.txt'));
    
    console.log(`Processing: ${filename}`);
    
    try {
      const content = fs.readFileSync(inputPath, 'utf-8');
      
      // First try splitting by double newlines (blank lines)
      let paragraphs = content.split(/\n\s*\n/).filter(paragraph => paragraph.trim() !== '');
      
      // If no double newlines found, split by single newlines
      if (paragraphs.length === 1) {
        paragraphs = content.split('\n').filter(line => line.trim() !== '');
      }
      
      // Clean up each paragraph by joining multiple lines and normalizing whitespace
      const cleanedParagraphs = paragraphs.map(para => {
        // If paragraph contains newlines, join them with spaces
        return para.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '')
          .join(' ')
          .trim();
      }).filter(para => para !== '');
      
      const results = cleanedParagraphs.map(paragraph => {
        const result = tagChecker.checkParagraph(paragraph);
        console.log(`  Input: ${paragraph}`);
        console.log(`  Output: ${result}`);
        return result;
      });
      
      fs.writeFileSync(outputPath, results.join('\n'));
      console.log(`  Results written to: ${outputPath}\n`);
      
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  });
}

const processSingleParagraph = (paragraph: string) => {
  const tagChecker = new TagChecker();
  const result = tagChecker.checkParagraph(paragraph);
  console.log(`Input: ${paragraph}`);
  console.log(`Output: ${result}`);
}

const main = () => {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Process single paragraph from command line
    const paragraph = args.join(' ');
    processSingleParagraph(paragraph);
  } else {
    // Process files from input directory
    processInputFiles();
  }
}

// Run if this is the main module
if (require.main === module) {
  main();
}