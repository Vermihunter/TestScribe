import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export class TemplateHandler {
    private cache: Map<string, string> = new Map();


    getTemplate(templateFilePathName: string, data: Record<string, any>): string {
        return Handlebars.compile(this.cache.has(templateFilePathName)
            ? this.cache.get(templateFilePathName)
            : this.loadTemplate(templateFilePathName)
        )(data);
    }

    loadTemplate(templateFilePathName: string) {
        if(!fs.existsSync(templateFilePathName)) {
            throw new Error(`Template ${templateFilePathName} not found.`);
        }

        this.cache.set(templateFilePathName, fs.readFileSync(templateFilePathName, 'utf-8'));
        return this.cache.get(templateFilePathName);
    }
}


// Usage
//const welcomeMessage = getTemplate('test_parametrized.cpp', { TestSuiteName: 'Game', TemplateParams: 'int' });
//console.log(welcomeMessage);
