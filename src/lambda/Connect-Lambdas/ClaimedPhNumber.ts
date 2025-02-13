



export class ClaimedPhNumberLambda {

    private region= process.env.REGION
    private account = process.env.ACCOUNT
    public async handler(event: any)
    {
        console.log("Hello World",this.region,this.account)
    }
}