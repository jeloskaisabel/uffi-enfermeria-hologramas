import { getTopLevelCategories, getCategoryHierarchy } from "../service/models.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await getTopLevelCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving categories", error: error.message });
    }
};

export const getCategoryModels = async (req, res) => {
    try {
        const categoryName = req.params.type;
        const data = await getCategoryHierarchy(categoryName);

        if (!data) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving models for the category", error: error.message });
    }
};
