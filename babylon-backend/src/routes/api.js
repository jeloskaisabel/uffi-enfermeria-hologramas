import { Router } from "express";
import { getCategories, getCategoryModels } from "../controllers/models.js";

const router = Router();

router.get('/categories', getCategories);
router.get('/models/:type', getCategoryModels);

export default router;