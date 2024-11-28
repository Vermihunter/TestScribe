import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export function getTemplate(templateName: string, data: Record<string, any>): string {
    const templatePath = path.join(__dirname, '..', 'templates', 'GoogleTest', templateName);
    if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateContent);
        return template(data);
    } else {
        throw new Error(`Template ${templateName} not found.`);
    }
}

// Usage
const welcomeMessage = getTemplate('test_parametrized.cpp', { TestSuiteName: 'Game', TemplateParams: 'int' });
console.log(welcomeMessage);
