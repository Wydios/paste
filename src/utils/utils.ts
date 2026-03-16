import db from "./db";

class utils {
    private charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    public async createId(): Promise<string> {
        let hasId = true;
        let pasteId = "";

        while (hasId) {
            const randomValue = new Uint32Array(10);
            crypto.getRandomValues(randomValue);

            pasteId = Array.from(randomValue).map((x) => this.charset[x % this.charset.length]).join("");
            hasId = await db.entryExists("SELECT 1 FROM pastes WHERE id = ?", [pasteId]);
        }

        return pasteId;
    };

    public getPasteById(pasteId: string): Promise<{ content: string } | null> {
        return db.queryOne<{ content: string }>("SELECT content FROM pastes WHERE id = ?", [pasteId]);
    };

    public async removeOldPastes(): Promise<void> {
        const rows = await db.query("DELETE FROM pastes WHERE created_at < NOW() - INTERVAL 7 DAY");

        const result = rows[0]?.affectedRows || 0;
        if (result > 0) {
            console.log(`Cleaned up ${result} old pastes`);
        }
    };

    public gifs: Record<string, string> = {
        wydiosCheer: "gif",
        wydiosJam: "gif"
    };

    public replaceEmotes(text: string): string {
        return text.replace(/\{([a-zA-Z0-9]+)\}/g, (match, name) => {
            return `:${name}:`;
        });
    };
};

export default new utils();