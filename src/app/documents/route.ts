import { NextRequest, NextResponse } from "next/server";
import utils from "../../utils/utils";
import db from "../../utils/db";

export async function POST(request: NextRequest): Promise<NextResponse<{ error: string, message: string}> | NextResponse<{ key: string, raw: string }>> {
    try {
        const content = await request.text();
        if (!content) {
            return NextResponse.json(
                { error: "Bad Request", message: "No Content Provided" }, 
                { status: 400 }
            );
        };

        const pasteId = await utils.createId();

        await Promise.all([
            db.query("INSERT INTO pastes (id, content) VALUES (?, ?)", [pasteId, content]),
            utils.removeOldPastes()
        ]);

        return NextResponse.json({ key: pasteId, raw: `raw/${pasteId}` });
    } catch (error: unknown) {
        console.error("POST() | Error processing POST request:", error instanceof Error ? error.message : error);

        return NextResponse.json({ error: "Internal Server Error", message: "failed to Create Past" }, { status: 500 });
    };
};