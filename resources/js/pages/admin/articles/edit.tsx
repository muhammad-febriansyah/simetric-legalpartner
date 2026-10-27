import { ArticleForm, type ArticleFormData } from "./article-form";

export default function EditArticle({ article }: { article: ArticleFormData }) {
    return <ArticleForm article={article} />;
}
