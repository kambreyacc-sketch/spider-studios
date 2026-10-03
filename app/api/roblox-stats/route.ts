import {NextResponse} from "next/server";

type InputGame={robloxId?:string;universeId?:string;title?:string};

type RobloxGame={
  id:number;
  name:string;
  rootPlaceId?:number;
  playing?:number;
  visits?:number;
  favoritedCount?:number;
};

async function getUniverseId(game:InputGame){
  if(game.universeId) return game.universeId;
  if(!game.robloxId) return null;
  const r=await fetch("https://apis.roblox.com/universes/v1/places/"+encodeURIComponent(game.robloxId)+"/universe",{cache:"no-store"});
  if(!r.ok) return null;
  const data=await r.json();
  return data?.universeId?String(data.universeId):null;
}

export async function POST(req:Request){
  try{
    const body=await req.json();
    const input:InputGame[]=Array.isArray(body?.games)?body.games:[];
    const resolved=await Promise.all(input.map(async game=>({game,universeId:await getUniverseId(game)})));
    const usable=resolved.filter(x=>x.universeId);
    if(!usable.length) return NextResponse.json({error:"No valid Roblox game IDs found."},{status:400});

    const ids=usable.map(x=>x.universeId).join(",");
    const r=await fetch("https://games.roblox.com/v1/games?universeIds="+ids,{cache:"no-store"});
    if(!r.ok) return NextResponse.json({error:"Roblox stats unavailable right now."},{status:502});
    const json=await r.json();
    const byUniverse=new Map<string,InputGame>();
    usable.forEach(x=>byUniverse.set(String(x.universeId),x.game));

    const games=(json.data||[] as RobloxGame[]).map((x:RobloxGame)=>({
      robloxId:byUniverse.get(String(x.id))?.robloxId||String(x.rootPlaceId||""),
      universeId:String(x.id),
      title:byUniverse.get(String(x.id))?.title||x.name,
      players:Number(x.playing||0),
      visits:Number(x.visits||0),
      favorites:Number(x.favoritedCount||0)
    }));

    return NextResponse.json({games,updatedAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
  }catch{
    return NextResponse.json({error:"Could not load Roblox analytics."},{status:500});
  }
}
