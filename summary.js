import pkg from './package.json';

const summary = `/*!
  ${pkg.title} - v${pkg.version}
  ${pkg.description}
  Author: ${pkg.author}
  Homepage: ${pkg.homepage}
*/
`;

export default summary;
