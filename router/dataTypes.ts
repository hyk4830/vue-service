export interface articleInfo{
    image:string;
    status:String;
    statusName:string;
    descript:{
        title:string;
        content:String;
    }
    readingVolumn?:number;
    likesVolumn?:number;
    forwardingVolumn?:number
    createTime?:string;
}

export interface user{
    account:string;
    accountName:string;
    photo:string;
    level:string;
    levelName:string;
}
