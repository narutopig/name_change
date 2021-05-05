import fetch from "node-fetch";
import { readFileSync } from "fs";
import { IGetToken, getToken, changeName } from "./functions";
import path from "path";
import { fileExists } from "./util";

let options: IGetToken;

const [
    filePath,
    name,
    timeout = new Date().getTime().toString(),
] = process.argv.slice(2);

const optionsPath = path.resolve(process.cwd(), filePath);

if (!fileExists(optionsPath)) {
    console.log("Invalid file path.");
    process.exit(0);
}
options = JSON.parse(readFileSync(optionsPath, "utf-8"));

if (isNaN(parseInt(timeout))) {
    console.log("Invalid time.");
    process.exit(0);
}

async function main() {
    const accessToken = await getToken(options);
    const timeoutDate = new Date(parseInt(timeout));
    console.log(
        `Changing name at ${timeoutDate.toTimeString()} ${timeoutDate.toDateString()}`
    );
    setTimeout(async () => {
        await changeName(name, accessToken).then((res) => console.log(res));
    }, parseInt(timeout) - new Date().getTime());
}

main();
