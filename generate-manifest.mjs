// ========================================
// Auto-Drawing Manifest Generator
// This script runs before build to generate drawings-manifest.json
// from PDFs in the /public/drawings/ folder
// 
// Filename format: [PREFIX]-[NUMBER]_[TITLE]_[DATE]_[STATUS].pdf
// Example: A-001_Floor-Plan_2024-03-01_Current.pdf
// 
// Supported prefixes:
// G = General, A = Architectural, S = Structural, M = Mechanical
// E = Electrical, C = Civil, B = Building, P = Plumbing
// F = Fire Protection, T = Telecommunications
// ========================================

import fs from 'fs';
import path from 'path';

const DISCIPLINE_MAP = {
  'G': 'General',
  'A': 'Architectural',
  'S': 'Structural',
  'M': 'Mechanical',
  'E': 'Electrical',
  'C': 'Civil',
  'B': 'Building',
  'P': 'Plumbing',
  'F': 'Fire Protection',
  'T': 'Telecommunications',
};

const drawingsDir = path.join(process.cwd(), 'public', 'drawings');
const manifestPath = path.join(process.cwd(), 'public', 'drawings-manifest.json');

function parseFilename(filename) {
  // Remove .pdf extension
  const name = filename.replace(/\.pdf$/i, '');
  
  // Split by underscore
  const parts = name.split('_');
  
  if (parts.length < 2) {
    return null;
  }
  
  // First part should be sheet number (e.g., "A-001")
  const sheetNumber = parts[0];
  const prefixMatch = sheetNumber.match(/^([A-Za-z])/);
  const prefix = prefixMatch ? prefixMatch[1].toUpperCase() : 'G';
  
  // Second part is title
  const title = parts[1] || 'Untitled';
  
  // Use current date (when build runs) since GitHub doesn't preserve upload dates
  const now = new Date();
  const date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
  
  // Fourth part (optional) is status
  const status = parts[3] || 'Current';
  
  return {
    sheetNumber,
    title: title.replace(/-/g, ' '),
    discipline: DISCIPLINE_MAP[prefix] || 'Other',
    date,
    status,
    file: `/drawings/${filename}`,
    description: `${DISCIPLINE_MAP[prefix] || 'Engineering'} drawing - ${sheetNumber}`
  };
}

function generateManifest() {
  console.log('🎨 Generating drawings manifest...');
  
  // Check if drawings directory exists
  if (!fs.existsSync(drawingsDir)) {
    console.log('⚠️  No drawings directory found, creating empty manifest');
    fs.writeFileSync(manifestPath, JSON.stringify({ drawings: [], generated: new Date().toISOString() }, null, 2));
    return;
  }
  
  // Read all PDF files
  const files = fs.readdirSync(drawingsDir).filter(f => f.toLowerCase().endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log('⚠️  No PDF files found in drawings folder');
    fs.writeFileSync(manifestPath, JSON.stringify({ drawings: [], generated: new Date().toISOString() }, null, 2));
    return;
  }
  
  console.log(`📄 Found ${files.length} drawing(s)`);
  
  // Parse each file
  const drawings = files
    .map(filename => {
      const drawing = parseFilename(filename);
      if (drawing) {
        console.log(`  ✓ ${drawing.sheetNumber}: ${drawing.title} (${drawing.discipline})`);
      }
      return drawing;
    })
    .filter(d => d !== null);
  
  // Sort by sheet number
  drawings.sort((a, b) => {
    const aPrefix = a.sheetNumber.match(/^([A-Za-z])/)?.[1] || '';
    const bPrefix = b.sheetNumber.match(/^([A-Za-z])/)?.[1] || '';
    const aNum = parseInt(a.sheetNumber.match(/(\d+)/)?.[1] || '0');
    const bNum = parseInt(b.sheetNumber.match(/(\d+)/)?.[1] || '0');
    
    if (aPrefix !== bPrefix) {
      return aPrefix.localeCompare(bPrefix);
    }
    return aNum - bNum;
  });
  
  // Write manifest
  const manifest = {
    drawings,
    generated: new Date().toISOString(),
    total: drawings.length
  };
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest generated: ${drawings.length} drawings`);
}

generateManifest();
