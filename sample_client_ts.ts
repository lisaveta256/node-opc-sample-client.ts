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

        // step 3 : browse
        const browseResult1 = await session.browse("RootFolder");
        session.browse("RootFolder",function(err, browseResult){
            if(!err){

                console.log("references of RootFolder :");
                console.log("RootFolder :", browseResult);
                console.log('-------------');
            }

        });
/*
        console.log("references of RootFolder :");
        console.log("RootFolder :", browseResult1.references);
        console.log('-------------');*/
        
      //  console.log(Object.keys(JSON.stringify(references)));
      //  console.log(JSON.stringify(references));


    // step 4 : read a variable with readVariableValue
    var naxV = 0;
    var noteToRead ={ nodeId:"ns=4;s=HMI_Power.PS_ABS_wState"/*, AttributeId: AttributeIds.Value*/};
    session.read(noteToRead, naxV, function(err,data){
        if(!err){
            console.log(" value1 = " , data);
        }else{
            console.log('Error')
        }
    })
  
   // session.read({nodeId:"ns=4;s=HMI_Power.PS_ABS_wState"},120,function(data){
   //     console.log(" value = " , data);
  //  })
   const dataValue2 = await session.readVariableValue("ns=4;s=HMI_Power.PS_ABS_wState");
   console.log(" value = " , dataValue2);
       // console.log("references of RootFolder :",browseResult.references); work
        /*for (const reference of browseResult.references) {
            console.log("   -> ", reference.browseName.toString());
            console.log('*********')
        }*/
        
      /*  Object.keys(references).forEach((key)=>{
            console.log("   -> ", references[key]);
            console.log('*********')
        });*/
        
        /*
// step 4 : read a variable with readVariableValue
_"read a variable with readVariableValue"

// step 4' : read a variable with read
_"read a variable with read"

// step 5: install a subscription and install a monitored item for 10 seconds
_"install a subscription"

// step 6: finding the nodeId of a node by Browse name
_"finding the nodeId of a node by Browse name"
*/
        // close session
        await session.close();

        // disconnecting
        await client.disconnect();
        console.log("done !");
    } catch (err) {
        console.log("An error has occured : ", err);
    }
}
main();


