import { NextRequest, NextResponse } from "next/server";
import utils from "../../utils/utils";
import db from "../../utils/db";

export async function POST(request: NextRequest) {
    try {
        const content = await request.text();
        if (!content) {
            return NextResponse.json(
                { error: "Bad Request", message: "No Content Provided" }, 
                { status: 400 }
            );
        };

        const pasteID = await utils.createId();
        await db.query("INSERT INTO pastes (id, content) VALUES (?, ?)", [pasteID, content])
        void utils.removeOldPastes();

        return NextResponse.json({
            key: pasteID,
            raw: `raw/${pasteID}`
        });
    } catch (error: any) {
        console.error("POST() | Error processing POST request:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: "failed to Create Past" },
            { status: 500 }
        );
    }
};