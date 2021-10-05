import {
    OPCUAClient,
    MessageSecurityMode,
    SecurityPolicy,
    AttributeIds,
    makeBrowsePath,
    ClientSubscription,
    TimestampsToReturn,
    MonitoringParametersOptions,
    ReadValueIdOptions,
    ClientMonitoredItem,
    DataValue
} from "node-opcua-client";

const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};

const client = OPCUAClient.create({
    applicationName: "PLC1",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.Sign,
    securityPolicy: SecurityPolicy.Basic256Sha256,
    endpointMustExist: false
});

const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4840";

async function main() {
    try {
        // step 1 : connect to
        await client.connect(endpointUrl);
        console.log("connected !");

        // step 2 : createSession
        const session = await client.createSession();
        console.log("session created !");



        // step 4 : read a variable with readVariableValue
        const maxAge = 0;
        const nodeToRead = {
            nodeId: "ns=3;s=Scalar_Simulation_String",
            attributeId: AttributeIds.Value
        };
        const dataValue = await session.read(nodeToRead, maxAge);
        console.log(" value ", dataValue.toString());

        // step 4' : read a variable with read
        const dataValue2 = await session.read({
            nodeId: "ns=1;s=free_memory",
            attributeId: AttributeIds.Value
        });
        console.log(" value = ", dataValue2.toString());

        // close session
        await session.close();

        // disconnecting
        await client.disconnect();
        console.log("done !");
    } catch(err) {
        console.log("An error has occured : ",err);
    }
}
main();


