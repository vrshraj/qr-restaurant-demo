const fs = require('fs');
const files = [
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/CartDrawer.tsx',
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/MyOrderSheet.tsx',
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/AssistSheet.tsx'
];

const colorMap = {
  'bg-white': 'bg-[var(--surface)]',
  'bg-\\[#FAF8F5\\]\\/50': 'bg-[var(--surface-2)]',
  'bg-\\[#FAF8F5\\]': 'bg-[var(--surface-2)]',
  'bg-\\[#F0EEE9\\]': 'bg-[var(--surface-2)]',
  'bg-\\[#F4F3F0\\]': 'bg-[var(--surface-2)]',
  'bg-\\[#E2DED8\\]': 'bg-[var(--border)]',
  'text-\\[#1A1714\\]': 'text-[var(--text-primary)]',
  'text-\\[#A09890\\]': 'text-[var(--text-muted)]',
  'text-\\[#6B6460\\]': 'text-[var(--text-secondary)]',
  'text-\\[#C4BDB6\\]': 'text-[var(--text-muted)]',
  'border-\\[#E2DED8\\]': 'border-[var(--border)]',
  'border-\\[#F0EEE9\\]': 'border-[var(--border)]',
  'divide-\\[#F0EEE9\\]': 'divide-[var(--border)]',
  'text-\\[#E2DED8\\]': 'text-[var(--border)]',
  'active:bg-\\[#FAF8F5\\]': 'active:bg-[var(--surface-2)]'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(colorMap)) {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  }
  fs.writeFileSync(file, content);
});
console.log('Replaced colors in 3 files');
