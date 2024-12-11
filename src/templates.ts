import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

/**
 * Handlebars template handler with caching mechanism
 */
export class TemplateHandler {
    private static cache: Map<string, string> = new Map();

    static getTemplate(templateFilePathName: string, data: Record<string, any>): string {
        return Handlebars.compile(TemplateHandler.cache.has(templateFilePathName)
            ? TemplateHandler.cache.get(templateFilePathName)
            : TemplateHandler.loadTemplate(templateFilePathName)
        )(data);
    }

    private static loadTemplate(templateFilePathName: string) {
        if(!fs.existsSync(templateFilePathName)) {
            throw new Error(`Template ${templateFilePathName} not found.`);
        }

        this.cache.set(templateFilePathName, fs.readFileSync(templateFilePathName, 'utf-8'));
        return this.cache.get(templateFilePathName);
    }
}
