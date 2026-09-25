import {NextResponse} from "next/server";

const EMAIL=["Spiderstudios137483","gmail.com"].join("@");

export async function POST(req:Request){
  try{
    const d=await req.json();
    const required=["discord","age","role","portfolio","experience","shipped","skills","problem","teamwork","why","availability","timezone"];
    if(required.some(k=>!String(d[k]||"").trim())) return NextResponse.json({error:"Missing fields"},{status:400});
    const clean=(v:any)=>String(v??"").trim();
    const form=new URLSearchParams();
    form.set("_subject","Spider Studios Developer Application");
    form.set("_captcha","false");
    form.set("_template","box");
    if(clean(d.email)) form.set("_replyto",clean(d.email));
    const fields=[
      ["Discord Username",d.discord],["Email",d.email||"Not provided"],["Age",d.age],["Role",d.role],
      ["Timezone",d.timezone],["Availability",d.availability],["Start Date",d.startDate||"Not specified"],
      ["Portfolio / Examples",d.portfolio],["Development Experience",d.experience],
      ["What Have You Actually Shipped?",d.shipped],["Technical Skills",d.skills],
      ["Hardest Problem You've Solved",d.problem],["Team Experience",d.teamwork],
      ["Why Spider Studios?",d.why],["Compensation Expectations",d.compensation||"Not specified"],
      ["Anything Else",d.anything||"None"]
    ] as const;
    for(const [name,value] of fields) form.set(name,clean(value));
    const r=await fetch("https://formsubmit.co/ajax/"+EMAIL,{
      method:"POST",
      headers:{"content-type":"application/x-www-form-urlencoded","accept":"application/json"},
      body:form.toString()
    });
    if(!r.ok){
      const details=await r.text().catch(()=>"");
      console.error("Application email failed",r.status,details);
      return NextResponse.json({error:"Application email failed"},{status:502});
    }
    return NextResponse.json({ok:true});
  }catch(error){
    console.error("Application submission failed",error);
    return NextResponse.json({error:"Invalid submission"},{status:400});
  }
}