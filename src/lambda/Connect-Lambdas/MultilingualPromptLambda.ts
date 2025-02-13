



export class MultiLingualPromptLambda {

    private region= process.env.REGION
    private account = process.env.ACCOUNT
    public async handler(event: any)
    {
        console.log("Hello World Multilingual",this.region,this.account)
    }
}