import { redirect } from "next/navigation";
import utils from "../../utils/utils";
import { SyntaxHighlight } from "../../utils/components/syntaxHighlight";
import { Footer } from "../../utils/components/footer";

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