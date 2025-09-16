import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, '..', '..', 'public', 'models');

const normalizeName = (name) => {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '-');
}

const buildEntry = async (item, dirPath, relativePath, reader) => {
    const fullPath = path.join(dirPath, item.name);
    const itemRelativePath = path.join(relativePath, item.name);

    if (item.isDirectory()) {
        const fixedName = normalizeName(item.name);
        return [fixedName, { originalName: item.name, children: await reader(fullPath, itemRelativePath) }];
    }

    if (item.isFile()) {
        const fileName = path.parse(item.name).name;
        const fixedName = normalizeName(fileName);
        const urlPath = itemRelativePath.split(path.sep).join('/');
        const encodedUrlPath = urlPath
            .split('/')
            .map(segment => encodeURIComponent(segment))
            .join('/');
        return [fixedName, { originalName: fileName, modelURL: `models/${encodedUrlPath}` }];
    }

    return null;
}

export const readDictory = async (dirPath, relativePath = "") => {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    const entries = await Promise.all(items.map((item) => buildEntry(item, dirPath, relativePath, readDictory)));

    return Object.fromEntries(entries.filter(Boolean));

}

export const getModelsHierarchy = async () => readDictory(modelsDir);


export const getTopLevelCategories = async () => {
    const hierarchy = await getModelsHierarchy();
    const categories = Object.keys(hierarchy).map(key => {
        return {
            fixedName: key,
            originalName: hierarchy[key].originalName
        };
    });
    return categories;
};

export const getCategoryHierarchy = async (categoryName) => {
    const hierarchy = await getModelsHierarchy();
    const category = hierarchy[categoryName];

    if (category) {
        return category;
    } else {
        return null;
    }
};
