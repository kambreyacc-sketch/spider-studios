import { NextResponse } from "next/server";
export async function POST(request:Request){
 const webhook=process.env.DISCORD_APPLICATION_WEBHOOK_URL;
 if(!webhook)return NextResponse.json({error:"Application system is not configured."},{status:500});
 const data=await request.json();
 const required=["discord","age","role","portfolio","experience","shipped","skills","problem","teamwork","why","availability","timezone"];
 if(required.some(k=>!String(data[k]||"").trim()))return NextResponse.json({error:"Missing required fields."},{status:400});
 const fields=[["Discord",data.discord],["Age",data.age],["Role",data.role],["Timezone",data.timezone],["Availability",data.availability],["Start Date",data.startDate||"Not specified"],["Portfolio / Examples",data.portfolio],["Experience",data.experience],["What They Shipped",data.shipped],["Technical Skills",data.skills],["Hardest Problem Solved",data.problem],["Team Experience",data.teamwork],["Why Spider Studios",data.why],["Compensation",data.compensation||"Not specified"],["Anything Else",data.anything||"None"]];
 const embed={title:"New Spider Studios Application",description:"**Role:** "+data.role+"\\n**Discord:** "+data.discord,color:16777215,fields:fields.map(([name,value])=>({name,value:String(value).slice(0,1024),inline:false})),footer:{text:"Spider Studios • Careers"},timestamp:new Date().toISOString()};
 const result=await fetch(webhook,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({embeds:[embed],allowed_mentions:{parse:[]}})});
 if(!result.ok)return NextResponse.json({error:"Could not deliver application."},{status:502});
 return NextResponse.json({ok:true});
}