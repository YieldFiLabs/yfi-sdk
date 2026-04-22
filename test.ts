import { YieldFiSDK } from "./src/client";

async function main() {


    const sdk = await YieldFiSDK.create({
    gatewayUrl: "http://localhost:9501",
    });

    const points = await sdk.points.getPointsLeaderboard("eusd");

    console.log(points);


}

main().catch(console.error);