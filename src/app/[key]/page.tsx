import { redirect } from "next/navigation";
import { SyntaxHighlight } from "@components/syntaxHighlight";
import { Footer } from "@components/footer";
import utils from "@utils/utils";

export default async function paste({ params }: { params: Promise<{ key: string }> }) {
    const { key = "" } = await params;

    const [pasteId, extension] = key.split(".");

    const data = await utils.getPasteById(pasteId);
    if (!data) {
        return redirect("/");
    };

    return (
        <>
            <SyntaxHighlight content={data.content} extension={extension} />
            <Footer />
        </>
    );
};