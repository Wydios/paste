import { redirect } from "next/navigation";
import utils from "@utils/utils";

export default async function paste({ params }: { params: Promise<{ key: string }> }) {
    const { key = "" } = await params;

    const [pasteId] = key.split(".");

    const data = await utils.getPasteById(pasteId);
    if (!data) {
        return redirect("/");
    };

    return (
        <div style={{
            backgroundColor: "#1f1f1f",
            minHeight: "100vh",
            width: "100vw"
        }}>
            <pre style={{
                margin: 0,
                padding: "1em",
                color: "#fff"
            }}>
            {data.content}
            </pre>
        </div>
    );
};