import { redirect } from "next/navigation";
import utils from "../../../utils/utils";

export default async function paste({ params }: { params: Promise<{ key: string }> }) {
    const { key = "" } = await params;

    const [pasteId] = key.split(".");

    const data = await utils.getPasteById(pasteId);
    if (!data) {
        return redirect("/");
    };

    return <pre style={{ backgroundColor: "#1f1f1f", color: "#ffffffff", padding: "1em" }}>{data.content}</pre>
};