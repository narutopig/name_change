import fetch from "node-fetch";
import { readFileSync } from "fs";

interface INameChange {
    email: string;
    password: string;
    newName: string;
}

let info: INameChange | undefined = undefined;
let timeout: number = isNaN(parseInt(process.argv[2]))
    ? new Date().getTime()
    : parseInt(process.argv[2]);

let currTime = new Date().getTime();

try {
    info = JSON.parse(readFileSync(__dirname + "/info.json", "utf-8"));
} catch (e) {
    console.log("Something went wrong. (maybe incorrect inputs?)");
}

if (!info) {
    process.exit(0);
}
const { email, password, newName } = info;

if (!email || !password || !newName) {
    console.log(
        "Please provide your username, password, and new name in a file called info.json in src/"
    );
    process.exit(0);
}

const main = async () => {
    const { accessToken } = await fetch(
        "https://authserver.mojang.com/authenticate",
        {
            method: "POST",
            body: JSON.stringify({
                agent: {
                    name: "Minecraft", // identifying which game is connecting
                    version: 1,
                },
                username: email,
                password: password,
                requestUser: "true", // request a response back containing user information
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => res.json());

    setTimeout(async () => {
        await fetch(
            "https://api.minecraftservices.com/minecraft/profile/name/" +
                newName,
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    console.log("Success");
                } else {
                    switch (res.status) {
                        case 400:
                            console.log("Invalid name");
                            break;
                        case 403:
                            console.log("Name unavailable");
                            break;
                        case 401:
                            console.log("Access token did not work");
                            break;
                        case 429:
                            console.log("Too many requests");
                            break;
                        case 500:
                            console.log("API lagged out");
                            break;
                        default:
                            console.log(
                                `We somehow got a status code ${res.status}`
                            );
                            break;
                    }
                }
            })
            .catch((err) => console.log(err));
    }, timeout - currTime);
};

main();
