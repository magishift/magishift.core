// /**
//  * src/generator/index.ts
//  *
//  * Exports the generators so plop knows them
//  */

// import { exec } from 'child_process';
// import { accessSync, constants } from 'fs';
// import * as path from 'path';
// import componentGenerator from './component/index.js';
// import containerGenerator from './container/index.js';
// import languageGenerator from './language/index.js';

// module.exports = plop => {
//   plop.setGenerator('component', componentGenerator);
//   plop.setGenerator('container', containerGenerator);
//   plop.setGenerator('language', languageGenerator);
//   plop.addHelper('directory', comp => {
//     try {
//       accessSync(
//         path.join(__dirname, `../../app/containers/${comp}`),
//         constants.F_OK,
//       );
//       return `containers/${comp}`;
//     } catch (e) {
//       return `components/${comp}`;
//     }
//   });
//   plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
//   plop.setActionType('prettify', (answers, config) => {
//     const folderPath = `${path.join(
//       __dirname,
//       '/../../app/',
//       config.path,
//       plop.getHelper('properCase')(answers.name),
//       '**.js',
//     )}`;
//     exec(`npm run prettify -- "${folderPath}"`);
//     return folderPath;
//   });
// };
