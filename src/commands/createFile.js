
const fs = require('fs');
const path = require('path');
const newModule = process.argv[2] || 'newModule';
const newModuleUpperCase = newModule.charAt(0).toUpperCase() + newModule.slice(1);
const moduleExample = 'moduleExample';
const moduleExampleUpperCase = 'ModuleExample';
const modulePath = 'src/modules/';
const folderPath = 'src/commands/moduleExample';

function copyAndRenameFiles(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);

    files.forEach((file) => {
        const sourceFilePath = path.join(source, file);
        let destinationFilePath = '';
        
        if (file.includes(moduleExample)) {
            const newFile = file.replace(moduleExample, newModule);
            destinationFilePath = path.join(destination, newFile);
        }else if (file.includes(moduleExampleUpperCase)) {
            const newFile = file.replace(moduleExampleUpperCase, newModuleUpperCase);
            destinationFilePath = path.join(destination, newFile);
        }
        else {
            destinationFilePath = path.join(destination, file);
        }

        if (fs.statSync(sourceFilePath).isDirectory()) {
            // Recursively copy subdirectories
            copyAndRenameFiles(sourceFilePath, destinationFilePath, newModule);
        } else {
            // Copy and rename files
            fs.copyFileSync(sourceFilePath, destinationFilePath);

            // Replace string in the file content
            replaceStringInFile(destinationFilePath, moduleExample, newModule);
            replaceStringInFile(destinationFilePath, moduleExampleUpperCase, newModuleUpperCase);
        }
    });
}

function replaceStringInFile(filePath, searchString, replaceString) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const modifiedContent = content.replace(new RegExp(searchString, 'g'), replaceString);
    fs.writeFileSync(filePath, modifiedContent, 'utf-8');
}

copyAndRenameFiles(folderPath, modulePath + newModule, newModule);

