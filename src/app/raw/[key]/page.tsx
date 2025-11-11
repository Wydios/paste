import { redirect } from "next/navigation";
import utils from "../../../utils/utils";

export default async function paste({ params }: { params: Promise<{ key: string }> }) {
    const { key = "" } = await params;

    const [pasteID] = key.split(".");

    const data = await utils.getPasteById(pasteID);
    if (!data) {
        return redirect("/");
    };

    return <pre style={{ backgroundColor: "#1f1f1f", color: "#ffffffff", padding: "1em" }}>{data.content}</pre>
};