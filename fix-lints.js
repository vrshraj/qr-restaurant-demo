const fs = require('fs');

const fileReplacements = {
  'bg-\\[var\\(--surface\\)\\]': 'bg-(--surface)',
  'bg-\\[var\\(--border\\)\\]': 'bg-border',
  'text-\\[var\\(--text-primary\\)\\]': 'text-foreground',
  'text-\\[var\\(--text-muted\\)\\]': 'text-muted',
  'bg-\\[var\\(--surface-2\\)\\]': 'bg-(--surface-2)',
  'border-\\[var\\(--border\\)\\]': 'border-border',
  'divide-\\[var\\(--border\\)\\]': 'divide-border',
  'text-\\[var\\(--text-secondary\\)\\]': 'text-(--text-secondary)',
  'text-\\[var\\(--border\\)\\]': 'text-border',
  'active:bg-\\[var\\(--surface-2\\)\\]': 'active:bg-(--surface-2)',
  'tracking-\\[0.1em\\]': 'tracking-widest'
};

const files = [
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/AssistSheet.tsx',
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/CartDrawer.tsx',
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/MyOrderSheet.tsx',
  'v:/All Projects/ros/Demo/Desktop/qr-demo/src/components/OfferBanner.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    for (const [key, value] of Object.entries(fileReplacements)) {
      const regex = new RegExp(key, 'g');
      if (regex.test(content)) {
          content = content.replace(regex, value);
          modified = true;
      }
    }
    if (modified) {
       fs.writeFileSync(file, content);
    }
  }
});
console.log('Linting applied successfully.');
