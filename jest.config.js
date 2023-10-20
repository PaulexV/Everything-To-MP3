module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.spec.ts$', // Exécute seulement les fichiers avec .spec.ts à la fin
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      '**/*.(t|j)s', // Collecte la couverture des fichiers TypeScript et JavaScript
      '!**/node_modules/**',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
      // Vos mappings si nécessaire, par exemple pour les alias de chemin
    },
    setupFilesAfterEnv: [
      // Fichiers à exécuter après l'environnement de test est établi, si nécessaire
    ],
  };