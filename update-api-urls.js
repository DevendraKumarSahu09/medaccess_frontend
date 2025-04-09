import replaceInFile from 'replace-in-file';

const options = {
  files: [
    'src/**/*.js',
    'src/**/*.jsx',
  ],
  from: /http:\/\/localhost:5000/g,
  to: 'https://medaccess-backend.onrender.com',
};

try {
  const results = replaceInFile.sync(options);
  console.log('Replacement results:', results);
  console.log('Total files modified:', results.filter(result => result.hasChanged).length);
} catch (error) {
  console.error('Error occurred:', error);
} 