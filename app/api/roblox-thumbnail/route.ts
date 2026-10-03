import {NextResponse} from "next/server";

export async function GET(req:Request){
  try{
    const placeId=new URL(req.url).searchParams.get("placeId");
    if(!placeId) return NextResponse.json({error:"Missing placeId"},{status:400});
    const universeRes=await fetch("https://apis.roblox.com/universes/v1/places/"+encodeURIComponent(placeId)+"/universe",{cache:"no-store"});
    if(!universeRes.ok) return NextResponse.json({error:"Could not resolve Roblox game"},{status:404});
    const universe=await universeRes.json();
    const universeId=universe?.universeId;
    if(!universeId) return NextResponse.json({error:"No universe found"},{status:404});
    const thumbRes=await fetch("https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds="+encodeURIComponent(String(universeId))+"&size=768x432&format=Png&isCircular=false",{cache:"no-store"});
    if(!thumbRes.ok) return NextResponse.json({error:"Could not load Roblox thumbnail"},{status:502});
    const data=await thumbRes.json();
    const imageUrl=data?.data?.[0]?.thumbnails?.[0]?.imageUrl;
    if(!imageUrl) return NextResponse.json({error:"Roblox thumbnail unavailable"},{status:404});
    return NextResponse.redirect(imageUrl,307);
  }catch{
    return NextResponse.json({error:"Roblox thumbnail unavailable"},{status:500});
  }
}
