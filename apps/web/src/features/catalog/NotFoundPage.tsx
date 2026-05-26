import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <section>
            <h2 className="text-xl font-semibold">Page not Found</h2>
            <Link to="/products" className="text-blue-600 underline">Back to products</Link>
        </section>
    )
}